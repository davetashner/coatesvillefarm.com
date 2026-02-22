import { Helmet } from 'react-helmet-async';
import '../styles/crops.css';

const CROPS = [
  { name: 'Soybeans', icon: '🌱', season: 'May - October', description: 'Nitrogen-fixing legume that enriches the soil while producing a valuable harvest.' },
  { name: 'Corn', icon: '🌽', season: 'April - September', description: 'Sweet and field varieties grown in rotation with soybeans for optimal soil health.' },
  { name: 'Wheat', icon: '🌾', season: 'October - July', description: 'Winter wheat planted in fall, providing ground cover and harvested in early summer.' },
  { name: 'Hay', icon: '🌿', season: 'April - October', description: 'Mixed grass hay harvested multiple times per season for livestock feed.' },
  { name: 'Barley', icon: '🫘', season: 'September - June', description: 'Hardy grain crop that thrives in Virginia\'s climate, used for feed and cover.' },
];

export default function Crops() {
  return (
    <div className="page">
      <Helmet>
        <title>Our Crops | Coatesville Farm</title>
        <meta
          name="description"
          content="Explore the diverse crops grown at Coatesville Farm in Virginia, including soybeans, wheat, corn, hay, and barley."
        />
      </Helmet>
      <h2 className="page-title">Our Crops</h2>
      <div className="crops-grid">
        {CROPS.map((crop) => (
          <div key={crop.name} className="crop-card">
            <span className="crop-icon">{crop.icon}</span>
            <h3 className="crop-name">{crop.name}</h3>
            <span className="crop-season">{crop.season}</span>
            <p className="crop-description">{crop.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
