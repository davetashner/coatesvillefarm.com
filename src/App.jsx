import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SeasonalLogo from "./components/SeasonalLogo.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Crops from "./pages/Crops.jsx";
import Home from "./pages/Home.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";

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