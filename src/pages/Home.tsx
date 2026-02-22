import { useState, useEffect, useRef, useMemo, KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import SeasonalLogo from '../components/SeasonalLogo';
import Picture from '../components/Picture';
import { playAudio } from '../utils/audioUtils';
import { ANIMATION_TIMING, BIRD_FRAMES } from '../constants';

interface CropInfo {
  name: string;
  icon: string;
  startMonth: number;
  endMonth: number;
}

const CROP_SEASONS: CropInfo[] = [
  { name: 'Soybeans', icon: '🌱', startMonth: 4, endMonth: 9 },
  { name: 'Corn', icon: '🌽', startMonth: 3, endMonth: 8 },
  { name: 'Wheat', icon: '🌾', startMonth: 9, endMonth: 6 },
  { name: 'Hay', icon: '🌿', startMonth: 3, endMonth: 9 },
  { name: 'Barley', icon: '🫘', startMonth: 8, endMonth: 5 },
];

function getInSeasonCrops(date: Date = new Date()): CropInfo[] {
  const month = date.getMonth(); // 0-indexed
  return CROP_SEASONS.filter(({ startMonth, endMonth }) =>
    startMonth <= endMonth
      ? month >= startMonth && month <= endMonth
      : month >= startMonth || month <= endMonth
  );
}

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
        <link rel="canonical" href="https://coatesvillefarm.com/" />
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

      <HomeContent />
    </div>
  );
}

function HomeContent() {
  const inSeason = useMemo(() => getInSeasonCrops(), []);

  return (
    <div className="home-content">
      {inSeason.length > 0 && (
        <section className="home-section">
          <h2 className="home-section-title">What&rsquo;s Growing Now</h2>
          <div className="season-chips">
            {inSeason.map((crop) => (
              <span key={crop.name} className="season-chip">
                <span aria-hidden="true">{crop.icon}</span> {crop.name}
              </span>
            ))}
          </div>
          <Link to="/crops" className="home-link">See all our crops &rarr;</Link>
        </section>
      )}

      <section className="home-section home-about-preview">
        <div className="home-about-content">
          <div className="home-about-text">
            <h2 className="home-section-title">Our Farm</h2>
            <p>
              Coatesville Farm is a family-run farm in the heart of Beaverdam, Virginia.
              With a passion for sustainable agriculture and a commitment to community
              values, we grow crops with care and purpose across generations.
            </p>
            <Link to="/about" className="home-link">Learn more about us &rarr;</Link>
          </div>
          <div className="home-about-image">
            <Picture
              src="/assets/img/silo-rainbow.png"
              alt="Coatesville Farm silo with rainbow"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="home-section home-cta">
        <h2 className="home-section-title">Get in Touch</h2>
        <p>Have questions about our crops or want to learn more? We&rsquo;d love to hear from you.</p>
        <Link to="/contact" className="cta-button">Contact Us</Link>
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
