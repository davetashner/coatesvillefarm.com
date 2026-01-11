import { Helmet } from 'react-helmet-async';

export default function Crops() {
  return (
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
}
