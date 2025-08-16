import React from 'react';
import { portfolioData } from '../data';
import './About.css'; // Kita akan buat file ini

function About() {
  const { name, bio } = portfolioData;

  return (
    <section className="about-section" id="about">
      <div className="about-content pixel-frame">
        <h2 className="section-title">
          <span className="title-icon">⚔️</span> Character Stats
        </h2>
        <div className="stats-box">
          <img src="/avatar-pixel.png" alt="Azzikra's Pixel Avatar" className="pixel-avatar" />
          <div className="stats-info">
            <p><span className="stat-label">Name:</span> {name}</p>
            <p><span className="stat-label">Class:</span> Web Developer</p>
            <p><span className="stat-label">Bio:</span> {bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;