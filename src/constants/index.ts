/**
 * Animation timing constants in milliseconds
 */
export const ANIMATION_TIMING = {
  CHIRP_BUBBLE: 1000,
  BIRD_FLAP: 120,
  BIRD_FLY: 16,
  SUBMIT_DELAY: 1000,
} as const;

/**
 * Form configuration constants
 */
export const FORM_CONFIG = {
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 100,
  MAX_MESSAGE_LENGTH: 1000,
} as const;

/**
 * Bird animation frame paths
 */
export const BIRD_FRAMES = [
  '/assets/img/northern-cardinal-01.png',
  '/assets/img/northern-cardinal-02.png',
  '/assets/img/northern-cardinal-03.png',
  '/assets/img/northern-cardinal-04.png',
] as const;
