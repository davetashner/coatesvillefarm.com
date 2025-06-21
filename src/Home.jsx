import React from "react";
import { Helmet } from "react-helmet-async";
import { getLogoPath } from "./utils/logoUtils";

const heroImage = "/assets/img/hero.png";

const cloudImages = [
  { src: "/assets/img/clouds-1.png", className: "cloud cloud-1" },
  { src: "/assets/img/clouds-2.png", className: "cloud cloud-2" },
  { src: "/assets/img/clouds-3.png", className: "cloud cloud-3" },
];

const swanImages = [
  { src: "/assets/img/swan-1.png", className: "swan swan-1" },
  { src: "/assets/img/swan-2.png", className: "swan swan-2" },
];

const Home = () => {
  const logoSrc = React.useMemo(() => getLogoPath(), []);

  return (
    <div className="home">
      <Helmet>
        <title>Coatesville Farm | Family-Run Farm in Virginia</title>
        <meta
          name="description"
          content="Welcome to Coatesville Farm — a family-owned farm in Beaverdam, VA growing crops like soybeans, corn, and hay with care across generations."
        />
      </Helmet>

      <section className="hero">
        <img src={heroImage} alt="Coatesville Farm hero" className="hero-image" />
        
        {/* Floating clouds */}
        {cloudImages.map((cloud, index) => (
          <img key={index} src={cloud.src} alt={`cloud ${index + 1}`} className={cloud.className} />
        ))}

        {/* Floating swans */}
        {swanImages.map((swan, index) => (
          <img key={index} src={swan.src} alt={`swan ${index + 1}`} className={swan.className} />
        ))}

        <div className="hero-overlay">
          <img src={logoSrc} alt="Coatesville Farm logo" className="logo" />
        </div>
      </section>
    </div>
  );
};

export default Home;