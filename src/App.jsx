import React from 'react';
import Header from './components/Header';
import GameCanvas from './components/GameCanvas'; // Impor komponen game
import Footer from './components/Footer';
import './App.css'; 

function App() {
  return (
    <div className="pixel-game-portfolio">
      <Header />
      <main className="game-screen">
        <GameCanvas /> {/* Render komponen game di sini */}
      </main>
      <Footer />
    </div>
  );
}

export default App;