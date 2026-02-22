import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import About from './pages/About';
import Contact from './pages/Contact';
import Crops from './pages/Crops';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition';

function AppRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app-container">
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="main-content">
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
