import React from "react";
import "../styles/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-contact">
        <p>
          📍{" "}
          <a
            href="https://maps.app.goo.gl/7daPheXtBUPiJES87"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            14072 Old Ridge Road, Beaverdam, VA
          </a>
        </p>
        <p>
          📞{" "}
          <a href="tel:+18045551234" className="footer-link">
            (804) 555-1234
          </a>
        </p>
        <p>
          ✉️{" "}
          <a href="mailto:info@coatesvillefarm.com" className="footer-link">
            info@coatesvillefarm.com
          </a>
        </p>
      </div>
      <div className="footer-copy">
        &copy; {currentYear} Coatesville Farm. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;