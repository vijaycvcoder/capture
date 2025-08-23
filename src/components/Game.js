import React, { useEffect, useRef, useState } from 'react';
import words from 'an-array-of-english-words';
import '../styles/Game.css';

const Game = () => {
  // Canvas dimensions
  const canvasWidth = 800;
  const canvasHeight = 600;
  
  // Game state
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [fallingLetters, setFallingLetters] = useState([]);
  const [sliderPosition, setSliderPosition] = useState(canvasWidth / 2);
  const [targetWord, setTargetWord] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  
  // Refs
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const lastLetterTimeRef = useRef(0);
  
  // Constants
  const sliderWidth = 100;
  const sliderHeight = 20;
  const letterSize = 40;
  const letterSpeed = 2;
  
  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition(prev => Math.max(sliderWidth / 2, prev - 20));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition(prev => Math.min(canvasWidth - sliderWidth / 2, prev + 20));
    }
  };
  
  // Check if current word is valid
  const checkWord = () => {
    if (words.includes(currentWord.toLowerCase())) {
      setScore(prev => prev + currentWord.length * 5);
      
      // Check if current word matches target word
      if (currentWord === targetWord) {
        setScore(prev => prev + targetWord.length * 10);
        
        // Set a new target word
        const filteredWords = words.filter(word => word.length >= 4 && word.length <= 8);
        const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
        setTargetWord(randomWord.toUpperCase());
      }
      
      // Clear current word after checking
      setCurrentWord('');
    } else {
      alert('Not a valid word!');
    }
  };
  
  // Start the game
  const startGame = () => {
    setGameStarted(true);
    
    // Generate initial falling letters (A-Z)
    const initialLetters = [];
    for (let i = 0; i < 10; i++) {
      initialLetters.push({
        char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
        x: Math.random() * (canvasWidth - letterSize),
        y: -100 - Math.random() * 500, // Start above the canvas at different heights
        speed: letterSpeed + Math.random() * 1
      });
    }
    
    setFallingLetters(initialLetters);
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Game animation loop
  const animate = (time) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Add new falling letter every 1.5 seconds
    if (!lastLetterTimeRef.current || time - lastLetterTimeRef.current > 1500) {
      const newLetter = {
        char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
        x: Math.random() * (canvasWidth - letterSize),
        y: 0,
        speed: letterSpeed + Math.random() * 1
      };
      
      setFallingLetters(prev => [...prev, newLetter]);
      lastLetterTimeRef.current = time;
    }
    
    // Update and draw falling letters
    const updatedLetters = [];
    
    fallingLetters.forEach(letter => {
      // Update position
      const updatedLetter = {
        ...letter,
        y: letter.y + letter.speed
      };
      
      // Check if letter is caught by slider
      if (
        updatedLetter.y + letterSize >= canvasHeight - sliderHeight &&
        updatedLetter.y <= canvasHeight &&
        updatedLetter.x + letterSize >= sliderPosition - sliderWidth / 2 &&
        updatedLetter.x <= sliderPosition + sliderWidth / 2
      ) {
        // Letter caught
        setCurrentWord(word => word + letter.char);
        setScore(prev => prev + 10);
      } 
      // Keep letter if it's still on screen
      else if (updatedLetter.y < canvasHeight) {
        updatedLetters.push(updatedLetter);
        
        // Draw the letter
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(updatedLetter.x, updatedLetter.y, letterSize, letterSize);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(updatedLetter.char, updatedLetter.x + letterSize/2, updatedLetter.y + letterSize/2);
      }
    });
    
    // Update falling letters state
    setFallingLetters(updatedLetters);
    
    // Draw slider
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(sliderPosition - sliderWidth / 2, canvasHeight - sliderHeight, sliderWidth, sliderHeight);
    
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Initialize the game
  useEffect(() => {
    // Set a random target word from the dictionary (4-8 letters)
    const filteredWords = words.filter(word => word.length >= 4 && word.length <= 8);
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setTargetWord(randomWord.toUpperCase());
    
    // Set up keyboard controls
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);
  
  return (
    <div className="game-container">
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="target-word">Target Word: {targetWord}</div>
        <div className="current-word">Current Word: {currentWord}</div>
      </div>
      
      {!gameStarted ? (
        <div className="start-screen">
          <h2>Word Finder Game</h2>
          <p>Catch falling letters to form words!</p>
          <button 
            onClick={startGame} 
            className="start-game-button"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="game-canvas"
          />
          
          <div className="game-controls">
            <button onClick={checkWord} className="check-button">
              Check Word
            </button>
            <button 
              onClick={() => setCurrentWord('')} 
              className="clear-button"
            >
              Clear Word
            </button>
          </div>
        </>
      )}
      
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Game;