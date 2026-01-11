import { getSeason, isNightTime } from '../utils/logoUtils';

describe('getSeason', () => {
  test('returns spring for March (month 2)', () => {
    expect(getSeason(new Date(2025, 2, 15))).toBe('spring');
  });

  test('returns spring for April (month 3)', () => {
    expect(getSeason(new Date(2025, 3, 15))).toBe('spring');
  });

  test('returns spring for May (month 4)', () => {
    expect(getSeason(new Date(2025, 4, 15))).toBe('spring');
  });

  test('returns summer for June (month 5)', () => {
    expect(getSeason(new Date(2025, 5, 15))).toBe('summer');
  });

  test('returns summer for July (month 6)', () => {
    expect(getSeason(new Date(2025, 6, 15))).toBe('summer');
  });

  test('returns summer for August (month 7)', () => {
    expect(getSeason(new Date(2025, 7, 15))).toBe('summer');
  });

  test('returns autumn for September (month 8)', () => {
    expect(getSeason(new Date(2025, 8, 15))).toBe('autumn');
  });

  test('returns autumn for October (month 9)', () => {
    expect(getSeason(new Date(2025, 9, 15))).toBe('autumn');
  });

  test('returns autumn for November (month 10)', () => {
    expect(getSeason(new Date(2025, 10, 15))).toBe('autumn');
  });

  test('returns winter for December (month 11)', () => {
    expect(getSeason(new Date(2025, 11, 15))).toBe('winter');
  });

  test('returns winter for January (month 0)', () => {
    expect(getSeason(new Date(2025, 0, 15))).toBe('winter');
  });

  test('returns winter for February (month 1)', () => {
    expect(getSeason(new Date(2025, 1, 15))).toBe('winter');
  });

  test('uses current date when no argument provided', () => {
    const result = getSeason();
    expect(['spring', 'summer', 'autumn', 'winter']).toContain(result);
  });

  test('handles edge case: last day of February (end of winter)', () => {
    expect(getSeason(new Date(2025, 1, 28))).toBe('winter');
  });

  test('handles edge case: first day of March (start of spring)', () => {
    expect(getSeason(new Date(2025, 2, 1))).toBe('spring');
  });
});

describe('isNightTime', () => {
  test('returns true for midnight (hour 0)', () => {
    expect(isNightTime(new Date(2025, 5, 15, 0, 0))).toBe(true);
  });

  test('returns true for 5 AM', () => {
    expect(isNightTime(new Date(2025, 5, 15, 5, 0))).toBe(true);
  });

  test('returns true for 5:59 AM (boundary)', () => {
    expect(isNightTime(new Date(2025, 5, 15, 5, 59))).toBe(true);
  });

  test('returns false for 6 AM (boundary)', () => {
    expect(isNightTime(new Date(2025, 5, 15, 6, 0))).toBe(false);
  });

  test('returns false for noon (hour 12)', () => {
    expect(isNightTime(new Date(2025, 5, 15, 12, 0))).toBe(false);
  });

  test('returns false for 5 PM (hour 17)', () => {
    expect(isNightTime(new Date(2025, 5, 15, 17, 0))).toBe(false);
  });

  test('returns false for 5:59 PM (boundary)', () => {
    expect(isNightTime(new Date(2025, 5, 15, 17, 59))).toBe(false);
  });

  test('returns true for 6 PM (boundary)', () => {
    expect(isNightTime(new Date(2025, 5, 15, 18, 0))).toBe(true);
  });

  test('returns true for 11 PM (hour 23)', () => {
    expect(isNightTime(new Date(2025, 5, 15, 23, 0))).toBe(true);
  });

  test('uses current date when no argument provided', () => {
    const result = isNightTime();
    expect(typeof result).toBe('boolean');
  });
});

describe('Season and time combinations', () => {
  test.each([
    [new Date(2025, 0, 15, 12), 'winter', false],   // January noon
    [new Date(2025, 3, 15, 3), 'spring', true],     // April 3am (night)
    [new Date(2025, 6, 15, 14), 'summer', false],   // July 2pm
    [new Date(2025, 9, 15, 20), 'autumn', true],    // October 8pm (night)
    [new Date(2025, 11, 25, 22), 'winter', true],   // December 10pm (night)
  ])('correctly identifies season and time for %s', (date, expectedSeason, expectedNight) => {
    expect(getSeason(date)).toBe(expectedSeason);
    expect(isNightTime(date)).toBe(expectedNight);
  });
});
