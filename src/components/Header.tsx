import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SeasonalLogo from './SeasonalLogo';
import '../styles/layout.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
      if (window.innerWidth > 600) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navLinksClass = isMobile
    ? `navbar-links ${menuOpen ? 'mobile-visible' : 'mobile-hidden'}`
    : 'navbar-links';

  const isActive = (path: string) => location.pathname === path;

  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="navbar-logo-link" onClick={() => setMenuOpen(false)}>
          <SeasonalLogo className="navbar-logo" />
        </Link>

        {isMobile && (
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        )}

        <div className={navLinksClass}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            aria-current={isActive('/') ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            aria-current={isActive('/about') ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/crops"
            className={`nav-link ${isActive('/crops') ? 'active' : ''}`}
            aria-current={isActive('/crops') ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Crops
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            aria-current={isActive('/contact') ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
