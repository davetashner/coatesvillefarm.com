import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' });

// In-memory rate limiting (resets when Lambda cold starts)
// For production, consider using DynamoDB for persistent rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Max submissions per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honey?: string;
}

const FARM_EMAIL = 'coatesvillefarm@gmail.com';

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

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildFarmNotificationEmail(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; color: #1b3c1b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f1fce9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #1b5e20; }
    .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From:</div>
        <div class="value">${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      Sent via Coatesville Farm website contact form
    </div>
  </div>
</body>
</html>
`;
}

function buildConfirmationEmail(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; color: #1b3c1b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f1fce9; padding: 20px; border-radius: 0 0 8px 8px; }
    .message-box { margin-top: 15px; padding: 15px; background-color: white; border-radius: 4px; border-left: 4px solid #2e7d32; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Contacting Us!</h1>
    </div>
    <div class="content">
      <p>Dear ${escapeHtml(data.name)},</p>
      <p>Thank you for reaching out to Coatesville Farm. We have received your message and will get back to you as soon as possible.</p>
      <p><strong>Your message:</strong></p>
      <div class="message-box">
        ${escapeHtml(data.message).replace(/\n/g, '<br>')}
      </div>
      <p style="margin-top: 20px;">Best regards,<br>The Coatesville Farm Team</p>
    </div>
    <div class="footer">
      <p>Coatesville Farm<br>
      14072 Old Ridge Road, Beaverdam, VA<br>
      (804) 449-6016</p>
    </div>
  </div>
</body>
</html>
`;
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://coatesvillefarm.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get client IP for rate limiting
    const clientIp = event.requestContext.identity?.sourceIp || 'unknown';

    // Check rate limit
    if (isRateLimited(clientIp)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      };
    }

    // Parse and validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const data: ContactFormData = JSON.parse(event.body);

    // Honeypot check (spam bot detection)
    if (data.honey) {
      // Silently accept but don't process (looks successful to bots)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name, email, and message are required' }),
      };
    }

    // Validate email format
    if (!validateEmail(data.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' }),
      };
    }

    // Validate field lengths
    if (data.name.length > 100 || data.email.length > 100 || data.message.length > 1000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Field length exceeded' }),
      };
    }

    // Send notification email to farm
    await ses.send(new SendEmailCommand({
      Source: FARM_EMAIL,
      Destination: { ToAddresses: [FARM_EMAIL] },
      ReplyToAddresses: [data.email],
      Message: {
        Subject: { Data: `Contact Form: ${data.name}` },
        Body: {
          Html: { Data: buildFarmNotificationEmail(data) },
          Text: { Data: `New contact from ${data.name} (${data.email}):\n\n${data.message}` },
        },
      },
    }));

    // Send confirmation email to visitor
    await ses.send(new SendEmailCommand({
      Source: FARM_EMAIL,
      Destination: { ToAddresses: [data.email] },
      Message: {
        Subject: { Data: 'Thank you for contacting Coatesville Farm' },
        Body: {
          Html: { Data: buildConfirmationEmail(data) },
          Text: { Data: `Dear ${data.name},\n\nThank you for reaching out to Coatesville Farm. We have received your message and will get back to you as soon as possible.\n\nYour message:\n${data.message}\n\nBest regards,\nThe Coatesville Farm Team` },
        },
      },
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Message sent successfully!' }),
    };

  } catch (error) {
    console.error('Error processing contact form:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send message. Please try again later.' }),
    };
  }
}
