import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ContactFormData, sendNotificationEmail, sendConfirmationEmail } from './emails';

// Configuration from environment variables (set via CDK)
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';
const RECAPTCHA_SCORE_THRESHOLD = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5');
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://coatesvillefarm.com').split(',');

function getCorsOrigin(requestOrigin: string | undefined): string {
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin;
  }
  return ALLOWED_ORIGINS[0];
}

// In-memory rate limiting (resets when Lambda cold starts)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

async function verifyRecaptcha(token: string): Promise<{ valid: boolean; score: number }> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY not configured, skipping verification');
    return { valid: true, score: 1.0 };
  }

  if (!token) {
    console.error('No reCAPTCHA token provided');
    return { valid: false, score: 0 };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(token)}`,
    });

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return { valid: false, score: 0 };
    }

    if (data.action !== 'submit_contact') {
      console.error('reCAPTCHA action mismatch. Expected: submit_contact, Got:', data.action);
      return { valid: false, score: data.score };
    }

    const isValid = data.score >= RECAPTCHA_SCORE_THRESHOLD;
    if (!isValid) {
      console.warn(`reCAPTCHA score ${data.score} below threshold ${RECAPTCHA_SCORE_THRESHOLD}`);
    }

    return { valid: isValid, score: data.score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { valid: false, score: 0 };
  }
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateFormData(data: ContactFormData): string | null {
  if (!data.name || !data.email || !data.message) {
    return 'Name, email, and message are required';
  }
  if (!validateEmail(data.email)) {
    return 'Invalid email address';
  }
  if (data.name.length > 100 || data.email.length > 100 || data.message.length > 1000) {
    return 'Field length exceeded';
  }
  return null;
}

function jsonResponse(statusCode: number, headers: Record<string, string>, body: object): APIGatewayProxyResult {
  return { statusCode, headers, body: JSON.stringify(body) };
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const requestOrigin = event.headers?.origin || event.headers?.Origin;
  const corsOrigin = getCorsOrigin(requestOrigin);

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const clientIp = event.requestContext.identity?.sourceIp || 'unknown';
    if (isRateLimited(clientIp)) {
      return jsonResponse(429, headers, { error: 'Too many requests. Please try again later.' });
    }

    if (!event.body) {
      return jsonResponse(400, headers, { error: 'Request body is required' });
    }

    const data: ContactFormData = JSON.parse(event.body);

    // Honeypot check — silently accept but don't process
    if (data.honey) {
      return jsonResponse(200, headers, { success: true });
    }

    const recaptchaResult = await verifyRecaptcha(data.recaptchaToken || '');
    if (!recaptchaResult.valid) {
      return jsonResponse(400, headers, { error: 'Verification failed. Please try again.', code: 'RECAPTCHA_FAILED' });
    }

    const validationError = validateFormData(data);
    if (validationError) {
      return jsonResponse(400, headers, { error: validationError });
    }

    await sendNotificationEmail(data);
    await sendConfirmationEmail(data);

    return jsonResponse(200, headers, { success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return jsonResponse(500, headers, { error: 'Failed to send message. Please try again later.' });
  }
}
