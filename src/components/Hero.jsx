import React from 'react';
import { portfolioData } from '../data';
import './Hero.css'; // Kita akan buat file ini

function Hero() {
  const { name, title } = portfolioData;

  return (
    <section className="hero-section" id="hero">
      <div className="hero-content pixel-frame">
        <h1 className="hero-title">{name}</h1>
        <p className="hero-subtitle">{title}</p>
        <div className="hero-actions">
          <button className="pixel-button">
            <a href="#projects">Lihat Proyek</a>
          </button>
          <button className="pixel-button">
            <a href="#contact">Hubungi Saya</a>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;