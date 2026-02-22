import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <Helmet>
        <title>Page Not Found | Coatesville Farm</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </Helmet>
      <h2 className="page-title">Page Not Found</h2>
      <p>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <p>
        <Link to="/">Return to Home</Link>
      </p>
    </div>
  );
}
