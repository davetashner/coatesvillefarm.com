import React from "react";
import { getLogoPath } from "./utils/logoUtils";

const SeasonalLogo = ({ className = "" }) => {
  const logoSrc = React.useMemo(() => getLogoPath(), []);
  return (
    <img
      src={logoSrc}
      alt="Coatesville Farm logo"
      className={`logo ${className}`}
    />
  );
};

export default SeasonalLogo;