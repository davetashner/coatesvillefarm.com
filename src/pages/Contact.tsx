import { useState, useEffect, useRef, useCallback, ChangeEvent, FormEvent } from 'react';
import '../styles/contact.css';
import { ANIMATION_TIMING, FORM_CONFIG } from '../constants';
import { CONFIG } from '@/config';

/**
 * Contact form field values.
 */
interface FormData {
  /** User's name */
  name: string;
  /** User's email address */
  email: string;
  /** Message content */
  message: string;
  /** Honeypot field for spam prevention (should remain empty) */
  honey: string;
}

/**
 * Validation error messages for form fields.
 */
interface FormErrors {
  /** Email validation error message */
  email: string;
}

/** Form submission state */
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const Contact = () => {
  const [showButton, setShowButton] = useState(false);
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '', honey: '' });
  const [errors, setErrors] = useState<FormErrors>({ email: '' });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const recaptchaReady = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), ANIMATION_TIMING.SUBMIT_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Load reCAPTCHA v3 script if site key is configured
  useEffect(() => {
    if (!CONFIG.RECAPTCHA_SITE_KEY) {
      // No site key configured, reCAPTCHA is optional
      recaptchaReady.current = true;
      return;
    }

    // Check if script is already loaded
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        recaptchaReady.current = true;
      });
      return;
    }

    // Load the reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${CONFIG.RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        recaptchaReady.current = true;
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount (optional, prevents duplicate loads)
      const existingScript = document.querySelector(
        `script[src^="https://www.google.com/recaptcha/api.js"]`
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  /**
   * Get reCAPTCHA token for form submission
   * Returns empty string if reCAPTCHA is not configured or not ready
   */
  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    if (!CONFIG.RECAPTCHA_SITE_KEY || !recaptchaReady.current || !window.grecaptcha) {
      return '';
    }

    try {
      const token = await window.grecaptcha.execute(CONFIG.RECAPTCHA_SITE_KEY, {
        action: 'submit_contact',
      });
      return token;
    } catch (error) {
      console.error('Failed to get reCAPTCHA token:', error);
      return '';
    }
  }, []);

  // Auto-hide success/error message after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'email') {
      setErrors({ ...errors, email: validateEmail(value) ? '' : 'Invalid email address' });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      setErrors({ ...errors, email: 'Invalid email address' });
      return;
    }

    if (form.honey) return; // spam bot detected

    setSubmitStatus('loading');
    setSubmitMessage('');

    try {
      // Get reCAPTCHA token (empty string if not configured)
      const recaptchaToken = await getRecaptchaToken();

      const response = await fetch(CONFIG.CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          honey: form.honey,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setSubmitMessage('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', message: '', honey: '' });
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again later.'
      );
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Contact Us</h2>

      {/* Toast notification */}
      {submitStatus !== 'idle' && submitStatus !== 'loading' && (
        <div
          className={`toast toast-${submitStatus}`}
          role="alert"
          aria-live="polite"
        >
          {submitMessage}
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        {/* Honeypot field for spam bots */}
        <div className="visually-hidden">
          <label htmlFor="honey">Leave this field empty</label>
          <input
            type="text"
            name="honey"
            id="honey"
            value={form.honey}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="form-field">
          <label htmlFor="name">Your Name (First Last)*:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            maxLength={FORM_CONFIG.MAX_NAME_LENGTH}
            required
            disabled={submitStatus === 'loading'}
            onChange={handleChange}
            aria-describedby="name-hint"
          />
          <div className="helper-text-group">
            <small id="name-hint" className="helper-text">Please enter your full name.</small>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="email">Your Email*:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            maxLength={FORM_CONFIG.MAX_EMAIL_LENGTH}
            required
            disabled={submitStatus === 'loading'}
            onChange={handleChange}
            aria-describedby={errors.email ? 'email-error' : 'email-hint'}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          <div className="helper-text-group">
            {errors.email ? (
              <small id="email-error" className="error" role="alert">{errors.email}</small>
            ) : (
              <small id="email-hint" className="helper-text">We'll use this to reply to your message.</small>
            )}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="message">Message*:</label>
          <textarea
            name="message"
            id="message"
            rows={5}
            maxLength={FORM_CONFIG.MAX_MESSAGE_LENGTH}
            value={form.message}
            required
            disabled={submitStatus === 'loading'}
            onChange={handleChange}
            aria-describedby="message-hint message-count"
          />
          <div className="helper-text-group">
            <small id="message-hint" className="helper-text">Let us know how we can help.</small>
            <small id="message-count" className="helper-text">
              {form.message.length}/{FORM_CONFIG.MAX_MESSAGE_LENGTH} characters
            </small>
          </div>
        </div>

        {showButton && (
          <button
            type="submit"
            className="submit-button"
            disabled={submitStatus === 'loading'}
          >
            {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        )}
      </form>
    </div>
  );
};

export default Contact;
