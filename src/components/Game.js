import React, { useState, useEffect, useRef } from 'react';
import '../styles/Game.css';

const Game = () => {
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState('REACT');
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [sliderPosition, setSliderPosition] = useState(300);
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
    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
    
    // Set fixed canvas size
    canvas.width = 600;  // Fixed width
    canvas.height = 400; // Fixed height
    
    // Enable image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lastTime = 0;
    let frameDelay = 16; // Approximately 60 FPS

    const addNewLetter = () => {
      if (lettersRef.current.length < 5) {
        lettersRef.current.push({
          char: letters[Math.floor(Math.random() * letters.length)],
          x: 50 + Math.random() * (canvas.width - 100), // Keep letters away from edges
          y: -20,
          speed: 1.5, // Slightly faster speed
          id: Math.random()
        });
      }
    };
    
    // Add initial letters if none exist
    if (lettersRef.current.length === 0) {
      addNewLetter();
      addNewLetter();
    }
    
    const animate = (timestamp) => {
      if (timestamp - lastTime < frameDelay) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;
      frameCountRef.current += 1;
      
      // Add new letter every 60 frames (about 1 second)
      if (frameCountRef.current % 60 === 0) {
        addNewLetter();
      }

      // Clear with background color instead of clearRect
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw letters
      const updatedLetters = [];
      
      // Pre-render letters
      ctx.font = 'bold 28px Arial';
      
      for (const letter of lettersRef.current) {
        // Update position
        const newY = letter.y + 2;
        
        // Check collision with slider
        if (newY > canvas.height - 50 && 
            newY < canvas.height - 30 &&
            letter.x > sliderPosition - 50 && 
            letter.x < sliderPosition + 50) {
          setCollectedLetters(prev => [...prev, letter.char]);
          continue;
        }
        
        // Remove letters that fall off screen
        if (newY > canvas.height) continue;
        
        // Draw letter background with slight transparency
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(letter.x - 2, letter.y - 24, 30, 34);
        
        // Draw letter border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(letter.x - 2, letter.y - 24, 30, 34);
        
        // Draw letter
        ctx.fillStyle = '#000';
        ctx.fillText(letter.char, letter.x, letter.y);
        
        // Keep letter for next frame
        updatedLetters.push({
          ...letter,
          y: newY
        });
      }
      
      // Update letters in ref
      lettersRef.current = updatedLetters;

      // Draw slider with anti-aliasing
      const sliderWidth = 100;
      const sliderHeight = 20;
      const sliderY = canvas.height - 40;
      
      // Draw slider shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(sliderPosition - sliderWidth/2 + 2, sliderY + 2, sliderWidth, sliderHeight);
      
      // Draw slider body
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight);
      
      // Draw slider border
      ctx.strokeStyle = '#1976D2';
      ctx.lineWidth = 2;
      ctx.strokeRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight);
      
      // Draw slider highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight/2);

      // Schedule next frame
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate(0);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [sliderPosition]); // Add sliderPosition dependency so slider redraws when moved

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

  // Check for word completion
  useEffect(() => {
    const word = collectedLetters.join('');
    if (word === targetWord) {
      setScore(prev => prev + 100);
      setCollectedLetters([]);
      // Generate new target word
      setTargetWord('REACT'); // You can implement random word generation here
    }
  }, [collectedLetters, targetWord]);

  // Handle mouse/touch movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSliderPosition(prev => {
      const newPos = Math.max(50, Math.min(550, x));
      return newPos;
    });
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <p>Score: {score}</p>
        <p>Target Word: {targetWord}</p>
        <p>Collected Letters: {collectedLetters.join('')}</p>
      </div>
      <canvas 
        ref={canvasRef} 
        className="game-canvas"
        onMouseMove={handleMouseMove}
        style={{ cursor: 'none' }} // Hide cursor over canvas
      />
      <div className="game-controls">
        <p>Use ← → arrow keys or move mouse to control the slider</p>
      </div>
    </div>
  );
};

export default Game;