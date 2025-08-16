import React from 'react';
import { portfolioData } from '../data';
import './Contact.css'; // Kita akan buat file ini

function Contact() {
  const { contact } = portfolioData;

  return (
    <section className="contact-section" id="contact">
      <h2 className="section-title">
        <span className="title-icon">📧</span> Contact
      </h2>
      <div className="contact-info pixel-frame">
        <p>Silakan hubungi saya melalui:</p>
        <div className="contact-links">
          <a href={`mailto:${contact.email}`} className="pixel-button">Email</a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="pixel-button">LinkedIn</a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="pixel-button">GitHub</a>
        </div>
      </div>
    </section>
  );
}

export default Contact;