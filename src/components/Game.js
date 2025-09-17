import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/Game.css';
import words from 'an-array-of-english-words';

// Filter words that are suitable for the game (4-6 letters, no special characters)
const getRandomWords = (count = 15) => {
  const filteredWords = words.filter(word => {
    return word.length >= 4 && 
           word.length <= 6 && 
           /^[A-Za-z]+$/.test(word) &&
           !word.includes("'") &&
           !word.includes("-");
  });

  const randomWords = new Set();
  while (randomWords.size < count) {
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    randomWords.add(randomWord.toUpperCase());
  }
  
  const selectedWords = Array.from(randomWords);
  console.log('Random Words Generated:', selectedWords);
  return selectedWords;
};

const Game = () => {
  // Generate random words only once when component mounts
  const gameWords = useMemo(() => {
    const words = getRandomWords(15);
    console.log('🎯 Current Word to Find:', words[0]);
    return words;
  }, []);
  
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState(() => {
    console.log('🎮 Starting Game with Word:', gameWords[0]);
    return gameWords[0];
  });
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [sliderPosition, setSliderPosition] = useState(300);
  const [lives, setLives] = useState(3);
  const [discoveredWords, setDiscoveredWords] = useState([]);
  const [hiddenWords, setHiddenWords] = useState(gameWords);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
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

    // Reveal letter if it's in the target word
    collectedLetters.forEach(letter => {
      targetWord.split('').forEach((targetLetter, index) => {
        if (letter === targetLetter && !revealedIndices.includes(index)) {
          setRevealedIndices(prev => [...prev, index]);
          // Add points for each correct letter
          setScore(prev => prev + 10);
        }
      });
    });

    // Check if the word matches the target word
    if (word === targetWord) {
      console.log('Word Found!', {
        word: targetWord,
        wordNumber: currentWordIndex + 1,
        totalWords: gameWords.length
      });
      
      // Bonus points for completing the word
      const wordBonus = 50 + (targetWord.length * 20);
      setScore(prev => prev + wordBonus);
      setDiscoveredWords(prev => [...prev, word]);
      setCollectedLetters([]);
      setRevealedIndices([]);
      
      // Show completion message
      const wordCompleteMessage = document.createElement('div');
      wordCompleteMessage.className = 'word-complete-message';
      wordCompleteMessage.textContent = `+${wordBonus} points! Next word...`;
      document.body.appendChild(wordCompleteMessage);
      setTimeout(() => wordCompleteMessage.remove(), 2000);
      
      // Move to next word after a short delay
      setTimeout(() => {
        const nextIndex = currentWordIndex + 1;
        if (nextIndex < gameWords.length) {
          console.log('🎯 Next Word to Find:', gameWords[nextIndex]);
          console.log('📊 Game Progress:', {
            wordNumber: nextIndex + 1,
            totalWords: gameWords.length,
            remainingWords: gameWords.length - nextIndex - 1
          });
          setCurrentWordIndex(nextIndex);
          setTargetWord(gameWords[nextIndex]);
        } else {
          console.log('Game completed! All words found!');
          // Game won - all words discovered
          setLives(0);
        }
      }, 1000);
    } else if (collectedLetters.length > targetWord.length) {
      // Reduce life if collected letters exceed target word length
      setLives(prev => Math.max(0, prev - 1));
      setCollectedLetters([]);
    }
  }, [collectedLetters, targetWord, currentWordIndex, gameWords.length, revealedIndices]);


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
    <div className="game-wrapper">
      <div className="game-container">
        <div className="game-info">
          <p>Score: {score}</p>
          <p>Lives: {lives}</p>
          <p className="current-letters">{collectedLetters.join('')}</p>
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
      </div>
      <div className="words-sidebar">
        <h3>Progress: {discoveredWords.length}/{gameWords.length}</h3>
        <div className="current-word-container">
          <div className={`word-item ${discoveredWords.includes(targetWord) ? 'discovered' : 'hidden'}`}>
            <div className="word-content">
              {targetWord.split('').map((letter, index) => (
                <span key={index} className={revealedIndices.includes(index) ? 'revealed' : ''}>
                  {revealedIndices.includes(index) || discoveredWords.includes(targetWord) ? letter : '•'}
                </span>
              ))}
            </div>
            <div className="word-info">
              <span className="word-length">{targetWord.length} letters</span>
              <span className="word-hint">Current Word</span>
            </div>
          </div>
        </div>
        {!lives && (
          <div className="game-summary">
            <p>Words Found: {discoveredWords.length}</p>
            <p>Total Score: {score}</p>
          </div>
        )}
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