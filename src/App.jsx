import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { getLogoPath } from "../utils/logoUtils";

const NavBar = () => (
  <nav className="navbar">
    <Link to="/" className="nav-link">Home</Link>
    <Link to="/about" className="nav-link">About</Link>
    <Link to="/crops" className="nav-link">Crops</Link>
    <Link to="/contact" className="nav-link">Contact</Link>
  </nav>
);

const Home = () => {
  const logoSrc = React.useMemo(() => getLogoPath(), []);

  return (
    <div className="home">
      <img src={logoSrc} alt="Coatesville Farm logo" className="logo" />
      <h1>Welcome to Coatesville Farm</h1>
      <p><em>Rooted in tradition. Grown with care.</em></p>
    </div>
  );
};

const About = () => (
  <div className="page">
    <h2 className="page-title">About Us</h2>
    <img
      src="/assets/img/silo-rainbow.png"
      alt="Coatesville Farm with rainbow"
      className="about-image"
    />
    <p>
      Coatesville Farm is a family-run farm located in the heart of Beaverdam, Virginia. With a passion for sustainable agriculture and a commitment to community values, we grow crops with care and purpose across generations.
    </p>
  </div>
);

const Crops = () => (
  <div className="page">
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

const Contact = () => (
  <div className="page">
    <h2 className="page-title">Contact Us</h2>
    <p>
      Email us at <a href="mailto:info@coatesvillefarm.com" className="email-link">info@coatesvillefarm.com</a>
    </p>
    <p>Address: 14072 Old Ridge Road, Beaverdam, VA USA</p>
  </div>
);

const App = () => (
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
          <p>📍 14072 Old Ridge Road, Beaverdam, VA</p>
          <p>📞 <a href="tel:+18045551234" className="footer-link">(804) 555-1234</a></p>
          <p>✉️ <a href="mailto:info@coatesvillefarm.com" className="footer-link">info@coatesvillefarm.com</a></p>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Coatesville Farm. All rights reserved.
        </div>
      </footer>
    </div>
  </Router>
);

export default App;