import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SeasonalLogo from "./SeasonalLogo.jsx";
import Contact from "./Contact.jsx";
import Home from "./Home.jsx";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
      if (window.innerWidth > 600) {
        setMenuOpen(false); // always close mobile menu on desktop resize
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinksClass = isMobile
    ? `navbar-links ${menuOpen ? "mobile-visible" : "mobile-hidden"}`
    : "navbar-links";

  return (
    <nav className="navbar">
      <Link to="/">
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
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/crops" className={`nav-link ${location.pathname === '/crops' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Crops</Link>
        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</Link>
      </div>
    </nav>
  );
};

const About = () => (
  <div className="page">
    <Helmet>
      <title>About Us | Coatesville Farm</title>
      <meta
        name="description"
        content="Learn more about Coatesville Farm, a multigenerational family-run farm in Beaverdam, Virginia focused on sustainability and community values."
      />
    </Helmet>
    <h2 className="page-title">About Us</h2>
    <img
      src="/assets/img/silo-rainbow.png"
      alt="Coatesville Farm barn with rainbow"
      className="about-image"
    />
    <p>
      Coatesville Farm is a family-run farm located in the heart of Beaverdam, Virginia. With a passion for sustainable agriculture and a commitment to community values, we grow crops with care and purpose across generations.
    </p>
  </div>
);

const Crops = () => (
  <div className="page">
    <Helmet>
      <title>Our Crops | Coatesville Farm</title>
      <meta
        name="description"
        content="Explore the diverse crops grown at Coatesville Farm in Virginia, including soybeans, wheat, corn, straw, and hay."
      />
    </Helmet>
    <h2 className="page-title">Our Crops</h2>
    <ul className="crop-list">
      <li>Soybeans</li>
      <li>Wheat</li>
      <li>Corn</li>
      <li>Straw</li>
      <li>Hay</li>
    </ul>
  </div>
);

const App = () => (
  <HelmetProvider>
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-contact">
            <p>
              📍 <a
                href="https://maps.app.goo.gl/7daPheXtBUPiJES87"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                14072 Old Ridge Road, Beaverdam, VA
              </a>
            </p>
            <p>📞 <a href="tel:+18045551234" className="footer-link">(804) 555-1234</a></p>
            <p>✉️ <a href="mailto:info@coatesvillefarm.com" className="footer-link">info@coatesvillefarm.com</a></p>
          </div>
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} Coatesville Farm. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  </HelmetProvider>
);

export default App;