import { SendEmailCommand } from '@aws-sdk/client-ses';

// Mock SES - declare mock before jest.mock so hoisting works
const mockSend = jest.fn().mockResolvedValue({});
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn(() => ({ send: mockSend })),
  SendEmailCommand: jest.requireActual('@aws-sdk/client-ses').SendEmailCommand,
}));

import { sendNotificationEmail, sendConfirmationEmail, ContactFormData } from '../emails';

const validFormData: ContactFormData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, I am interested in visiting.',
};

describe('sendNotificationEmail', () => {
  it('calls SES with correct parameters', async () => {
    await sendNotificationEmail(validFormData);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const command = mockSend.mock.calls[0][0] as SendEmailCommand;
    const input = command.input;

    expect(input.Source).toBe('contact@coatesvillefarm.com');
    expect(input.Destination?.ToAddresses).toEqual(['coatesvillefarm@gmail.com']);
    expect(input.ReplyToAddresses).toEqual(['john@example.com']);
    expect(input.Message?.Subject?.Data).toBe('Contact Form: John Doe');
    expect(input.Message?.Body?.Html?.Data).toContain('New Contact Form Submission');
    expect(input.Message?.Body?.Html?.Data).toContain('John Doe');
    expect(input.Message?.Body?.Html?.Data).toContain('john@example.com');
    expect(input.Message?.Body?.Html?.Data).toContain('Hello, I am interested in visiting.');
    expect(input.Message?.Body?.Text?.Data).toContain('john@example.com');
  });

  it('escapes HTML in user input', async () => {
    const xssData: ContactFormData = {
      name: '<script>alert("xss")</script>',
      email: 'test@example.com',
      message: 'Hello <b>bold</b> & "quoted"',
    };

    await sendNotificationEmail(xssData);

    const command = mockSend.mock.calls[0][0] as SendEmailCommand;
    const html = command.input.Message?.Body?.Html?.Data || '';

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp;');
    expect(html).toContain('&quot;quoted&quot;');
  });
});

describe('sendConfirmationEmail', () => {
  it('calls SES with correct parameters', async () => {
    await sendConfirmationEmail(validFormData);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const command = mockSend.mock.calls[0][0] as SendEmailCommand;
    const input = command.input;

    expect(input.Source).toBe('contact@coatesvillefarm.com');
    expect(input.Destination?.ToAddresses).toEqual(['john@example.com']);
    expect(input.Message?.Subject?.Data).toBe('Thank you for contacting Coatesville Farm');
    expect(input.Message?.Body?.Html?.Data).toContain('Thank You for Contacting Us');
    expect(input.Message?.Body?.Html?.Data).toContain('John Doe');
    expect(input.Message?.Body?.Html?.Data).toContain('Hello, I am interested in visiting.');
    expect(input.Message?.Body?.Text?.Data).toContain('Dear John Doe');
  });

  it('escapes HTML in confirmation email', async () => {
    const xssData: ContactFormData = {
      name: 'User & <Friend>',
      email: 'test@example.com',
      message: "It's a \"test\" with <tags>",
    };

    await sendConfirmationEmail(xssData);

    const command = mockSend.mock.calls[0][0] as SendEmailCommand;
    const html = command.input.Message?.Body?.Html?.Data || '';

    expect(html).toContain('User &amp; &lt;Friend&gt;');
    expect(html).toContain('&#039;');
    expect(html).toContain('&lt;tags&gt;');
  });
});
