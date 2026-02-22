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

      </div>

      <div className="footer-copy">
        &copy; {currentYear} Coatesville Farm. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
