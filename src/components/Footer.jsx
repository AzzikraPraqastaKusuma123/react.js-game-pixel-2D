import React from 'react';
import './Footer.css'; // Kita akan buat file ini

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="pixel-footer">
      <p>&copy; {currentYear} Azzikra Praqasta Kusuma. All rights reserved.</p>
    </footer>
  );
}

export default Footer;