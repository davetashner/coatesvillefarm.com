import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SeasonalLogo from './SeasonalLogo';
import '../styles/layout.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
      if (window.innerWidth > 600) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!menuOpen || !isMobile) return;

    const navElement = navRef.current;
    if (!navElement) return;

    const focusableElements = navElement.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first nav link when menu opens
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, isMobile]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

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
            ref={menuButtonRef}
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        )}

        <div ref={navRef} className={navLinksClass}>
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
