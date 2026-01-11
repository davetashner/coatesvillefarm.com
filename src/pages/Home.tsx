import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import '../styles/home.css';
import SeasonalLogo from '../components/SeasonalLogo';
import { playAudio } from '../utils/audioUtils';
import { ANIMATION_TIMING, BIRD_FRAMES } from '../constants';

export default function Home() {
  const [chirped, setChirped] = useState(false);
  const gooseAudioRef = useRef<HTMLAudioElement>(null);
  const goslingAudioRef = useRef<HTMLAudioElement>(null);

  const handleGooseClick = () => {
    playAudio(gooseAudioRef);
  };

  const handleGoslingClick = () => {
    playAudio(goslingAudioRef);
  };

  const handleGooseKeyDown = (e: KeyboardEvent, isGosling = false) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isGosling ? handleGoslingClick() : handleGooseClick();
    }
  };

  const handleBirdClick = () => {
    setChirped(true);
    setTimeout(() => setChirped(false), ANIMATION_TIMING.CHIRP_BUBBLE);
  };

  return (
    <div className="home">
      <section className="hero">
        <img
          src="/assets/img/hero.png"
          alt="Coatesville Farm landscape"
          className="hero-image"
        />

        <div className="hero-overlay">
          <SeasonalLogo />
        </div>

        <AnimatedBird onClick={handleBirdClick} chirped={chirped} />
        <img src="/assets/img/cloud-1.png" alt="" className="cloud cloud-1" aria-hidden="true" />
        <img src="/assets/img/cloud-2.png" alt="" className="cloud cloud-2" aria-hidden="true" />
        <img src="/assets/img/cloud-3.png" alt="" className="cloud cloud-3" aria-hidden="true" />

        <img
          src="/assets/img/canada-goose-1.png"
          alt="Goose - click to hear honk"
          className="goose"
          role="button"
          tabIndex={0}
          onClick={handleGooseClick}
          onKeyDown={(e) => handleGooseKeyDown(e)}
          onTouchStart={handleGooseClick}
        />
        <img
          src="/assets/img/canada-goose-2.png"
          alt="Goose - click to hear honk"
          className="goose goose-2"
          role="button"
          tabIndex={0}
          onClick={handleGooseClick}
          onKeyDown={(e) => handleGooseKeyDown(e)}
          onTouchStart={handleGooseClick}
        />
        <img
          src="/assets/img/canada-goose-3.png"
          alt="Gosling - click to hear chirp"
          className="goose goose-3"
          role="button"
          tabIndex={0}
          onClick={handleGoslingClick}
          onKeyDown={(e) => handleGooseKeyDown(e, true)}
          onTouchStart={handleGoslingClick}
        />

        <audio ref={gooseAudioRef} src="/assets/audio/canada-goose-1.m4a" preload="auto" />
        <audio ref={goslingAudioRef} src="/assets/audio/canada-gosling-1.m4a" preload="auto" />
      </section>
    </div>
  );
}

/**
 * Props for the AnimatedBird component.
 */
interface AnimatedBirdProps {
  /** Callback fired when the bird is clicked or activated via keyboard */
  onClick: () => void;
  /** Whether the bird has recently chirped (shows speech bubble) */
  chirped: boolean;
}

function AnimatedBird({ onClick, chirped }: AnimatedBirdProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [positionX, setPositionX] = useState(100);
  const chirpAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const flapInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % BIRD_FRAMES.length);
    }, ANIMATION_TIMING.BIRD_FLAP);

    const flyInterval = setInterval(() => {
      setPositionX((prev) => (prev < window.innerWidth + 100 ? prev + 2 : -100));
    }, ANIMATION_TIMING.BIRD_FLY);

    return () => {
      clearInterval(flapInterval);
      clearInterval(flyInterval);
    };
  }, []);

  const handleInteraction = () => {
    playAudio(chirpAudio);
    onClick();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInteraction();
    }
  };

  return (
    <>
      <audio ref={chirpAudio} src="/assets/audio/northern-cardinal-chirp.m4a" preload="auto" />
      <img
        src={BIRD_FRAMES[frameIndex]}
        alt="Flying cardinal - click to hear chirp"
        className="animated-bird"
        style={{ left: `${positionX}px` }}
        role="button"
        tabIndex={0}
        onClick={handleInteraction}
        onKeyDown={handleKeyDown}
        onTouchStart={handleInteraction}
      />
      {chirped && (
        <div
          className="chirp-bubble"
          style={{ left: `${positionX + 40}px` }}
          aria-live="polite"
        >
          chirp
        </div>
      )}
    </>
  );
}
