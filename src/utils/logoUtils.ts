export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Determines the current season based on the month.
 * @param date - The date to check (defaults to current date)
 * @returns The season name
 */
export const getSeason = (date: Date = new Date()): Season => {
  const month = date.getMonth(); // 0 = Jan
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

/**
 * Checks if the current time is night (before 6 AM or after 6 PM).
 * @param date - The date to check (defaults to current date)
 * @returns True if it's nighttime
 */
export const isNightTime = (date: Date = new Date()): boolean => {
  const hour = date.getHours();
  return hour < 6 || hour >= 18;
};
