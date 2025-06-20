import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

const NavBar = () => (
  <nav className="navbar">
    <Link to="/" className="nav-link">Home</Link>
    <Link to="/about" className="nav-link">About</Link>
    <Link to="/crops" className="nav-link">Crops</Link>
    <Link to="/contact" className="nav-link">Contact</Link>
  </nav>
);

const getLogoForSeason = () => {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan, 11 = Dec

  // Show fall logo from September (8) through November (10)
  if (month >= 8 && month <= 10) {
    return "/assets/img/logo-fall.png";
  }
  return "/assets/img/logo.png";
};

const Home = () => (
  <div className="home">
    <img src={getLogoForSeason()} alt="Coatesville Farm Logo" className="logo" />
    <h1>Welcome to Coatesville Farm</h1>
    <p><em>Rooted in tradition. Growing with care.</em></p>
  </div>
);

const About = () => (
  <div className="page">
    <h2 className="page-title">About Us</h2>
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
      <li>Seasonal Vegetables</li>
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
        &copy; 2025 Coatesville Farm. All rights reserved.
      </footer>
    </div>
  </Router>
);

export default App;