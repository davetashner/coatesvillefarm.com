import React from 'react';

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

const isNightTime = () => {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 18;
};

const SeasonalLogo = ({ className = '', season, night }) => {
  const currentSeason = season || getCurrentSeason();
  const isNight = night !== undefined ? night : isNightTime();  // <--- change here
  const imageName = `logo-${currentSeason}${isNight ? '-night' : ''}.png`;
  const imagePath = `/assets/img/${imageName}`;

  return (
    <img
      src={imagePath}
      alt={`Coatesville Farm logo for ${currentSeason}${isNight ? ' night' : ''}`}
      className={`logo ${className}`}
    />
  );
};

export default SeasonalLogo;