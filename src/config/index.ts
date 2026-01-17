/**
 * Application configuration
 */
export const CONFIG = {
  /**
   * Contact form API endpoint
   * Update this after deploying the Lambda function
   */
  CONTACT_API_URL: import.meta.env.VITE_CONTACT_API_URL || '/api/contact',

  /**
   * Google reCAPTCHA v3 site key
   * Get this from https://www.google.com/recaptcha/admin
   * If not set, reCAPTCHA verification is skipped (form still works with honeypot)
   */
  RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '',
} as const;
