import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import '../styles/contact.css';
import { FORM_CONFIG } from '../constants';
import { CONFIG } from '@/config';
import { useRecaptcha } from '../hooks/useRecaptcha';

interface FormData {
  name: string;
  email: string;
  message: string;
  honey: string;
}

interface FormErrors {
  email: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Contact() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '', honey: '' });
  const [errors, setErrors] = useState<FormErrors>({ email: '' });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const { getToken } = useRecaptcha();

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

    if (form.honey) return;

    setSubmitStatus('loading');
    setSubmitMessage('');

    try {
      const recaptchaToken = await getToken();

      const response = await fetch(CONFIG.CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setSubmitMessage(`Message sent! We'll get back to you at ${form.email} soon.`);
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
      <Helmet>
        <title>Contact Us | Coatesville Farm</title>
        <meta
          name="description"
          content="Get in touch with Coatesville Farm in Beaverdam, Virginia. Send us a message or find our location and contact details."
        />
        <link rel="canonical" href="https://coatesvillefarm.com/contact" />
      </Helmet>
      <h2 className="page-title">Contact Us</h2>

      <div className="contact-info-bar">
        <p>
          Prefer to call? Reach us at{' '}
          <a href="tel:8044496016" className="contact-phone-link">(804) 449-6016</a>
        </p>
        <p className="contact-response-time">We typically reply within 1&ndash;2 business days.</p>
      </div>

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

        <button
          type="submit"
          className="submit-button"
          disabled={submitStatus === 'loading'}
        >
          {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <section className="contact-map-section">
        <h3 className="contact-map-heading">Find Us</h3>
        <div className="contact-map-container">
          <iframe
            title="Coatesville Farm location on Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6342.7!2d-77.6523!3d37.8477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b116a5c43b6c6f%3A0x0!2zMTQwNzIgT2xkIFJpZGdlIFJkLCBCZWF2ZXJkYW0sIFZBIDIzMDE1!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: 'var(--radius-md)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="contact-map-address">
          14072 Old Ridge Road, Beaverdam, VA
        </p>
      </section>
    </div>
  );
}

export default Contact;
