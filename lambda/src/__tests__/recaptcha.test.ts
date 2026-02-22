// Set env var BEFORE importing the module so the module-level constant picks it up
process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';
process.env.RECAPTCHA_SCORE_THRESHOLD = '0.5';

import type { APIGatewayProxyEvent } from 'aws-lambda';

// Mock SES
const mockSend = jest.fn().mockResolvedValue({});
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn(() => ({ send: mockSend })),
  SendEmailCommand: jest.requireActual('@aws-sdk/client-ses').SendEmailCommand,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Import handler AFTER env vars are set
import { handler } from '../index';

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
        sourceIp: ip || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
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
  name: 'Jane Smith',
  email: 'jane@example.com',
  message: 'Testing reCAPTCHA.',
  recaptchaToken: 'test-token',
};

function mockRecaptchaResponse(data: object) {
  mockFetch.mockResolvedValueOnce({
    json: () => Promise.resolve(data),
  });
}

describe('reCAPTCHA verification (with secret key set)', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockSend.mockReset().mockResolvedValue({});
  });

  it('passes when score is above threshold', async () => {
    mockRecaptchaResponse({
      success: true,
      score: 0.9,
      action: 'submit_contact',
      challenge_ts: '2026-01-01T00:00:00Z',
      hostname: 'coatesvillefarm.com',
    });

    const event = makeEvent({ body: JSON.stringify(validBody) });
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).success).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('fails when score is below threshold', async () => {
    mockRecaptchaResponse({
      success: true,
      score: 0.2,
      action: 'submit_contact',
      challenge_ts: '2026-01-01T00:00:00Z',
      hostname: 'coatesvillefarm.com',
    });

    const event = makeEvent({ body: JSON.stringify(validBody) });
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).code).toBe('RECAPTCHA_FAILED');
  });

  it('fails when reCAPTCHA verification returns success: false', async () => {
    mockRecaptchaResponse({
      success: false,
      'error-codes': ['invalid-input-response'],
    });

    const event = makeEvent({ body: JSON.stringify(validBody) });
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).code).toBe('RECAPTCHA_FAILED');
  });

  it('fails when action does not match', async () => {
    mockRecaptchaResponse({
      success: true,
      score: 0.9,
      action: 'wrong_action',
      challenge_ts: '2026-01-01T00:00:00Z',
      hostname: 'coatesvillefarm.com',
    });

    const event = makeEvent({ body: JSON.stringify(validBody) });
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).code).toBe('RECAPTCHA_FAILED');
  });

  it('fails when no reCAPTCHA token is provided', async () => {
    const bodyWithoutToken = { ...validBody, recaptchaToken: '' };

    const event = makeEvent({ body: JSON.stringify(bodyWithoutToken) });
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).code).toBe('RECAPTCHA_FAILED');
    // fetch should NOT have been called since token was empty
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('handles network errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const event = makeEvent({ body: JSON.stringify(validBody) });
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).code).toBe('RECAPTCHA_FAILED');
  });
});
