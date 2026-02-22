import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/about.css';
import Picture from '../components/Picture';

export default function About() {
  return (
    <div className="page about-page">
      <Helmet>
        <title>About Us | Coatesville Farm</title>
        <meta
          name="description"
          content="Learn more about Coatesville Farm, a multigenerational family-run farm in Beaverdam, Virginia focused on sustainability and community values."
        />
        <link rel="canonical" href="https://coatesvillefarm.com/about" />
      </Helmet>

      <h2 className="page-title">About Us</h2>

      <Picture
        src="/assets/img/silo-rainbow.png"
        alt="Coatesville Farm barn and silo under a rainbow"
        className="about-hero-image"
        loading="lazy"
      />

      <section className="about-section">
        <h3 className="about-heading">Our Story</h3>
        <p>
          Coatesville Farm is a family-run farm nestled in the heart of Beaverdam, Virginia.
          For generations, our family has worked this land with a simple belief: good farming
          starts with taking care of the soil. What began as a small family operation has
          grown into a thriving farm that supplies fresh produce to our local community.
        </p>
      </section>

      <section className="about-section">
        <h3 className="about-heading">How We Farm</h3>
        <p>
          Sustainable agriculture isn&rsquo;t just a label for us &mdash; it&rsquo;s how we&rsquo;ve
          always done things. We practice crop rotation between soybeans, corn, wheat, hay,
          and barley to keep our soil healthy and productive year after year. Our soybeans fix
          nitrogen naturally, reducing the need for synthetic fertilizers, while cover crops
          like winter wheat protect the land during the off-season.
        </p>
      </section>

      <section className="about-section">
        <h3 className="about-heading">Rooted in Community</h3>
        <p>
          We believe a farm is only as strong as the community around it. Whether it&rsquo;s
          supplying grain to local livestock operations, providing hay for neighboring farms,
          or simply being good stewards of the land we share, our connection to Beaverdam and
          Hanover County is at the heart of everything we do.
        </p>
      </section>

      <div className="about-cta">
        <p>
          Have questions about our farm or what we grow?
          We&rsquo;d love to hear from you.
        </p>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </div>
    </div>
  );
}
