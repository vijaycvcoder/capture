# 🎮 Word Capture - Premium Edition

A premium word capture game built with React featuring advanced gameplay mechanics, power-ups, achievements, and multiple themes.

## ✨ Premium Features

### 🎯 Core Gameplay
- **Dynamic Word Generation**: 15 randomly selected words (4-6 letters)
- **Real-time Letter Collection**: Catch falling letters with your slider
- **Progressive Difficulty**: Multiple difficulty levels (Easy, Normal, Hard, Expert)
- **Smart Word Detection**: Automatic word completion and validation

### 🚀 Power-ups System
- **Slow Motion**: Reduces letter speed for easier collection
- **Letter Magnet**: Attracts letters toward your slider
- **Word Hint**: Reveals a random letter in the target word
- **Shield**: Protects against life loss for incorrect letters

### 🏆 Achievement System
- **First Steps**: Complete your first word
- **Speed Demon**: Complete 5 words in under 30 seconds
- **Perfect Game**: Complete a game without losing a life
- **Word Master**: Complete 50 words total

### 🎨 Visual Themes
- **Default**: Clean, modern design with blue accents
- **Neon**: Dark theme with glowing green effects
- **Retro**: Warm orange and yellow color scheme

### 🎵 Enhanced Experience
- **Particle Effects**: Visual feedback for letter collection and word completion
- **Sound Effects**: Audio feedback for various game events
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Fluid transitions and hover effects

## 🎮 How to Play

1. **Objective**: Collect falling letters to form the target word
2. **Controls**: 
   - Use arrow keys (← →) or mouse movement to control the slider
   - Touch and drag on mobile devices
3. **Scoring**: Earn points for correct letters and completed words
4. **Lives**: Start with 3 lives, lose one for incorrect letters
5. **Power-ups**: Use coins to purchase helpful power-ups
6. **Achievements**: Unlock badges by reaching specific milestones

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd capture
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🛠️ Technical Features

### Performance Optimizations
- **Canvas-based Rendering**: Smooth 60fps animations
- **Efficient State Management**: Optimized React hooks usage
- **Memory Management**: Proper cleanup of animations and particles
- **Responsive Design**: Adaptive canvas sizing for all screen sizes

### Code Architecture
- **Modular Components**: Clean separation of concerns
- **Custom Hooks**: Reusable game logic
- **TypeScript-ready**: Easy to migrate to TypeScript
- **Accessibility**: Keyboard navigation and screen reader support

## 🎯 Game Mechanics

### Scoring System
- **Letter Collection**: 10 points per correct letter
- **Word Completion**: 50 + (word length × 20) points
- **Difficulty Bonus**: Additional points based on difficulty level
- **Coin Rewards**: Earn coins based on score (1 coin per 10 points)

### Power-up Costs
- **Slow Motion**: 100 coins (5 seconds)
- **Letter Magnet**: 150 coins (8 seconds)
- **Word Hint**: 200 coins (instant)
- **Shield**: 300 coins (10 seconds)

### Difficulty Levels
- **Easy**: 70% normal speed
- **Normal**: 100% normal speed
- **Hard**: 150% normal speed
- **Expert**: 200% normal speed

## 🎨 Customization

### Adding New Themes
1. Add theme colors to the CSS variables
2. Update the theme selector in the Game component
3. Modify the canvas rendering logic for theme-specific effects

### Adding New Power-ups
1. Define the power-up in the `POWER_UPS` constant
2. Add activation logic in the `activatePowerUp` function
3. Implement the power-up effect in the game loop
4. Add UI elements for the new power-up

### Adding New Achievements
1. Define the achievement in the `ACHIEVEMENTS` constant
2. Add detection logic in the `checkAchievements` function
3. Update the achievements display in the UI

## 📱 Mobile Support

The game is fully responsive and optimized for mobile devices:
- Touch controls for slider movement
- Adaptive canvas sizing
- Touch-friendly UI elements
- Optimized performance for mobile browsers

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── Game.js          # Main game component
│   └── AlphabetTiles.js # Alphabet display component
├── styles/
│   ├── Game.css         # Main game styles
│   └── AlphabetTiles.css # Alphabet styles
└── App.js               # Root component
```

### Key Dependencies
- **React**: UI framework
- **an-array-of-english-words**: Word database
- **Canvas API**: Game rendering
- **CSS3**: Styling and animations

## 🚀 Deployment Options

### Local Deployment
```bash
npm run build
npm run preview
```

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Run: `npm run deploy`

## 🎉 Future Enhancements

- [ ] Multiplayer mode
- [ ] Online leaderboards
- [ ] Custom word lists
- [ ] More power-up types
- [ ] Sound effects and background music
- [ ] Save/load game progress
- [ ] Social sharing features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Enjoy playing Word Capture Premium! 🎮✨**