import { RefObject } from 'react';

/**
 * Plays audio from a ref, resetting to the beginning first.
 * Silently catches any playback errors (e.g., autoplay restrictions).
 * @param audioRef - React ref to an HTMLAudioElement
 */
export const playAudio = (audioRef: RefObject<HTMLAudioElement | null>): void => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Silently handle autoplay restrictions
    });
  }
};
