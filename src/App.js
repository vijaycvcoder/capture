import React from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>Word Finder Game</h1>
      </header> */}
      <main>
        <Game />
      </main>
      <footer>
        <p>Use left and right arrow keys to move the slider and catch falling letters</p>
      </footer>
    </div>
  );
}

export default App;
