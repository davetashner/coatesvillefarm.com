import React, { useState, useEffect, useRef } from 'react';
import '../styles/home.css';
import SeasonalLogo from '../components/SeasonalLogo.jsx';

export default function Home() {
  const [chirped, setChirped] = useState(false);
  const gooseAudioRef = useRef(null);
  const goslingAudioRef = useRef(null);

  const handleGooseClick = () => {
    if (gooseAudioRef.current) {
      gooseAudioRef.current.currentTime = 0;
      gooseAudioRef.current.play();
    }
  };

  const handleGoslingClick = () => {
    if (goslingAudioRef.current) {
      goslingAudioRef.current.currentTime = 0;
      goslingAudioRef.current.play();
    }
  };

  const handleBirdClick = () => {
    setChirped(true);
    setTimeout(() => setChirped(false), 1000); // hide "chirp" after 1 sec
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

        {/* Animated visuals */}
        <AnimatedBird onClick={handleBirdClick} chirped={chirped} />
        <img src="/assets/img/cloud-1.png" alt="Cloud 1" className="cloud cloud-1" />
        <img src="/assets/img/cloud-2.png" alt="Cloud 2" className="cloud cloud-2" />
        <img src="/assets/img/cloud-3.png" alt="Cloud 3" className="cloud cloud-3" />

        {/* Goose Images with Sound */}
        <img
          src="/assets/img/canada-goose-1.png"
          alt="Goose"
          className="goose"
          onClick={handleGooseClick}
          onTouchStart={handleGooseClick}
        />
        <img
          src="/assets/img/canada-goose-2.png"
          alt="Goose 2"
          className="goose goose-2"
          onClick={handleGooseClick}
          onTouchStart={handleGooseClick}
        />
        <img
          src="/assets/img/canada-goose-3.png"
          alt="Goose 3"
          className="goose goose-3"
          onClick={handleGoslingClick}
          onTouchStart={handleGoslingClick}
        />

        {/* Audio elements */}
        <audio ref={gooseAudioRef} src="/assets/audio/canada-goose-1.m4a" preload="auto" />
        <audio ref={goslingAudioRef} src="/assets/audio/canada-gosling-1.m4a" preload="auto" />
      </section>
    </div>
  );
}

function AnimatedBird({ onClick, chirped }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [positionX, setPositionX] = useState(100);
  const chirpAudio = useRef(null);

  const birdFrames = [
    "/assets/img/northern-cardinal-01.png",
    "/assets/img/northern-cardinal-02.png",
    "/assets/img/northern-cardinal-03.png",
    "/assets/img/northern-cardinal-04.png"
  ];

  useEffect(() => {
    const flapInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % birdFrames.length);
    }, 120);

    const flyInterval = setInterval(() => {
      setPositionX((prev) => (prev < window.innerWidth + 100 ? prev + 2 : -100));
    }, 16);

    return () => {
      clearInterval(flapInterval);
      clearInterval(flyInterval);
    };
  }, []);

  const handleInteraction = () => {
    if (chirpAudio.current) {
      chirpAudio.current.currentTime = 0;
      chirpAudio.current.play();
    }
    onClick();
  };

  return (
    <>
      <audio ref={chirpAudio} src="/assets/audio/northern-cardinal-chirp.m4a" preload="auto" />
      <img
        src={birdFrames[frameIndex]}
        alt="Flying bird"
        className="animated-bird"
        style={{ left: `${positionX}px` }}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      />
      {chirped && (
        <div
          className="chirp-bubble"
          style={{ left: `${positionX + 40}px` }}
        >
          chirp
        </div>
      )}
    </>
  );
}