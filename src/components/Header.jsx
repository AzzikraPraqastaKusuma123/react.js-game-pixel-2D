import React from 'react';

function Header() {
  return (
    <header className="game-header">
      <div className="header-title">Zikra's Portfolio</div>
      <nav className="game-menu">
        <a href="#about" className="menu-item">About</a>
        <a href="#skills" className="menu-item">Skills</a>
        <a href="#projects" className="menu-item">Projects</a>
        <a href="#contact" className="menu-item">Contact</a>
      </nav>
    </header>
  );
}

export default Header;