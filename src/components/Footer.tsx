import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-contact">
        <p>
          <span aria-hidden="true">📍</span>{' '}
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
          <span aria-hidden="true">📞</span>{' '}
          <a href="tel:+18044496016" className="footer-link">
            (804) 449-6016
          </a>
        </p>
        <p>
          <span aria-hidden="true">✉️</span>{' '}
          <a href="mailto:coatesvillefarm@gmail.com" className="footer-link">
            coatesvillefarm@gmail.com
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
