import { getSeason, isNightTime, type Season } from '../utils/logoUtils';

interface SeasonalLogoProps {
  className?: string;
  season?: Season;
  night?: boolean;
}

const SeasonalLogo = ({ className = '', season, night }: SeasonalLogoProps) => {
  const currentSeason = season || getSeason();
  const isNight = night !== undefined ? night : isNightTime();
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
