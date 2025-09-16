import React from 'react';
import '../styles/AlphabetTiles.css';

const AlphabetTiles = () => {
  // Create an array of alphabets from A to Z
  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="alphabet-tiles-container">
      {alphabets.map((letter, index) => (
        <div key={index} className="alphabet-tile">
          {letter}
        </div>
      ))}
    </div>
  );
};

export default AlphabetTiles;