# Times Table Animals - Current Implementation Status

## Project Overview
Times Table Animals is a static browser-based educational math game. Players move through themed animal habitats, solve age-appropriate math problems, and unlock new areas as they progress.

This document reflects the current repository state as implemented in the runtime code.

## Current Runtime Status

### Implemented and Active
- `index.html` provides the full DOM shell for menus, habitat selection, gameplay UI, timer warning UI, and completion/failure overlays.
- `js/main.js` is the active application entry point and controller.
- `js/gameEngine.js` provides the canvas loop, sprite management, animation state, and input plumbing.
- `js/mathEngine.js` generates problems, validates answers, manages difficulty, and integrates language-aware templates.
- `js/audioManager.js` manages music, sound effects, and narration features.
- `js/languageManager.js` handles interface translations and language switching.
- `js/timerManager.js` controls level timers, warning effects, and catastrophic timeout handling.
- Habitat implementations exist under `js/habitats/` and are used directly by `GameController`.

### Implemented but Not Canonical
- `js/sceneManager.js` exists and contains a scene abstraction, but the active runtime currently routes directly from `GameController` into habitat classes instead of using `SceneManager` as the primary navigation layer.

## Feature Coverage

### Core Gameplay
- Multiple habitats are implemented, including Bunny Meadow, Penguin Pairs Arctic, Penguin Arctic, Elephant Savanna, Monkey Jungle, Lion Pride, Dolphin Cove, Bear Forest, Giraffe Plains, Owl Observatory, Dragon Sanctuary, and Rainbow Reserve.
- The game supports habitat-specific problem presentation and completion tracking.
- Progress unlocks additional habitats over time.
- Save data is persisted with `localStorage`.

### Shared Systems
- Multiple-choice answer flow with keyboard shortcuts.
- Audio settings for music, SFX, voice, and volume.
- Language switching across the UI and problem wording.
- Timer bar, warning popup, and failure overlay.
- Badge and progress counters.

### Testing and Operations
- `npm run serve` starts a simple local HTTP server.
- `npm test` runs the Puppeteer-based automated browser test suite.
- `npm run test:quick` runs a smaller smoke test.
- `npm run deploy:check` validates expected files and deployment assumptions.
- `npm run deploy:test` now runs both the automated tests and the deployment check.

## Known Gaps and Risks

### Architecture Drift
- Runtime control lives in `js/main.js`, while `js/sceneManager.js` represents a partially separate architecture that is not currently driving the application.
- Habitat classes follow a consistent pattern but contain a large amount of repeated structure, which raises maintenance cost.

### Documentation Drift
- Earlier versions of this document incorrectly described key engine files and habitat implementations as missing.
- Future implementation work should treat the runtime code as the source of truth.

### Technical Debt
- Several habitat files are large and would benefit from shared abstractions.
- Some automated tests are brittle because they depend on direct DOM behavior and fixed interaction sequences.
- Audio usage is broader than the currently defined audio asset set, so some play requests may degrade to warnings or placeholders.

## Recommended Next Implementation Steps
1. Choose a single canonical navigation architecture: keep direct habitat routing or fully adopt `SceneManager`.
2. Extract shared habitat lifecycle behavior into a reusable base class or helper layer.
3. Tighten automated tests so deployment scripts, assertions, and documentation stay in sync.
4. Audit habitat-specific audio keys and consolidate them with the registered audio catalog.
5. Continue feature work only after the runtime architecture and documentation are aligned.

## Practical Source of Truth
- Runtime entry: `index.html` and `js/main.js`
- Gameplay systems: `js/gameEngine.js`, `js/mathEngine.js`, `js/timerManager.js`, `js/audioManager.js`, `js/languageManager.js`
- Content implementations: `js/habitats/`
- Operational commands: `package.json`