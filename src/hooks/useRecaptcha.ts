import { useEffect, useRef, useCallback } from 'react';
import { CONFIG } from '@/config';

/**
 * Hook that loads reCAPTCHA v3 and provides a token getter.
 * Returns empty string if reCAPTCHA is not configured or not ready.
 */
export function useRecaptcha() {
  const ready = useRef(false);

  useEffect(() => {
    if (!CONFIG.RECAPTCHA_SITE_KEY) {
      ready.current = true;
      return;
    }

    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        ready.current = true;
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${CONFIG.RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        ready.current = true;
      });
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        `script[src^="https://www.google.com/recaptcha/api.js"]`
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const getToken = useCallback(async (): Promise<string> => {
    if (!CONFIG.RECAPTCHA_SITE_KEY || !ready.current || !window.grecaptcha) {
      return '';
    }

    try {
      return await window.grecaptcha.execute(CONFIG.RECAPTCHA_SITE_KEY, {
        action: 'submit_contact',
      });
    } catch (error) {
      console.error('Failed to get reCAPTCHA token:', error);
      return '';
    }
  }, []);

  return { getToken };
}
