# Memory Match Arena

Memory Match Arena is a polished browser-based memory card matching game built with Next.js, React, TypeScript, Tailwind CSS, Three.js, and Phaser. Players flip cards, remember positions, score matched pairs, and compete against friends or simple computer opponents on themed boards.

The project is designed as a complete local game experience: setup screens, player configuration, difficulty selection, animated cards, score tracking, game completion states, and a browser-local leaderboard.

## Features

- Shared-device multiplayer for 2 to 4 human players
- Computer mode with simple automated opponents
- Three difficulty levels: Easy, Medium, and Hard
- Multiple visual playgrounds, including classic, forest, neon, royal, space, and minimal dark themes
- Selectable card symbol sets: hand signs, arcade runes, and gems
- Animated card flipping and match resolution
- Turn indicator, score board, restart flow, and game completion modal
- Leaderboard records saved locally in the browser
- Responsive interface for desktop and mobile screens
- 3D memory-card hero scene on the home page

## Tech Stack

- **Framework:** Next.js App Router
- **UI:** React, TypeScript, Tailwind CSS
- **3D:** Three.js
- **Interactive selector:** Phaser
- **Icons:** Lucide React
- **State persistence:** `localStorage`
- **Linting:** ESLint with Next.js config

## Getting Started

### Prerequisites

Install Node.js 20 or newer and npm.

### Installation

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Start the Production Build

```bash
npm run start
```

### Run Linting

```bash
npm run lint
```

## Game Flow

1. Visit the home page and choose **Play**.
2. Enter a player name and username.
3. Select either local players or computer mode.
4. Configure participant names.
5. Choose a board theme, difficulty, and card symbol set.
6. Start the match and flip two cards per turn.
7. Score one point for every matched pair.
8. Finish the board and review the saved result on the leaderboard.

## Rules Summary

- Cards start face down.
- A player flips two cards on each turn.
- Matching cards stay revealed and award one point.
- A successful match lets the same participant continue.
- A missed pair flips back and the turn moves to the next participant.
- When all pairs are matched, the highest score wins.
- Tied winners are recorded together.

## Project Structure

```text
app/
  page.tsx              Home page
  play/                 Player profile entry
  mode/                 Player vs computer selection
  participants/         Participant editor
  playgrounds/          Board, difficulty, and symbol setup
  game/                 Main game route
  rules/                Rules guide
  settings/             Local profile settings
  leaderboard/          Local leaderboard page

components/
  GameExperience.tsx    Main game state and turn logic
  MemoryBoard.tsx       Card grid layout
  MemoryCard.tsx        Individual flipping card
  ScoreBoard.tsx        Participant scores
  TurnIndicator.tsx     Current turn and remaining pairs
  ThreeMemoryCards.tsx  Home-page 3D visual
  PhaserHandSelector.tsx Symbol set selector
  Navbar.tsx            Main navigation

lib/
  constants.ts          Routes, defaults, difficulties, themes, symbols
  gameLogic.ts          Deck creation, turn helpers, winner calculation
  leaderboard.ts        Local leaderboard helpers
  localStorage.ts       Browser storage helpers
  types.ts              Shared TypeScript types

styles/
  globals.css           Global styles and card flip utilities
```

## Data Storage

This app does not require a backend. User profile details, selected game settings, participant setup, selected playground, and leaderboard records are stored in the browser with `localStorage`.

Because records are local to the current browser, clearing browser storage will remove saved settings and leaderboard history.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Runs the production server after building |
| `npm run lint` | Runs ESLint across the project |

## Notes for Contributors

- Game rules and pure helpers live in `lib/gameLogic.ts`.
- UI configuration data such as routes, difficulties, themes, and symbol sets live in `lib/constants.ts`.
- The main gameplay state is managed in `components/GameExperience.tsx`.
- The app uses client-side storage, so browser-only logic should stay inside client components or storage helpers.
- Keep new UI consistent with the existing dark arcade style, compact controls, responsive layouts, and animated card interactions.

## License

No license has been added yet. Add one before distributing or reusing this project publicly.
