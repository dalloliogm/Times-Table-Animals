# Times Table Animals

Times Table Animals is a browser-based educational math game built around animal habitats, short problem loops, and progressive unlocks. Players help animal characters by solving age-appropriate math questions across themed environments such as Bunny Meadow, Penguin Arctic, Dragon Sanctuary, and Rainbow Reserve.

The project runs as a static HTML5 application with JavaScript managers for gameplay, rendering, audio, language switching, and timers.

## Highlights

- 12 themed habitats with progressive unlocking
- Multiple math domains, from addition to mixed challenge problems
- Local progress saving with `localStorage`
- English, Spanish, and Italian language support
- Music, SFX, voice, and volume settings
- Canvas-based habitat gameplay with DOM-based menus and overlays
- Automated browser tests with Puppeteer

## Current Status

The game is implemented and runnable today.

Core runtime pieces currently in use:

- `index.html` as the main HTML shell
- `js/main.js` as the effective application entry point
- `js/gameEngine.js` for canvas rendering and animation state
- `js/mathEngine.js` for problem generation and validation
- `js/audioManager.js` for music and sound effects
- `js/languageManager.js` for UI localization
- `js/timerManager.js` for countdowns and failure events
- `js/habitats/` for habitat-specific gameplay controllers

There is also a `js/sceneManager.js`, but the active runtime currently routes directly from `GameController` into habitat classes.

## Quick Start

### Requirements

- Node.js 14+
- A modern browser
- Python is optional, but useful for the local static server script

### Run Locally

Install dependencies:

```bash
npm install
```

Start the local server:

```bash
npm run serve
```

Then open:

```text
http://localhost:8080
```

If Python is not available, you can also open `index.html` directly in a browser.

## Available Scripts

From the project root:

```bash
npm run serve
```

Starts a simple local HTTP server.

```bash
npm test
```

Runs the main Puppeteer-based automated test suite.

```bash
npm run test:quick
```

Runs a smaller smoke test for development.

```bash
npm run test:install
```

Installs Puppeteer explicitly if needed.

```bash
npm run deploy:check
```

Runs repository and deployment sanity checks.

```bash
npm run deploy:test
```

Runs the automated test suite and the deployment check.

## Gameplay Flow

1. Launch from the main menu.
2. Choose an unlocked habitat.
3. Solve multiple-choice math problems.
4. Complete the habitat target to earn progress and badges.
5. Unlock the next habitat and continue.

The game currently starts with:

- `Bunny Meadow` unlocked
- `Penguin Pairs Arctic` unlocked

Further habitats unlock as the player completes earlier ones.

## Habitats

Current habitat lineup:

- Bunny Meadow
- Penguin Pairs Arctic
- Penguin Arctic
- Elephant Savanna
- Monkey Jungle
- Lion Pride
- Dolphin Cove
- Bear Forest
- Giraffe Plains
- Owl Observatory
- Dragon Sanctuary
- Rainbow Reserve

## Controls

### Menus

- Mouse or touch-style click interaction for buttons and habitat cards

### In Problems

- Click one of the four answer buttons
- Keyboard shortcuts:
  - `q`
  - `w`
  - `e`
  - `r`

### In Game UI

- `🏠` return/home control
- `⏸️` pause button
- `⚙️` settings button

## Project Structure

```text
Times-Table-Animals/
├── index.html
├── package.json
├── GAME_IMPLEMENTATION_STATUS.md
├── assets/
├── css/
│   ├── animations.css
│   ├── styles.css
│   └── timer.css
├── js/
│   ├── audioManager.js
│   ├── gameEngine.js
│   ├── languageManager.js
│   ├── main.js
│   ├── mathEngine.js
│   ├── questionTemplates.js
│   ├── sceneManager.js
│   ├── timerManager.js
│   └── habitats/
└── tests/
```

## Architecture Overview

### Runtime Model

The app is loaded as a static browser application using ordered global script tags in `index.html`.

### Main Responsibilities

- `js/main.js`
  - bootstraps the app
  - wires DOM events
  - manages save state, screen switching, habitat entry, progression, and timer polling

- `js/mathEngine.js`
  - selects problem types per habitat
  - generates problems and distractors
  - validates answers
  - supports language-aware templates

- `js/gameEngine.js`
  - manages the canvas loop
  - handles sprites, particles, and animation state

- `js/timerManager.js`
  - runs habitat timers
  - updates warning states
  - controls catastrophic timeout overlays

- `js/audioManager.js`
  - handles music and synthesized/fallback sound effects

- `js/languageManager.js`
  - manages UI translation strings and language switching

- `js/habitats/*.js`
  - implement each themed habitat experience directly

## Testing

Automated tests live in `tests/`.

Coverage currently focuses on:

- loading the game
- menu and habitat navigation
- answer interaction
- progression flow
- keyboard input
- deployment sanity checks

For test-specific details, see `tests/README.md`.

## Save Data

Progress is stored locally in the browser using `localStorage`.

Current tracked state includes:

- badge count
- unlocked habitats
- per-habitat completion progress
- settings such as language, difficulty, music, SFX, voice, and volume

## Known Limitations

- `SceneManager` exists but is not the canonical runtime navigation path.
- Some game systems still carry architectural duplication from earlier iterations.
- Habitat files are large and contain repeated lifecycle patterns.
- Automated tests are useful but remain browser-flow oriented rather than deep unit coverage.

## Development Notes

If you are extending the game, the safest source of truth is the runtime code itself:

- `index.html`
- `js/main.js`
- `js/habitats/`
- `js/mathEngine.js`
- `js/timerManager.js`
- `js/audioManager.js`

The repository also includes `GAME_IMPLEMENTATION_STATUS.md`, which summarizes the current implementation state at a higher level.

## License

MIT