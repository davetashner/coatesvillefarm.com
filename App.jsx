import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

const NavBar = () => (
  <nav className="p-4 bg-green-800 text-white flex gap-4 justify-center">
    <Link to="/" className="hover:underline">Home</Link>
    <Link to="/about" className="hover:underline">About</Link>
    <Link to="/crops" className="hover:underline">Crops</Link>
    <Link to="/contact" className="hover:underline">Contact</Link>
  </nav>
);

const Home = () => (
  <div className="p-6 text-center">
    <img src="/assets/img/logo.png" alt="Coatesville Farm Logo" className="mx-auto w-64 rounded-xl shadow-lg mb-6" />
    <h1 className="text-4xl font-bold mb-4">Welcome to Coatesville Farm</h1>
    <p className="text-lg text-gray-700">Rooted in tradition. Growing with care.</p>
  </div>
);

const About = () => (
  <div className="p-6 max-w-3xl mx-auto">
    <h2 className="text-3xl font-semibold mb-4">About Us</h2>
    <p className="text-gray-700">
      Coatesville Farm is a family-run farm located in the heart of Beaverdam, Virginia. With a passion for sustainable agriculture and a commitment to community values, we grow crops with care and purpose across generations.
    </p>
  </div>
);

const Crops = () => (
  <div className="p-6 max-w-3xl mx-auto">
    <h2 className="text-3xl font-semibold mb-4">Our Crops</h2>
    <ul className="list-disc list-inside text-gray-700">
      <li>Soybeans</li>
      <li>Wheat</li>
      <li>Corn</li>
      <li>Seasonal Vegetables</li>
    </ul>
  </div>
);

const Contact = () => (
  <div className="p-6 max-w-3xl mx-auto">
    <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
    <p className="text-gray-700">
      Email us at <a href="mailto:info@coatesvillefarm.com" className="text-blue-600 underline">info@coatesvillefarm.com</a>
    </p>
    <p className="text-gray-700">Address: 14072 Old Ridge Road, Beaverdam, VA USA</p>
  </div>
);

const App = () => (
  <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/crops" element={<Crops />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    <footer className="text-center text-gray-500 text-sm py-6">
      &copy; 2025 Coatesville Farm. All rights reserved.
    </footer>
  </Router>
);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
