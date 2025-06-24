import React from 'react';
import '../styles/home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <img src="/assets/img/hero-summer.png" alt="Coatesville Farm landscape" className="hero-image" />
        <div className="hero-overlay">
          <h1 className="home-title">Welcome to Coatesville Farm</h1>
          <p className="home-subtitle">Rooted in tradition. Growing with care.</p>
        </div>
        <img src="/assets/img/cloud-1.png" className="cloud cloud-1" />
        <img src="/assets/img/cloud-2.png" className="cloud cloud-2" />
        <img src="/assets/img/cloud-3.png" className="cloud cloud-3" />
        <img src="/assets/img/swan.png" className="swan" />
        <img src="/assets/img/swan.png" className="swan swan-2" />
      </section>
    </div>
  );
}