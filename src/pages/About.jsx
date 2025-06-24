import React from "react";
import { Helmet } from "react-helmet-async";

export default function About() {
  return (
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
        Coatesville Farm is a family-run farm located in the heart of Beaverdam, Virginia.
        With a passion for sustainable agriculture and a commitment to community values,
        we grow crops with care and purpose across generations.
      </p>
    </div>
  );
}