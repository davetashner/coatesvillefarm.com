import React, { useState, useEffect } from "react";

const Contact = () => {
  const [showButton, setShowButton] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", honey: "" });
  const [errors, setErrors] = useState({ email: "" });

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1000); // delay submit button
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) ? "" : "Invalid email address" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      setErrors({ ...errors, email: "Invalid email address" });
      return;
    }
    if (form.honey) return; // spam bot

    console.log("Submit message", form);
    alert("Message sent!");
    setForm({ name: "", email: "", message: "", honey: "" });
  };

  return (
    <div className="page">
      <h2 className="page-title">Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        {/* Spam bot field (hidden) */}
        <div style={{ display: "none" }}>
          <label htmlFor="honey">Leave this field empty</label>
          <input type="text" name="honey" id="honey" value={form.honey} onChange={handleChange} />
        </div>

        <label>
            Your Name (First Last)*:
            <input
                type="text"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
            />
            <small className="helper-text">Please enter your full name.</small>
            </label>

            <label>
            Your Email*:
            <input
                type="email"
                name="email"
                value={form.email}
                required
                onChange={handleChange}
            />
            {errors.email ? (
                <small className="error">{errors.email}</small>
            ) : (
                <small className="helper-text">We'll use this to reply to your message.</small>
            )}
            </label>

            <label>
            Message*:
            <textarea
                name="message"
                rows="5"
                value={form.message}
                required
                onChange={handleChange}
            />
            <small className="helper-text">Let us know how we can help.</small>
            </label>

        {showButton && (
          <button type="submit" className="submit-button">
            Send Message
          </button>
        )}
      </form>
    </div>
  );
};

export default Contact;