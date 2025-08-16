import React from 'react';
import { portfolioData } from '../data';
import './Skills.css'; // Kita akan buat file ini nanti

function Skills() {
  const { skills } = portfolioData;

  return (
    <section className="skills-section" id="skills">
      <h2 className="section-title">
        <span className="title-icon">🧪</span> Skills
      </h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item pixel-frame">
            <img src={skill.icon} alt={skill.name} className="skill-icon" />
            <p>{skill.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;