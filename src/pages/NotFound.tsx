import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Picture from '../components/Picture';

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <Helmet>
        <title>Page Not Found | Coatesville Farm</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </Helmet>
      <Picture
        src="/assets/img/logo.png"
        alt="Coatesville Farm logo"
        style={{ width: '120px', marginBottom: '1rem', display: 'inline-block' }}
      />
      <h2 className="page-title">Page Not Found</h2>
      <p>
        Sorry, we couldn&rsquo;t find that page. It may have been moved or no longer exists.
      </p>
      <p>Here are some places you can go instead:</p>
      <nav aria-label="Suggested pages">
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/crops">Our Crops</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </nav>
    </div>
  );
}
