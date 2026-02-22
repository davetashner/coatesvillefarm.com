import type { APIGatewayProxyEvent } from 'aws-lambda';

// Mock SES before importing handler
const mockSend = jest.fn().mockResolvedValue({});
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn(() => ({ send: mockSend })),
  SendEmailCommand: jest.requireActual('@aws-sdk/client-ses').SendEmailCommand,
}));

// Mock fetch for reCAPTCHA verification
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { handler } from '../index';

// Counter for unique IPs to avoid rate limiting between tests
let ipCounter = 0;
function uniqueIp(): string {
  ipCounter++;
  return `10.0.0.${ipCounter}`;
}

function makeEvent(overrides: Partial<APIGatewayProxyEvent> = {}, ip?: string): APIGatewayProxyEvent {
  return {
    httpMethod: 'POST',
    headers: { origin: 'https://coatesvillefarm.com' },
    body: null,
    path: '/contact',
    resource: '/contact',
    pathParameters: null,
    queryStringParameters: null,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    stageVariables: null,
    isBase64Encoded: false,
    requestContext: {
      accountId: '123456789',
      apiId: 'api-id',
      authorizer: null,
      protocol: 'HTTP/1.1',
      httpMethod: 'POST',
      identity: {
        sourceIp: ip || uniqueIp(),
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        user: null,
        userAgent: null,
        userArn: null,
      },
      path: '/contact',
      stage: 'prod',
      requestId: 'req-id',
      requestTimeEpoch: 0,
      resourceId: 'resource-id',
      resourcePath: '/contact',
    },
    ...overrides,
  };
}

const validBody = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello from the test.',
  recaptchaToken: 'valid-token',
};

describe('handler', () => {
  beforeEach(() => {
    // reCAPTCHA secret not set by default, so verification is skipped
    mockFetch.mockReset();
    mockSend.mockReset().mockResolvedValue({});
  });

  describe('OPTIONS request', () => {
    it('returns 200 with CORS headers', async () => {
      const event = makeEvent({ httpMethod: 'OPTIONS' });
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(result.headers?.['Access-Control-Allow-Origin']).toBe('https://coatesvillefarm.com');
      expect(result.headers?.['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
      expect(result.headers?.['Access-Control-Allow-Headers']).toBe('Content-Type');
      expect(result.body).toBe('');
    });
  });

  describe('missing body', () => {
    it('returns 400 when body is null', async () => {
      const event = makeEvent({ body: null });
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Request body is required');
    });
  });

  describe('valid form submission', () => {
    it('succeeds and sends emails', async () => {
      const event = makeEvent({ body: JSON.stringify(validBody) });
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body).success).toBe(true);
      expect(JSON.parse(result.body).message).toBe('Message sent successfully!');
      // Two emails: notification + confirmation
      expect(mockSend).toHaveBeenCalledTimes(2);
    });
  });

  describe('validation errors', () => {
    it('returns 400 for invalid email', async () => {
      const event = makeEvent({
        body: JSON.stringify({ ...validBody, email: 'not-an-email' }),
      });
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Invalid email address');
    });

    it('returns 400 when name is missing', async () => {
      const event = makeEvent({
        body: JSON.stringify({ ...validBody, name: '' }),
      });
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Name, email, and message are required');
    });

    it('returns 400 when message is missing', async () => {
      const event = makeEvent({
        body: JSON.stringify({ ...validBody, message: '' }),
      });
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Name, email, and message are required');
    });

    it('returns 400 when name exceeds 100 characters', async () => {
      const event = makeEvent({
        body: JSON.stringify({ ...validBody, name: 'A'.repeat(101) }),
      });
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Field length exceeded');
    });

    it('returns 400 when email exceeds 100 characters', async () => {
      const longEmail = 'a'.repeat(90) + '@example.com';
      const event = makeEvent({
        body: JSON.stringify({ ...validBody, email: longEmail }),
      });
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Field length exceeded');
    });

    it('returns 400 when message exceeds 1000 characters', async () => {
      const event = makeEvent({
        body: JSON.stringify({ ...validBody, message: 'M'.repeat(1001) }),
      });
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Field length exceeded');
    });
  });

  describe('honeypot', () => {
    it('returns 200 silently without sending emails', async () => {
      const event = makeEvent({
        body: JSON.stringify({ ...validBody, honey: 'bot-filled-this' }),
      });
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body).success).toBe(true);
      // Should NOT have a success message (silent accept)
      expect(JSON.parse(result.body).message).toBeUndefined();
      // No emails sent
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('rate limiting', () => {
    it('returns 429 after exceeding rate limit', async () => {
      // Use a dedicated IP for this test
      const ip = '10.99.99.99';

      for (let i = 0; i < 5; i++) {
        const event = makeEvent({ body: JSON.stringify(validBody) }, ip);
        const result = await handler(event);
        expect(result.statusCode).toBe(200);
      }

      // 6th request should be rate limited
      const event = makeEvent({ body: JSON.stringify(validBody) }, ip);
      const result = await handler(event);

      expect(result.statusCode).toBe(429);
      expect(JSON.parse(result.body).error).toContain('Too many requests');
    });
  });

  describe('error handling', () => {
    it('returns 500 when SES fails', async () => {
      mockSend.mockRejectedValueOnce(new Error('SES failure'));

      const event = makeEvent({ body: JSON.stringify(validBody) });
      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).error).toContain('Failed to send message');
    });

    it('returns 500 when body is invalid JSON', async () => {
      const event = makeEvent({ body: 'not-json' });
      const result = await handler(event);

      expect(result.statusCode).toBe(500);
    });
  });
});
