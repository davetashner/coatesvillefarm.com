import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import About from './pages/About';
import Contact from './pages/Contact';
import Crops from './pages/Crops';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => (
  <HelmetProvider>
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/crops" element={<Crops />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  </HelmetProvider>
);

export default App;
