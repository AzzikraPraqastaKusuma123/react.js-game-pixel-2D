import React from 'react';
import { portfolioData } from '../data';
import './Projects.css'; // Kita akan buat file ini

function Projects() {
  const { projects } = portfolioData;

  return (
    <section className="projects-section" id="projects">
      <h2 className="section-title">
        <span className="title-icon">📜</span> Quest Log
      </h2>
      <div className="projects-list">
        {projects.map((project, index) => (
          <div key={index} className="project-card pixel-frame">
            <h3 className="project-title">{project.name}</h3>
            <p className="project-description">{project.description}</p>
            <div className="tech-stack">
              {project.techStack.map((tech, techIndex) => (
                <span key={techIndex} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
            <div className="project-actions">
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="pixel-button">
                GitHub
              </a>
              <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="pixel-button">
                Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;