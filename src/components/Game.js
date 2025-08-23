import React, { useState, useEffect, useRef } from 'react';
import '../styles/Game.css';

const Game = () => {
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState('REACT');
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [sliderPosition, setSliderPosition] = useState(300);
  const [lives, setLives] = useState(3); // Add lives state
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameCountRef = useRef(0);
  const lettersRef = useRef([]);
  const sliderSpeed = 10; // Pixels to move per keypress // Store letters in a ref instead of state

  // Initialize falling letters
  useEffect(() => {
    // Initial letters will be created in the game loop
    return () => {
      lettersRef.current = []; // Clean up letters on unmount
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });

    // Responsive canvas size
    const getCanvasSize = () => {
      const width = Math.min(window.innerWidth, 600);
      const height = Math.min(window.innerHeight * 0.6, 400);
      return { width, height };
    };

    const setCanvasSize = () => {
      const { width, height } = getCanvasSize();
      canvas.width = width;
      canvas.height = height;
    };

    setCanvasSize();

    // Enable image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lastTime = 0;
    let frameDelay = 16;

    const addNewLetter = () => {
      if (lettersRef.current.length < 5) {
        const { width } = getCanvasSize();
        lettersRef.current.push({
          char: letters[Math.floor(Math.random() * letters.length)],
          x: 0.08 * width + Math.random() * (width - 0.16 * width),
          y: -20,
          speed: 1.5,
          id: Math.random()
        });
      }
    };

    if (lettersRef.current.length === 0) {
      addNewLetter();
      addNewLetter();
    }

    const animate = (timestamp) => {
      setCanvasSize();
      const { width, height } = getCanvasSize();
      if (timestamp - lastTime < frameDelay) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;
      frameCountRef.current += 1;

      if (frameCountRef.current % 60 === 0) {
        addNewLetter();
      }

      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, width, height);

      const updatedLetters = [];
      ctx.font = `bold ${Math.max(20, width/30)}px Arial`;

      for (const letter of lettersRef.current) {
        const newY = letter.y + 2;
        if (newY > height - 50 && newY < height - 30 && letter.x > sliderPosition - 50 && letter.x < sliderPosition + 50) {
          setCollectedLetters(prev => [...prev, letter.char]);
          continue;
        }
        if (newY > height) continue;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(letter.x - 2, letter.y - 24, 30, 34);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(letter.x - 2, letter.y - 24, 30, 34);
        ctx.fillStyle = '#000';
        ctx.fillText(letter.char, letter.x, letter.y);
        updatedLetters.push({ ...letter, y: newY });
      }
      lettersRef.current = updatedLetters;

      // Responsive slider
      const sliderWidth = Math.max(60, width * 0.16);
      const sliderHeight = Math.max(16, height * 0.05);
      const sliderY = height - 40;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(sliderPosition - sliderWidth/2 + 2, sliderY + 2, sliderWidth, sliderHeight);
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight);
      ctx.strokeStyle = '#1976D2';
      ctx.lineWidth = 2;
      ctx.strokeRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight/2);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    window.addEventListener('resize', setCanvasSize);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [sliderPosition]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault(); // Prevent default arrow key scrolling
      
      switch (e.key) {
        case 'ArrowLeft':
          setSliderPosition(prev => Math.max(50, prev - sliderSpeed));
          break;
        case 'ArrowRight':
          setSliderPosition(prev => Math.min(550, prev + sliderSpeed));
          break;
      }
    };

    // Handle both keydown and keyup events
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Check for word completion and life reduction
  useEffect(() => {
    const word = collectedLetters.join('');
    // If any collected letter is not in the target word, reduce a life
    if (collectedLetters.length > 0 && collectedLetters.some(l => !targetWord.includes(l))) {
      setLives(prev => Math.max(0, prev - 1));
      setCollectedLetters([]);
      return;
    }
    if (word === targetWord) {
      setScore(prev => prev + 100);
      setCollectedLetters([]);
      // Generate new target word
      setTargetWord('REACT'); // You can implement random word generation here
    } else if (collectedLetters.length > targetWord.length) {
      // Reduce life if collected letters exceed target word length
      setLives(prev => Math.max(0, prev - 1));
      setCollectedLetters([]);
    }
  }, [collectedLetters, targetWord]);


  // Handle mouse movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSliderPosition(() => {
      // Responsive boundaries
      const min = canvas.width * 0.08;
      const max = canvas.width * 0.92;
      return Math.max(min, Math.min(max, x));
    });
  };

  // Handle touch movement for mobile
  const handleTouchMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX - rect.left;
    setSliderPosition(() => {
      const min = canvas.width * 0.08;
      const max = canvas.width * 0.92;
      return Math.max(min, Math.min(max, x));
    });
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <p>Score: {score}</p>
        <p>Lives: {lives}</p>
        <p>Target Word: {targetWord}</p>
        <p>Collected Letters: {collectedLetters.join('')}</p>
      </div>
      <canvas 
        ref={canvasRef} 
        className="game-canvas"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={{ cursor: 'none', touchAction: 'none' }}
      />
      <div className="game-controls">
        <p>Use ← → arrow keys or move mouse to control the slider</p>
      </div>
      {lives === 0 && (
        <div className="game-over-popup">
          <div className="game-over-content">
            <h2>Game Over</h2>
            <p>Your score: {score}</p>
            <button onClick={() => {
              setScore(0);
              setLives(3);
              setCollectedLetters([]);
              setTargetWord('REACT');
            }}>
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;