/**
 * Type definitions for Google reCAPTCHA v3
 *
 * reCAPTCHA v3 runs invisibly and returns a score (0.0 to 1.0)
 * indicating how likely the user is human.
 *
 * Usage:
 *   await window.grecaptcha.ready(() => {});
 *   const token = await window.grecaptcha.execute('site_key', { action: 'submit' });
 */

interface GrecaptchaExecuteOptions {
  /** Action name for this verification (used for analytics and score tuning) */
  action: string;
}

interface Grecaptcha {
  /**
   * Wait for reCAPTCHA to be ready before executing
   * @param callback Function to call when ready
   */
  ready(callback: () => void): void;

  /**
   * Execute reCAPTCHA v3 verification
   * @param siteKey Your reCAPTCHA v3 site key
   * @param options Options including the action name
   * @returns Promise resolving to a token string
   */
  execute(siteKey: string, options: GrecaptchaExecuteOptions): Promise<string>;

  /**
   * Render an explicit reCAPTCHA widget (typically not used with v3)
   */
  render(container: string | HTMLElement, parameters: object): number;

  /**
   * Reset a reCAPTCHA widget
   */
  reset(widgetId?: number): void;
}

declare global {
  interface Window {
    grecaptcha: Grecaptcha;
  }
}

export {};
