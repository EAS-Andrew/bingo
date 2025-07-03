# 🐲⚔️ OSRS Clan Snakes & Ladders Tracker

A RuneScape-themed snakes and ladders board game tracker for clan events! Track your team's progress through the treacherous board with dragons and ladders.

## 🎮 Features

- **OSRS-Themed Design**: Medieval fantasy styling with authentic RuneScape aesthetics
- **Visual Board**: Interactive 10x10 grid with clear visual indicators
- **Dragon & Ladder Indicators**: 
  - 🐲 Dragons (snakes) slide you down with target square indicators
  - 🪜 Ladders boost you up with destination markers
  - Animated visual effects to show connections
- **Team Management**: 
  - Add/remove teams with custom names and colors  
  - OSRS-themed color palette
  - Player roster management
  - Position tracking with rank indicators
- **Live Leaderboard**: Real-time clan rankings with medals and achievements
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 How to Use

### Adding Teams
1. Click "⚔️ Add Team" in the sidebar
2. Enter your clan team name (e.g., "Dragon Slayers")
3. Choose a team color from the OSRS palette
4. Add player names separated by commas
5. Click "⚔️ Create Team"

### Tracking Progress
- Update team positions using the number input in each team card
- Watch teams move on the board with animated indicators
- See instant leaderboard updates with achievement ranks

### Board Features
- **Dragons (Red)**: Slide teams down to lower squares
- **Ladders (Blue)**: Boost teams up to higher squares  
- **Visual Indicators**: Numbers show destination squares (e.g., ↓42, ↑91)
- **Animated Effects**: Pulsing borders on special squares
- **Team Markers**: Bouncing colored dots show current positions

## 🎨 OSRS Theme Elements

- **Colors**: Authentic RuneScape color palette (reds, blues, golds, purples)
- **Typography**: Bold, medieval-style text with drop shadows
- **Icons**: Swords, shields, dragons, and medieval symbols
- **Achievements**: Rank system (Novice → Adept → Expert → Master → Legendary)
- **UI Elements**: Stone and amber gradients with ornate borders

## 🔧 Customization

### Modifying the Board
Edit `src/data/sampleData.ts` to customize:
- Snake/dragon positions and connections
- Ladder positions and connections  
- Board size and layout
- Sample team data

### Adding New Features
- `src/types/game.ts` - Type definitions
- `src/components/GameBoard.tsx` - Board display logic
- `src/components/TeamManager.tsx` - Team management interface

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Deploy automatically with zero configuration

### Manual Build
```bash
npm run build
npm start
```

## 📱 Mobile Support
The app is fully responsive and works great on mobile devices for easy clan event management on the go!

## 🎮 Perfect for Clan Events
- Track multiple teams simultaneously  
- Real-time progress updates
- Engaging visual feedback
- OSRS community aesthetic
- Easy position management

## 🔮 Future Enhancements
- Dice roll simulation
- Event history tracking
- Custom board layouts
- Sound effects
- Chat integration

---

**May your RNG be blessed and your dragons few!** 🐲⚡

*Built with Next.js 14, TypeScript, and Tailwind CSS*
