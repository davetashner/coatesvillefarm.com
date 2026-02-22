import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SeasonalLogo from './SeasonalLogo';
import '../styles/layout.css';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/crops', label: 'Crops' },
  { path: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
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
      <nav className="navbar" aria-label="Main navigation">
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
            aria-controls="nav-menu"
          >
            ☰
          </button>
        )}

        <div ref={navRef} id="nav-menu" className={navLinksClass}>
          {NAV_ITEMS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? 'active' : ''}`}
              aria-current={isActive(path) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
