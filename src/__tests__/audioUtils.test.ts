import { RefObject } from 'react';
import { playAudio } from '../utils/audioUtils';

describe('audioUtils', () => {
  describe('playAudio', () => {
    it('plays audio and resets currentTime to 0', () => {
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      const mockAudioElement = {
        currentTime: 5,
        play: mockPlay,
      } as unknown as HTMLAudioElement;

      const audioRef = {
        current: mockAudioElement,
      } as RefObject<HTMLAudioElement>;

      playAudio(audioRef);

      expect(mockAudioElement.currentTime).toBe(0);
      expect(mockPlay).toHaveBeenCalledTimes(1);
    });

    it('does nothing when ref is null', () => {
      const audioRef = {
        current: null,
      } as RefObject<HTMLAudioElement | null>;

      // Should not throw
      expect(() => playAudio(audioRef)).not.toThrow();
    });

    it('silently handles play() rejection (autoplay restrictions)', async () => {
      const mockPlay = jest.fn().mockRejectedValue(new Error('Autoplay blocked'));
      const mockAudioElement = {
        currentTime: 0,
        play: mockPlay,
      } as unknown as HTMLAudioElement;

      const audioRef = {
        current: mockAudioElement,
      } as RefObject<HTMLAudioElement>;

      // Should not throw even when play() rejects
      expect(() => playAudio(audioRef)).not.toThrow();
      expect(mockPlay).toHaveBeenCalledTimes(1);
    });
  });
});
