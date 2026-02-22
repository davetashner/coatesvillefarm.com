import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' });

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'contact@coatesvillefarm.com';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'coatesvillefarm@gmail.com';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honey?: string;
  recaptchaToken?: string;
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

export async function sendNotificationEmail(data: ContactFormData): Promise<void> {
  await ses.send(new SendEmailCommand({
    Source: SENDER_EMAIL,
    Destination: { ToAddresses: [RECIPIENT_EMAIL] },
    ReplyToAddresses: [data.email],
    Message: {
      Subject: { Data: `Contact Form: ${data.name}` },
      Body: {
        Html: { Data: buildFarmNotificationEmail(data) },
        Text: { Data: `New contact from ${data.name} (${data.email}):\n\n${data.message}` },
      },
    },
  }));
}

export async function sendConfirmationEmail(data: ContactFormData): Promise<void> {
  await ses.send(new SendEmailCommand({
    Source: SENDER_EMAIL,
    Destination: { ToAddresses: [data.email] },
    Message: {
      Subject: { Data: 'Thank you for contacting Coatesville Farm' },
      Body: {
        Html: { Data: buildConfirmationEmail(data) },
        Text: { Data: `Dear ${data.name},\n\nThank you for reaching out to Coatesville Farm. We have received your message and will get back to you as soon as possible.\n\nYour message:\n${data.message}\n\nBest regards,\nThe Coatesville Farm Team` },
      },
    },
  }));
}
