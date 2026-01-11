/**
 * Application configuration
 */
export const CONFIG = {
  /**
   * Contact form API endpoint
   * Update this after deploying the Lambda function
   */
  CONTACT_API_URL: import.meta.env.VITE_CONTACT_API_URL || '/api/contact',
} as const;
