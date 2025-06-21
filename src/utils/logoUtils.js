import { parseISO } from 'date-fns';

export const getSeason = (date = new Date()) => {
  const month = date.getMonth(); // 0 = Jan
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};

export const isNightTime = (date = new Date()) => {
  const hour = date.getHours();
  return hour < 6 || hour >= 18;
};

export const getLogoPath = (date = new Date()) => {
  const season = getSeason(date);
  const night = isNightTime(date);
  return `/assets/img/logo-${season}${night ? '-night' : ''}.png`;
};

export const getPreviewDate = () => {
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview');
  if (!preview) return null;
  try {
    return parseISO(preview); // Validates & parses ISO string
  } catch {
    return null;
  }
};