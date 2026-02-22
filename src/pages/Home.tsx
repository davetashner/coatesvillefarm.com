import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import '../styles/home.css';
import SeasonalLogo from '../components/SeasonalLogo';
import { playAudio } from '../utils/audioUtils';
import { ANIMATION_TIMING, BIRD_FRAMES } from '../constants';
import Picture from '../components/Picture';

interface GooseItem {
  src: string;
  className: string;
  alt: string;
  isGosling: boolean;
}

const GOOSE_ITEMS: GooseItem[] = [
  { src: '/assets/img/canada-goose-1.png', className: 'goose', alt: 'Goose - click to hear honk', isGosling: false },
  { src: '/assets/img/canada-goose-2.png', className: 'goose goose-2', alt: 'Goose - click to hear honk', isGosling: false },
  { src: '/assets/img/canada-goose-3.png', className: 'goose goose-3', alt: 'Gosling - click to hear chirp', isGosling: true },
];

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
      <Helmet>
        <title>Coatesville Farm | Fresh Produce in Beaverdam, VA</title>
        <meta
          name="description"
          content="Coatesville Farm is a family-run farm in Beaverdam, Virginia growing fresh produce with sustainable practices across generations."
        />
      </Helmet>
      <section className="hero">
        <Picture
          src="/assets/img/hero.png"
          alt="Coatesville Farm landscape"
          className="hero-image"
        />

        <div className="hero-overlay">
          <SeasonalLogo />
        </div>

        <AnimatedBird onClick={handleBirdClick} chirped={chirped} />
        <Picture src="/assets/img/cloud-1.png" alt="" className="cloud cloud-1" aria-hidden="true" />
        <Picture src="/assets/img/cloud-2.png" alt="" className="cloud cloud-2" aria-hidden="true" />
        <Picture src="/assets/img/cloud-3.png" alt="" className="cloud cloud-3" aria-hidden="true" />

        {GOOSE_ITEMS.map(({ src, className, alt, isGosling }) => (
          <Picture
            key={src}
            src={src}
            alt={alt}
            className={className}
            role="button"
            tabIndex={0}
            onClick={isGosling ? handleGoslingClick : handleGooseClick}
            onKeyDown={(e) => handleGooseKeyDown(e, isGosling)}
          />
        ))}

        <audio ref={gooseAudioRef} src="/assets/audio/canada-goose-1.m4a" preload="none" />
        <audio ref={goslingAudioRef} src="/assets/audio/canada-gosling-1.m4a" preload="none" />
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
    let rafId: number;
    let lastFlapTime = 0;
    let lastFlyTime = 0;

    const animate = (timestamp: number) => {
      if (!lastFlapTime) {
        lastFlapTime = timestamp;
        lastFlyTime = timestamp;
      }

      if (timestamp - lastFlapTime >= ANIMATION_TIMING.BIRD_FLAP) {
        setFrameIndex((prev) => (prev + 1) % BIRD_FRAMES.length);
        lastFlapTime = timestamp;
      }

      if (timestamp - lastFlyTime >= ANIMATION_TIMING.BIRD_FLY) {
        setPositionX((prev) => (prev < window.innerWidth + 100 ? prev + 2 : -100));
        lastFlyTime = timestamp;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
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
      <audio ref={chirpAudio} src="/assets/audio/northern-cardinal-chirp.m4a" preload="none" />
      <Picture
        src={BIRD_FRAMES[frameIndex]}
        alt="Flying cardinal - click to hear chirp"
        className="animated-bird"
        style={{ left: `${positionX}px` }}
        role="button"
        tabIndex={0}
        onClick={handleInteraction}
        onKeyDown={handleKeyDown}
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
