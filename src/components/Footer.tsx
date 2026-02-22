import { Link } from 'react-router-dom';
import '../styles/footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-contact">
          <p>
            <span aria-hidden="true">📍</span>
            <span className="sr-only">Location:</span>{' '}
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
            <span aria-hidden="true">📞</span>
            <span className="sr-only">Phone:</span>{' '}
            <a href="tel:+18044496016" className="footer-link">
              (804) 449-6016
            </a>
          </p>
          <p>
            <span aria-hidden="true">✉️</span>
            <span className="sr-only">Email:</span>{' '}
            <a href="mailto:coatesvillefarm@gmail.com" className="footer-link">
              coatesvillefarm@gmail.com
            </a>
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/" className="footer-nav-link">Home</Link>
          <span className="footer-nav-sep" aria-hidden="true">|</span>
          <Link to="/about" className="footer-nav-link">About</Link>
          <span className="footer-nav-sep" aria-hidden="true">|</span>
          <Link to="/crops" className="footer-nav-link">Crops</Link>
          <span className="footer-nav-sep" aria-hidden="true">|</span>
          <Link to="/contact" className="footer-nav-link">Contact</Link>
        </nav>

        <div className="footer-social" aria-label="Social media links">
          <a
            href="https://facebook.com/coatesvillefarm"
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            aria-label="Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/coatesvillefarm"
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            aria-label="Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-copy">
        &copy; {currentYear} Coatesville Farm. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
