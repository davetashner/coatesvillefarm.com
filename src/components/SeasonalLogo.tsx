import { getSeason, isNightTime, type Season } from '../utils/logoUtils';

/**
 * Props for the SeasonalLogo component.
 */
interface SeasonalLogoProps {
  /** Additional CSS class names to apply to the logo image */
  className?: string;
  /** Override the auto-detected season (spring, summer, autumn, winter) */
  season?: Season;
  /** Override the auto-detected night mode (true = night logo variant) */
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
