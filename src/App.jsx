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
import Header from "./components/Header";
import Footer from "./components/Footer";

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
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  </HelmetProvider>
);

export default App;