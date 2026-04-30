// Times Table Animals - Main Game Controller
// Welcome Albert Animals Sanctuary

class GameController {
    constructor() {
        window.gameController = this;
        this.currentScreen = 'loadingScreen';
        this.isSubmittingAnswer = false; // Flag to prevent double submission
        this.isGamePaused = false;
        this.gameState = this.createDefaultGameState();
        this.init();
    }

    createDefaultGameState() {
        return {
            playerName: 'Junior Caretaker',
            badgeCount: 0,
            currentHabitat: null,
            habitatProgress: {
                bunnyMeadow: { completed: 0, total: 10, unlocked: true },
                penguinPairsArctic: { completed: 0, total: 12, unlocked: true },
                penguinArctic: { completed: 0, total: 12, unlocked: false },
                elephantSavanna: { completed: 0, total: 10, unlocked: false },
                monkeyJungle: { completed: 0, total: 15, unlocked: false },
                lionPride: { completed: 0, total: 12, unlocked: false },
                dolphinCove: { completed: 0, total: 14, unlocked: false },
                bearForest: { completed: 0, total: 11, unlocked: false },
                giraffePlains: { completed: 0, total: 13, unlocked: false },
                owlObservatory: { completed: 0, total: 16, unlocked: false },
                dragonSanctuary: { completed: 0, total: 20, unlocked: false },
                earthwormSoil: { completed: 0, total: 20, unlocked: false },
                caterpillarNursery: { completed: 0, total: 20, unlocked: false },
                butterflyVivarium: { completed: 0, total: 20, unlocked: false },
                frogPond: { completed: 0, total: 20, unlocked: false },
                rainbowReserve: { completed: 0, total: 25, unlocked: false },
                chickIncubator: { completed: 0, total: 20, unlocked: false }
            },
            settings: {
                musicEnabled: true,
                sfxEnabled: true,
                voiceEnabled: true,
                masterVolume: 75,
                language: 'en',
                difficulty: 'medium',
                timerPace: 'balanced',
                timerStyle: 'gentle'
            }
        };
    }

    normalizeGameState(savedState) {
        const defaults = this.createDefaultGameState();
        const parsedState = savedState && typeof savedState === 'object' ? savedState : {};
        const savedSettings = parsedState.settings && typeof parsedState.settings === 'object'
            ? parsedState.settings
            : {};
        const savedHabitatProgress = parsedState.habitatProgress && typeof parsedState.habitatProgress === 'object'
            ? parsedState.habitatProgress
            : {};

        const habitatProgress = Object.fromEntries(
            Object.entries(defaults.habitatProgress).map(([habitatName, defaultProgress]) => {
                const savedProgress = savedHabitatProgress[habitatName] && typeof savedHabitatProgress[habitatName] === 'object'
                    ? savedHabitatProgress[habitatName]
                    : {};

                const completed = Number.isFinite(Number(savedProgress.completed))
                    ? Math.max(0, Number(savedProgress.completed))
                    : defaultProgress.completed;
                const total = Number.isFinite(Number(savedProgress.total)) && Number(savedProgress.total) > 0
                    ? Number(savedProgress.total)
                    : defaultProgress.total;

                return [habitatName, {
                    completed: Math.min(completed, total),
                    total,
                    unlocked: typeof savedProgress.unlocked === 'boolean'
                        ? savedProgress.unlocked
                        : defaultProgress.unlocked
                }];
            })
        );

        return {
            ...defaults,
            ...parsedState,
            playerName: typeof parsedState.playerName === 'string' && parsedState.playerName.trim()
                ? parsedState.playerName
                : defaults.playerName,
            badgeCount: Number.isFinite(Number(parsedState.badgeCount))
                ? Math.max(0, Number(parsedState.badgeCount))
                : defaults.badgeCount,
            currentHabitat: typeof parsedState.currentHabitat === 'string'
                ? parsedState.currentHabitat
                : defaults.currentHabitat,
            settings: {
                ...defaults.settings,
                ...savedSettings,
                musicEnabled: typeof savedSettings.musicEnabled === 'boolean'
                    ? savedSettings.musicEnabled
                    : defaults.settings.musicEnabled,
                sfxEnabled: typeof savedSettings.sfxEnabled === 'boolean'
                    ? savedSettings.sfxEnabled
                    : defaults.settings.sfxEnabled,
                voiceEnabled: typeof savedSettings.voiceEnabled === 'boolean'
                    ? savedSettings.voiceEnabled
                    : defaults.settings.voiceEnabled,
                masterVolume: Number.isFinite(Number(savedSettings.masterVolume))
                    ? Math.min(100, Math.max(0, Number(savedSettings.masterVolume)))
                    : defaults.settings.masterVolume,
                language: typeof savedSettings.language === 'string' && savedSettings.language.trim()
                    ? savedSettings.language
                    : defaults.settings.language,
                difficulty: typeof savedSettings.difficulty === 'string' && savedSettings.difficulty.trim()
                    ? savedSettings.difficulty
                    : defaults.settings.difficulty,
                timerPace: ['relaxed', 'balanced', 'speedy'].includes(savedSettings.timerPace)
                    ? savedSettings.timerPace
                    : defaults.settings.timerPace,
                timerStyle: ['gentle', 'dramatic'].includes(savedSettings.timerStyle)
                    ? savedSettings.timerStyle
                    : defaults.settings.timerStyle
            },
            habitatProgress
        };
    }

    init() {
        // Show the loading screen immediately.
        this.showLoadingScreen();
        this.setupLoadingScreenControls();
        this.restoreOpeningScreenState();

        try {
            // Load saved game state
            this.loadGameState();
            
            // Initialize event listeners
            this.setupEventListeners();
            
            // Initialize managers
            this.languageManager = new LanguageManager();
            this.audioManager = new AudioManager(this.gameState.settings);
            this.mathEngine = new MathEngine();
            this.gameEngine = new GameEngine();
            this.timerManager = new TimerManager(this, this.audioManager);
            this.sceneManager = new SceneManager();
            this.applyTimerSettings();
            
            // Set initial language
            this.languageManager.setLanguage(this.gameState.settings.language);
            
            // Set initial language and difficulty for MathEngine
            this.mathEngine.setLanguage(this.gameState.settings.language);
            this.mathEngine.setDifficulty(this.gameState.settings.difficulty);
            
            // Listen for language changes
            document.addEventListener('languageChanged', (e) => {
                this.onLanguageChanged(e.detail.language);
            });
            
            // Set up timer callbacks
            this.setupTimerCallbacks();

            // Initialize Leo mascot messages
            this.initializeLeoMascot();
            
            // Start timer update loop
            this.startTimerUpdateLoop();
        } catch (error) {
            console.error('GameController init failed:', error);
        }
    }

    scheduleInitialMenuTransition() {
        if (this.initialMenuTransitionScheduled) return;

        this.initialMenuTransitionScheduled = true;
        this.showLoadingStatus('loading');
        this.rememberOpeningScreenState('loading');
        setTimeout(() => {
            this.forceOpenMainMenu();
        }, 2000);
    }

    setupLoadingScreenControls() {
        const notInHurryBtn = document.getElementById('notInHurryBtn');
        if (notInHurryBtn && !notInHurryBtn.dataset.bound) {
            notInHurryBtn.addEventListener('click', () => {
                this.scheduleInitialMenuTransition();
            });
            notInHurryBtn.dataset.bound = 'true';
        }

        const inHurryBtn = document.getElementById('inHurryBtn');
        if (inHurryBtn && !inHurryBtn.dataset.bound) {
            inHurryBtn.addEventListener('click', () => {
                this.showLoadingStatus('quick');
                this.rememberOpeningScreenState('quick');
            });
            inHurryBtn.dataset.bound = 'true';
        }

        const quickStartBtn = document.getElementById('quickStartBtn');
        if (quickStartBtn && !quickStartBtn.dataset.bound) {
            quickStartBtn.addEventListener('click', () => {
                this.forceOpenMainMenu();
            });
            quickStartBtn.dataset.bound = 'true';
        }
    }

    forceOpenMainMenu() {
        try {
            this.clearOpeningScreenState();
            this.switchScreen('mainMenu');
            this.updateLeoHomeMessage('mainMenu');
            document.body.classList.remove('habitat-select-mode', 'credits-mode');

            if (this.audioManager) {
                this.audioManager.playBackgroundMusic('menu');
            }
        } catch (error) {
            console.error('Force opening main menu failed:', error);
        }
    }

    setupEventListeners() {
        // Main Menu Events
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('achievementsBtn').addEventListener('click', () => {
            this.showAchievements();
        });

        document.getElementById('creditsBtn').addEventListener('click', () => {
            this.showCredits();
        });

        // Settings Events
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showMainMenu();
        });

        document.getElementById('musicToggle').addEventListener('change', (e) => {
            this.gameState.settings.musicEnabled = e.target.checked;
            this.audioManager.toggleMusic(e.target.checked);
            this.saveGameState();
        });

        document.getElementById('sfxToggle').addEventListener('change', (e) => {
            this.gameState.settings.sfxEnabled = e.target.checked;
            this.audioManager.toggleSFX(e.target.checked);
            this.saveGameState();
        });

        document.getElementById('voiceToggle').addEventListener('change', (e) => {
            this.gameState.settings.voiceEnabled = e.target.checked;
            this.audioManager.toggleVoice(e.target.checked);
            this.saveGameState();
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.gameState.settings.masterVolume = e.target.value;
            this.audioManager.setMasterVolume(e.target.value);
            this.saveGameState();
        });

        document.getElementById('timerPaceSelect').addEventListener('change', (e) => {
            this.gameState.settings.timerPace = e.target.value;
            this.applyTimerSettings();
            this.saveGameState();
        });

        document.getElementById('timerStyleSelect').addEventListener('change', (e) => {
            this.gameState.settings.timerStyle = e.target.value;
            this.applyTimerSettings();
            this.saveGameState();
        });

        // Language Selector Events
        document.getElementById('languageSelectorBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleLanguageDropdown();
        });

        // Language option selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.language-option')) {
                const option = e.target.closest('.language-option');
                const langCode = option.getAttribute('data-lang');
                this.selectLanguage(langCode);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) {
                this.closeLanguageDropdown();
            }
            if (!e.target.closest('.difficulty-selector')) {
                this.closeDifficultyDropdown();
            }
        });

        // Difficulty Selector Events
        document.getElementById('difficultySelectorBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDifficultyDropdown();
        });

        // Difficulty option selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.difficulty-option')) {
                const option = e.target.closest('.difficulty-option');
                const difficulty = option.getAttribute('data-difficulty');
                this.selectDifficulty(difficulty);
            }
        });

        // Reset Progress Button
        document.getElementById('resetProgressBtn').addEventListener('click', () => {
            this.resetProgress();
        });

        // Credits Screen Events
        document.getElementById('backToMenuFromCredits').addEventListener('click', () => {
            this.showMainMenu();
        });

        document.getElementById('backToMenuFromAchievements').addEventListener('click', () => {
            this.showMainMenu();
        });

        // Game UI Events
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showLeoHelp();
        });

        document.getElementById('startAgainBtn').addEventListener('click', () => {
            this.startCurrentHabitatAgain();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            if (this.isGamePaused) {
                this.resumeGame();
                return;
            }
            this.pauseGame();
        });

        document.getElementById('settingsGameBtn').addEventListener('click', () => {
            this.showGameSettings();
        });

        // Habitat Selection Events
        document.getElementById('backToHabitats').addEventListener('click', () => {
            this.showHabitatSelection();
        });

        // Home Button Event
        const goBackBtn = document.getElementById('goBackBtn');
        if (goBackBtn) {
            goBackBtn.addEventListener('click', () => {
                this.showHabitatSelection();
            });
        }

        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.showHabitatSelection();
            });
        }

        // Math Problem Events - Multiple Choice Options
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`option${i}`).addEventListener('click', () => {
                console.log(`GameController: Option ${i} clicked`);
                this.selectAnswer(i);
            });
        }

        // Keyboard support for keys q-w-e-r
        document.addEventListener('keydown', (e) => {
            const keyMap = { 'q': 1, 'w': 2, 'e': 3, 'r': 4 };
            const key = e.key.toLowerCase();
            if (keyMap[key]) {
                console.log(`GameController: Key ${key} pressed`);
                this.selectAnswer(keyMap[key]);
            }
        });

        document.getElementById('nextProblem').addEventListener('click', () => {
            this.nextProblem();
        });

        // Timer Events
        document.getElementById('retryLevelBtn').addEventListener('click', () => {
            this.retryLevel();
        });

        document.getElementById('backToHabitatsBtn').addEventListener('click', () => {
            this.exitToHabitats();
        });

        document.getElementById('resumeGameBtn').addEventListener('click', () => {
            this.resumeGame();
        });

        document.getElementById('pauseBackToHabitatsBtn').addEventListener('click', () => {
            this.hidePauseOverlay();
            this.isGamePaused = false;
            this.showHabitatSelection();
        });

        // Habitat Card Events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.habitat-card')) {
                const card = e.target.closest('.habitat-card');
                if (card.classList.contains('unlocked')) {
                    const habitat = card.dataset.habitat;
                    this.enterHabitat(habitat);
                }
            }
        });
    }

    showLoadingScreen() {
        this.switchScreen('loadingScreen');
        this.updateLeoHomeMessage('loadingScreen');
        this.showLoadingChoice();
    }

    showMainMenu() {
        // Remove scrolling modes
        document.body.classList.remove('habitat-select-mode', 'credits-mode');
        this.isGamePaused = false;
        this.hidePauseOverlay();
        
        this.switchScreen('mainMenu');
        this.updateLeoHomeMessage('mainMenu');
        if (this.audioManager) {
            this.audioManager.playBackgroundMusic('menu');
        }
    }

    showSettings() {
        // Remove scrolling modes
        document.body.classList.remove('habitat-select-mode', 'credits-mode');
        
        this.switchScreen('settingsMenu');
        try {
            this.updateSettingsUI();
        } catch (error) {
            console.error('Failed to update settings UI:', error);
        }
    }

    showAchievements() {
        document.body.classList.remove('habitat-select-mode', 'credits-mode');
        this.updateAchievementsUI();
        this.switchScreen('achievementsScreen');
    }

    showCredits() {
        // Remove habitat selection scrolling mode
        document.body.classList.remove('habitat-select-mode');
        
        // Enable credits scrolling mode
        document.body.classList.add('credits-mode');
        
        this.switchScreen('creditsScreen');
        if (this.audioManager) {
            try {
                this.audioManager.playBackgroundMusic('menu');
            } catch (error) {
                console.error('Failed to start credits music:', error);
            }
        }
    }

    updateSettingsUI() {
        document.getElementById('musicToggle').checked = this.gameState.settings.musicEnabled;
        document.getElementById('sfxToggle').checked = this.gameState.settings.sfxEnabled;
        document.getElementById('voiceToggle').checked = this.gameState.settings.voiceEnabled;
        document.getElementById('volumeSlider').value = this.gameState.settings.masterVolume;
        document.getElementById('timerPaceSelect').value = this.gameState.settings.timerPace;
        document.getElementById('timerStyleSelect').value = this.gameState.settings.timerStyle;
        
        // Update language selector
        this.updateLanguageSelectorUI();
        
        // Update difficulty selector
        this.updateDifficultySelectorUI();
    }

    updateAchievementsUI() {
        const progressEntries = Object.entries(this.gameState.habitatProgress);
        const completedHabitats = progressEntries.filter(([, progress]) => progress.completed >= progress.total).length;
        const unlockedHabitats = progressEntries.filter(([, progress]) => progress.unlocked).length;
        const totalProblemsSolved = progressEntries.reduce((sum, [, progress]) => sum + progress.completed, 0);

        const badgeCountEl = document.getElementById('achievementBadgeCount');
        const completedHabitatsEl = document.getElementById('achievementCompletedHabitats');
        const unlockedHabitatsEl = document.getElementById('achievementUnlockedHabitats');
        const problemsSolvedEl = document.getElementById('achievementProblemsSolved');
        const penguinPairsProgressEl = document.getElementById('achievementPenguinPairsProgress');
        const habitatListEl = document.getElementById('achievementsHabitatList');
        const unlockedHabitatChipsEl = document.getElementById('achievementUnlockedHabitatChips');
        const starterHabitatsEl = document.getElementById('achievementStarterHabitats');

        if (badgeCountEl) {
            badgeCountEl.textContent = this.gameState.badgeCount;
        }
        if (completedHabitatsEl) {
            completedHabitatsEl.textContent = `${completedHabitats}/${progressEntries.length}`;
        }
        if (unlockedHabitatsEl) {
            unlockedHabitatsEl.textContent = `${unlockedHabitats}/${progressEntries.length}`;
        }
        if (problemsSolvedEl) {
            problemsSolvedEl.textContent = totalProblemsSolved;
        }
        if (penguinPairsProgressEl) {
            const penguinPairsProgress = this.gameState.habitatProgress.penguinPairsArctic;
            penguinPairsProgressEl.textContent = `${penguinPairsProgress.completed}/${penguinPairsProgress.total}`;
        }
        if (starterHabitatsEl) {
            const starterHabitats = ['bunnyMeadow', 'penguinPairsArctic']
                .map((habitatName) => this.getHabitatDisplayName(habitatName))
                .join(' and ');
            starterHabitatsEl.textContent = `Starter habitats: ${starterHabitats}.`;
        }
        if (unlockedHabitatChipsEl) {
            const unlockedNames = progressEntries
                .filter(([, progress]) => progress.unlocked)
                .map(([habitatName]) => this.getHabitatDisplayName(habitatName));

            unlockedHabitatChipsEl.innerHTML = unlockedNames
                .map((habitatName) => `<span class="achievement-unlocked-chip">${habitatName}</span>`)
                .join('');
        }

        if (habitatListEl) {
            habitatListEl.innerHTML = progressEntries.map(([habitatName, progress]) => {
                const percentage = Math.round((progress.completed / progress.total) * 100);
                const status = progress.completed >= progress.total
                    ? 'Completed'
                    : progress.unlocked
                        ? 'In Progress'
                        : 'Locked';

                return `
                    <div class="achievement-habitat-item ${progress.unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-habitat-header">
                            <div class="achievement-habitat-title">
                                <div class="achievement-habitat-name-row">
                                    <span class="achievement-habitat-icon">${this.getHabitatAchievementIcon(habitatName)}</span>
                                    <span class="achievement-habitat-name">${this.getHabitatDisplayName(habitatName)}</span>
                                </div>
                                <span class="achievement-habitat-subtitle">${this.getHabitatAchievementSubtitle(habitatName)}</span>
                            </div>
                            <span class="achievement-habitat-status">${status}</span>
                        </div>
                        <div class="achievement-habitat-progress">
                            <div class="achievement-habitat-progress-bar">
                                <div class="achievement-habitat-progress-fill" style="width: ${progress.unlocked ? percentage : 0}%"></div>
                            </div>
                            <span class="achievement-habitat-count">${progress.completed}/${progress.total}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    startGame() {
        this.showHabitatSelection();
    }

    showHabitatSelection() {
        try {
            // Cleanup any current habitat
            this.cleanupCurrentHabitat();
        } catch (error) {
            console.error('Failed to clean up current habitat before showing habitat selection:', error);
        }

        this.isGamePaused = false;
        this.hidePauseOverlay();

        document.body.classList.remove('credits-mode');
        this.switchScreen('habitatSelect');
        this.updateLeoHomeMessage('habitatSelect');

        try {
            this.updateHabitatCards();
        } catch (error) {
            console.error('Failed to update habitat cards:', error);
        }

        if (this.audioManager) {
            try {
                this.audioManager.playBackgroundMusic('habitat-selection');
            } catch (error) {
                console.error('Failed to start habitat selection music:', error);
            }
        }
        
        // Enable scrolling for mobile habitat selection
        document.body.classList.add('habitat-select-mode');
    }

    updateHabitatCards() {
        const habitatCards = document.querySelectorAll('.habitat-card');
        habitatCards.forEach(card => {
            const habitat = card.dataset.habitat;
            const progress = this.gameState.habitatProgress[habitat];

            if (!progress) {
                console.warn(`No habitat progress found for ${habitat}`);
                return;
            }
            
            if (progress.unlocked) {
                card.classList.remove('locked');
                card.classList.add('unlocked');
                
                // Hide lock overlay for unlocked habitats
                const lockOverlay = card.querySelector('.lock-overlay');
                if (lockOverlay) {
                    lockOverlay.style.display = 'none';
                }
                
                // Update progress bar
                const progressFill = card.querySelector('.progress-fill');
                if (progressFill) {
                    const percentage = (progress.completed / progress.total) * 100;
                    progressFill.style.width = `${percentage}%`;
                }
            } else {
                card.classList.remove('unlocked');
                card.classList.add('locked');
                
                // Show lock overlay for locked habitats
                const lockOverlay = card.querySelector('.lock-overlay');
                if (lockOverlay) {
                    lockOverlay.style.display = 'block';
                }
            }
        });
    }

    enterHabitat(habitatName) {
        console.log(`GameController: Entering habitat ${habitatName}`);
        
        try {
            // Cleanup previous habitat first
            this.cleanupCurrentHabitat();
            
            // Remove scrolling modes
            document.body.classList.remove('habitat-select-mode', 'credits-mode');
            
            this.gameState.currentHabitat = habitatName;
            this.switchScreen('gameScreen');
            this.updateGameUI();
            
            // Initialize habitat directly
            this.initializeHabitat(habitatName);
            
        } catch (error) {
            console.error(`Error entering habitat ${habitatName}:`, error);
            this.handleHabitatLoadingError(habitatName, error);
        }
    }
    
    initializeHabitat(habitatName) {
        try {
            console.log(`GameController: Initializing habitat ${habitatName}`);
            
            // Validate that required managers are ready
            if (!this.gameEngine) {
                throw new Error('GameEngine not available');
            }
            if (!this.mathEngine) {
                throw new Error('MathEngine not available');
            }
            
            // Initialize habitat with error handling
            let habitatClass = this.getHabitatClass(habitatName);
            if (!habitatClass) {
                throw new Error(`Habitat class not found for ${habitatName}`);
            }
            
            // Create habitat instance
            this.currentHabitat = new habitatClass(this.gameEngine, this.mathEngine, this);
            
            // Validate habitat was created successfully
            if (!this.currentHabitat) {
                throw new Error(`Failed to create habitat instance for ${habitatName}`);
            }
            
            // Set audio manager if available
            if (this.currentHabitat.setAudioManager && this.audioManager) {
                this.currentHabitat.setAudioManager(this.audioManager);
            }

            this.syncCurrentHabitatProgress();
            
            // Finalize habitat entry
            this.finalizeHabitatEntry(habitatName);
            
        } catch (error) {
            console.error(`Error initializing habitat ${habitatName}:`, error);
            this.handleHabitatLoadingError(habitatName, error);
        }
    }
    
    getHabitatClass(habitatName) {
        const habitatClasses = {
            'bunnyMeadow': BunnyMeadow,
            'penguinPairsArctic': PenguinPairsArctic,
            'penguinArctic': PenguinArctic,
            'elephantSavanna': ElephantSavanna,
            'monkeyJungle': MonkeyJungle,
            'lionPride': LionPride,
            'dolphinCove': DolphinCove,
            'bearForest': BearForest,
            'giraffePlains': GiraffePlains,
            'owlObservatory': OwlObservatory,
            'dragonSanctuary': DragonSanctuary,
            'earthwormSoil': EarthwormSoil,
            'caterpillarNursery': CaterpillarNursery,
            'butterflyVivarium': ButterflyVivarium,
            'frogPond': FrogPond,
            'rainbowReserve': RainbowReserve,
            'chickIncubator': ChickIncubator
        };
        
        return habitatClasses[habitatName];
    }
    
    getHabitatDisplayName(habitatName) {
        const habitatNames = {
            bunnyMeadow: 'Bunny Meadow',
            penguinPairsArctic: 'Penguin Pairs Arctic',
            penguinArctic: 'Penguin Arctic',
            elephantSavanna: 'Elephant Savanna',
            monkeyJungle: 'Monkey Jungle',
            lionPride: 'Lion Pride Lands',
            dolphinCove: 'Dolphin Cove',
            bearForest: 'Bear Forest',
            giraffePlains: 'Giraffe Plains',
            owlObservatory: 'Owl Observatory',
            dragonSanctuary: 'Dragon Sanctuary',
            earthwormSoil: 'Earthworm Soil',
            caterpillarNursery: 'Caterpillar Nursery',
            butterflyVivarium: 'Butterfly Vivarium',
            frogPond: 'Frog Pond',
            rainbowReserve: 'Rainbow Reserve',
            chickIncubator: 'Chick Incubator'
        };
        
        return habitatNames[habitatName] || 'Unknown Habitat';
    }

    getHabitatAchievementSubtitle(habitatName) {
        const subtitles = {
            bunnyMeadow: 'Addition & Subtraction',
            penguinPairsArctic: 'Doubles (2x Tables)',
            penguinArctic: 'Multiplication & Simple Division',
            elephantSavanna: 'Division & Multiplication',
            monkeyJungle: 'Fractions & Mixed Operations',
            lionPride: 'Equations & Word Problems',
            dolphinCove: 'Decimals & Measurement',
            bearForest: 'Mixed Operations',
            giraffePlains: 'Measurement & Geometry',
            owlObservatory: 'Advanced Multiplication & Patterns',
            dragonSanctuary: 'Exponents & Advanced Equations',
            earthwormSoil: 'Cube Roots',
            caterpillarNursery: 'Square Roots',
            butterflyVivarium: 'Squaring',
            frogPond: 'Cubing',
            rainbowReserve: 'Ultimate Challenge',
            chickIncubator: 'Powers of Ten'
        };

        return subtitles[habitatName] || 'Habitat Progress';
    }

    getHabitatAchievementIcon(habitatName) {
        const icons = {
            bunnyMeadow: '🐰',
            penguinPairsArctic: '🐧🐧',
            penguinArctic: '🐧',
            elephantSavanna: '🐘',
            monkeyJungle: '🐵',
            lionPride: '🦁',
            dolphinCove: '🐬',
            bearForest: '🐻',
            giraffePlains: '🦒',
            owlObservatory: '🦉',
            dragonSanctuary: '🐉',
            earthwormSoil: '🪱',
            caterpillarNursery: '🐛',
            butterflyVivarium: '🦋',
            frogPond: '🐸',
            rainbowReserve: '🌈',
            chickIncubator: '🐥'
        };

        return icons[habitatName] || '⭐';
    }

    syncCurrentHabitatProgress() {
        const habitatName = this.gameState.currentHabitat;
        const savedProgress = habitatName && this.gameState.habitatProgress[habitatName]
            ? this.gameState.habitatProgress[habitatName]
            : null;

        if (!this.currentHabitat || !savedProgress) {
            return;
        }

        const completed = Number.isFinite(Number(savedProgress.completed))
            ? Math.max(0, Math.min(Number(savedProgress.completed), this.currentHabitat.totalProblems || Number(savedProgress.completed)))
            : 0;

        this.currentHabitat.problemsSolved = completed;

        if (this.currentHabitat.updateProgressIndicator) {
            this.currentHabitat.updateProgressIndicator();
        }

        if (completed > 0 && this.currentHabitat.startNextProblem) {
            this.currentHabitat.startNextProblem();
        }
    }
    
    finalizeHabitatEntry(habitatName) {
        try {
            console.log(`GameController: Finalizing habitat entry for ${habitatName}`);
            this.hidePauseOverlay();
            this.isGamePaused = false;
            this.applyTimerSettings();
            
            // Start timer for the level
            if (this.timerManager) {
                this.timerManager.startTimer(habitatName);
            }
            
            // Start background music
            if (this.audioManager) {
                this.audioManager.playBackgroundMusic(habitatName);
            }
            
            // Start the game engine
            if (this.gameEngine) {
                this.gameEngine.startGame();
            }
            
            console.log(`GameController: Habitat ${habitatName} loaded successfully`);
            
        } catch (error) {
            console.error(`Error finalizing habitat entry for ${habitatName}:`, error);
            this.handleHabitatLoadingError(habitatName, error);
        }
    }
    
    
    handleHabitatLoadingError(habitatName, error) {
        console.error(`Failed to load habitat ${habitatName}:`, error);
        
        // Show error message to user
        const mathProblem = document.getElementById('mathProblem');
        if (mathProblem) {
            mathProblem.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: 'Comic Sans MS', cursive;">
                    <div style="font-size: 24px; color: #FF6B6B; margin-bottom: 20px;">
                        Oops! ${this.getHabitatDisplayName(habitatName)} is having trouble loading.
                    </div>
                    <div style="font-size: 18px; color: #666; margin-bottom: 30px;">
                        Don't worry, let's try again!
                    </div>
                    <button id="retryHabitatBtn" style="
                        background: #4ECDC4;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        font-size: 16px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-family: inherit;
                        margin-right: 10px;
                    ">Try Again</button>
                    <button id="backToHabitatsFromError" style="
                        background: #95A5A6;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        font-size: 16px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-family: inherit;
                    ">Back to Habitats</button>
                </div>
            `;
            mathProblem.classList.remove('hidden');
            
            // Add event listeners for error buttons
            const retryBtn = document.getElementById('retryHabitatBtn');
            const backBtn = document.getElementById('backToHabitatsFromError');
            
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    this.enterHabitat(habitatName);
                });
            }
            
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    this.showHabitatSelection();
                });
            }
        }
        
        // Clean up any partially initialized habitat
        this.cleanupCurrentHabitat();
    }

    updateGameUI() {
        document.getElementById('playerName').textContent = this.gameState.playerName;
        document.getElementById('badgeCount').textContent = `🏆 ${this.gameState.badgeCount}`;
        
        // Update habitat name display
        const habitatNames = {
            bunnyMeadow: 'Bunny Meadow',
            penguinPairsArctic: 'Penguin Pairs Arctic',
            penguinArctic: 'Penguin Arctic',
            elephantSavanna: 'Elephant Savanna',
            monkeyJungle: 'Monkey Jungle',
            lionPride: 'Lion Pride Lands',
            dolphinCove: 'Dolphin Cove',
            bearForest: 'Bear Forest',
            giraffePlains: 'Giraffe Plains',
            owlObservatory: 'Owl Observatory',
            dragonSanctuary: 'Dragon Sanctuary',
            earthwormSoil: 'Earthworm Soil',
            caterpillarNursery: 'Caterpillar Nursery',
            butterflyVivarium: 'Butterfly Vivarium',
            frogPond: 'Frog Pond',
            rainbowReserve: 'Rainbow Reserve',
            chickIncubator: 'Chick Incubator'
        };
        
        document.getElementById('currentHabitat').textContent = 
            habitatNames[this.gameState.currentHabitat] || 'Unknown Habitat';
    }

    pauseGame() {
        if (this.currentScreen !== 'gameScreen') {
            return;
        }
        this.isGamePaused = true;
        this.gameEngine.pauseGame();
        this.audioManager.pauseAll();
        this.timerManager.pauseTimer();
        this.showPauseOverlay();
    }

    resumeGame() {
        if (!this.isGamePaused || this.currentScreen !== 'gameScreen') {
            return;
        }

        this.isGamePaused = false;
        this.hidePauseOverlay();
        if (this.gameEngine) {
            this.gameEngine.resumeGame();
        }
        if (this.audioManager && this.gameState.currentHabitat) {
            this.audioManager.playBackgroundMusic(this.gameState.currentHabitat);
        }
        if (this.timerManager) {
            this.timerManager.resumeTimer();
        }
    }

    showPauseOverlay() {
        const pauseOverlay = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.classList.remove('hidden');
        }
    }

    hidePauseOverlay() {
        const pauseOverlay = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.classList.add('hidden');
        }
    }

    showGameSettings() {
        this.pauseGame();
        this.showSettings();
    }

    getActiveProblem() {
        if (this.currentHabitat && this.currentHabitat.currentProblem) {
            return this.currentHabitat.currentProblem;
        }

        if (this.mathEngine && this.mathEngine.getCurrentProblem) {
            return this.mathEngine.getCurrentProblem();
        }

        return null;
    }

    selectAnswer(optionNumber) {
        if (this.isGamePaused) {
            return;
        }

        // Prevent selection during submission
        if (this.isSubmittingAnswer) {
            console.log('GameController: Answer submission already in progress, ignoring selection');
            return;
        }
        
        // Visual feedback
        this.highlightSelectedOption(optionNumber);
        
        // Get the selected answer value
        const currentProblem = this.getActiveProblem();
        if (!currentProblem || !currentProblem.options) {
            console.error('GameController: No current problem or options available');
            return;
        }
        
        const selectedAnswer = currentProblem.options[optionNumber - 1];
        console.log(`GameController: Selected option ${optionNumber} with value ${selectedAnswer}`);
        
        // Submit the answer
        this.submitSelectedAnswer(selectedAnswer);
    }

    highlightSelectedOption(optionNumber) {
        // Remove previous selections
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Highlight selected option
        const selectedOption = document.getElementById(`option${optionNumber}`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }

    submitSelectedAnswer(selectedAnswer) {
        // Prevent double submission race condition
        if (this.isSubmittingAnswer) {
            console.log('GameController: Answer submission already in progress, ignoring duplicate call');
            return;
        }
        
        this.isSubmittingAnswer = true;
        console.log('GameController: Setting isSubmittingAnswer to true');
        console.log(`GameController: Submitting selected answer ${selectedAnswer}`);

        try {
            // Let the habitat handle the answer checking
            if (this.currentHabitat && this.currentHabitat.checkAnswer) {
                const isCorrect = this.currentHabitat.checkAnswer(selectedAnswer);
                const feedbackMessage = isCorrect ?
                    this.languageManager.translate('feedback.correct') :
                    this.languageManager.translate('feedback.incorrect');
                this.showFeedback(feedbackMessage, isCorrect);

                // Visual feedback on options
                this.showAnswerFeedback(selectedAnswer, isCorrect);
            } else {
                // Fallback to mathEngine for habitats that don't have checkAnswer
                const isCorrect = this.mathEngine.checkAnswer(selectedAnswer);
                const feedbackMessage = isCorrect ?
                    this.languageManager.translate('feedback.correct') :
                    this.languageManager.translate('feedback.incorrect');
                this.showFeedback(feedbackMessage, isCorrect);

                // Visual feedback on options
                this.showAnswerFeedback(selectedAnswer, isCorrect);

                if (isCorrect) {
                    this.audioManager.playSFX('correct');
                    this.updateProgress();
                } else {
                    this.audioManager.playSFX('incorrect');
                }
            }
        } catch (error) {
            console.error('GameController: Answer submission failed:', error);
            this.showTemporaryMessage('Answer check failed. Please try again.');
        } finally {
            // Reset flag after processing, with a small delay to prevent rapid re-submission
            setTimeout(() => {
                this.isSubmittingAnswer = false;
                console.log('GameController: Reset isSubmittingAnswer to false (after timeout)');
            }, 100);
        }
    }

    showAnswerFeedback(selectedAnswer, isCorrect) {
        const currentProblem = this.getActiveProblem();
        if (!currentProblem || !currentProblem.options) return;
        
        const correctAnswer = currentProblem.answer;
        
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            const optionValue = currentProblem.options[index];
            
            if (optionValue === correctAnswer) {
                option.classList.add('correct');
            } else if (optionValue === selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
    }

    showFeedback(message, isCorrect) {
        const feedback = document.getElementById('feedback');
        const feedbackText = document.getElementById('feedbackText');
        const leoAdvice = document.getElementById('leoAdvice');
        
        feedbackText.textContent = message;
        feedback.className = isCorrect ? 'correct' : 'incorrect';
        feedback.classList.remove('hidden');

        if (leoAdvice) {
            if (isCorrect) {
                leoAdvice.classList.add('hidden');
                leoAdvice.textContent = '';
            } else {
                leoAdvice.textContent = this.getLeoAdvice();
                leoAdvice.classList.remove('hidden');
            }
        }
        
        // Add animation
        feedback.classList.add(isCorrect ? 'correct-feedback' : 'incorrect-feedback');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            feedback.classList.remove('correct-feedback', 'incorrect-feedback');
        }, 800);
    }

    showLeoHelp() {
        const currentProblem = this.getActiveProblem();
        const leoAdvice = document.getElementById('leoAdvice');

        if (!currentProblem || !leoAdvice) {
            this.showTemporaryMessage(this.translate('leo.help.ready', 'Leo is ready to help when a problem appears.'));
            return;
        }

        leoAdvice.textContent = this.getLeoAdvice();
        leoAdvice.classList.remove('hidden');

        if (this.audioManager) {
            this.audioManager.playVoice('encouragement');
        }
    }

    nextProblem() {
        const feedback = document.getElementById('feedback');
        const leoAdvice = document.getElementById('leoAdvice');
        
        feedback.classList.add('hidden');
        if (leoAdvice) {
            leoAdvice.classList.add('hidden');
            leoAdvice.textContent = '';
        }
        
        // Reset all answer options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Let the habitat handle the next problem generation
        if (this.currentHabitat && this.currentHabitat.onContinueButtonClicked) {
            this.currentHabitat.onContinueButtonClicked();
        } else {
            console.log('GameController: Continue button clicked, but habitat does not handle it');
        }
    }

    updateProblemUI() {
        const problem = this.getActiveProblem();
        if (!problem) {
            return;
        }

        document.getElementById('problemTitle').textContent = problem.title;
        
        // Use innerHTML with highlighted numbers for problem text
        const problemTextElement = document.getElementById('problemText');
        if (problemTextElement) {
            const highlightedText = this.mathEngine.highlightNumbers(problem.text);
            problemTextElement.innerHTML = highlightedText;
        }
        
        // Update answer options
        this.updateAnswerOptions();
        
        // Update visual representation
        this.updateProblemVisual(problem);
    }

    updateAnswerOptions() {
        const currentProblem = this.getActiveProblem();
        if (!currentProblem || !currentProblem.options) return;
        
        currentProblem.options.forEach((option, index) => {
            const optionButton = document.getElementById(`option${index + 1}`);
            if (optionButton) {
                const optionText = optionButton.querySelector('.option-text');
                if (optionText) {
                    optionText.textContent = option;
                }
                
                // Reset visual state
                optionButton.classList.remove('selected', 'correct', 'incorrect');
            }
        });
    }

    updateProblemVisual(problem) {
        const visual = document.getElementById('problemVisual');
        visual.innerHTML = '';
        
        // Create visual representation based on problem type
        if (problem.visual) {
            problem.visual.forEach((item, index) => {
                const element = document.createElement('div');
                element.className = 'math-visual-item';
                element.textContent = item;
                element.style.animationDelay = `${index * 0.1}s`;
                visual.appendChild(element);
            });
        }
    }

    updateProgress() {
        const habitat = this.gameState.currentHabitat;
        this.gameState.habitatProgress[habitat].completed++;
        
        // Check if habitat is completed
        const progress = this.gameState.habitatProgress[habitat];
        if (progress.completed >= progress.total) {
            this.completeHabitat(habitat);
        }
        
        this.saveGameState();
    }

    completeHabitat(habitat) {
        // Stop timer first
        this.timerManager.stopTimer();
        
        // Award badge
        this.gameState.badgeCount++;
        this.audioManager.playSFX('badge-earned');
        
        // Unlock next habitat
        this.unlockNextHabitat(habitat);
        
        // Save progress
        this.saveGameState();
        
        // Show completion celebration
        this.showHabitatCompletion(habitat);
    }

    unlockNextHabitat(currentHabitat) {
        const habitatOrder = [
            'bunnyMeadow', 'penguinPairsArctic', 'penguinArctic', 'elephantSavanna', 'monkeyJungle',
            'lionPride', 'dolphinCove', 'bearForest', 'giraffePlains',
            'owlObservatory', 'dragonSanctuary', 'earthwormSoil', 'caterpillarNursery', 'butterflyVivarium', 'frogPond', 'rainbowReserve', 'chickIncubator'
        ];
        
        const currentIndex = habitatOrder.indexOf(currentHabitat);
        if (currentIndex >= 0 && currentIndex < habitatOrder.length - 1) {
            const nextHabitat = habitatOrder[currentIndex + 1];
            this.gameState.habitatProgress[nextHabitat].unlocked = true;
        }
    }

    showHabitatCompletion(habitat) {
        // Prevent multiple overlays from being created
        const existingOverlay = document.getElementById('completionOverlay');
        if (existingOverlay) {
            console.log('Completion overlay already exists, removing it first');
            existingOverlay.remove();
        }
        
        // Hide math problem UI
        const mathProblem = document.getElementById('mathProblem');
        if (mathProblem) {
            mathProblem.classList.add('hidden');
        }
        
        // Get habitat display name
        const habitatNames = {
            bunnyMeadow: 'Bunny Meadow',
            penguinPairsArctic: 'Penguin Pairs Arctic',
            penguinArctic: 'Penguin Arctic',
            elephantSavanna: 'Elephant Savanna',
            monkeyJungle: 'Monkey Jungle',
            lionPride: 'Lion Pride Lands',
            dolphinCove: 'Dolphin Cove',
            bearForest: 'Bear Forest',
            giraffePlains: 'Giraffe Plains',
            owlObservatory: 'Owl Observatory',
            dragonSanctuary: 'Dragon Sanctuary',
            earthwormSoil: 'Earthworm Soil',
            caterpillarNursery: 'Caterpillar Nursery',
            butterflyVivarium: 'Butterfly Vivarium',
            frogPond: 'Frog Pond',
            rainbowReserve: 'Rainbow Reserve',
            chickIncubator: 'Chick Incubator'
        };
        
        const habitatName = habitatNames[habitat] || 'Unknown Habitat';
        
        // Create completion overlay
        const completionOverlay = document.createElement('div');
        completionOverlay.id = 'completionOverlay';
        completionOverlay.className = 'completion-overlay';
        completionOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s ease;
            cursor: pointer;
        `;
        
        // Create completion content
        const completionContent = document.createElement('div');
        completionContent.className = 'completion-content';
        completionContent.style.cssText = `
            text-align: center;
            color: white;
            transform: scale(0.8);
            transition: transform 0.5s ease;
            cursor: default;
        `;
        
        // Check if next habitat was unlocked
        const nextHabitat = this.getNextHabitat(habitat);
        const nextHabitatName = nextHabitat ? habitatNames[nextHabitat] : null;
        
        completionContent.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px; color: #FFD700;">🎉</div>
            <h1 style="font-size: 36px; margin-bottom: 10px; color: #FFD700;">Mission Complete!</h1>
            <h2 style="font-size: 24px; margin-bottom: 20px; color: #4ECDC4;">${habitatName}</h2>
            <div style="font-size: 20px; margin-bottom: 30px;">
                <div style="margin-bottom: 10px;">🏆 Badge Earned! Total: ${this.gameState.badgeCount}</div>
                ${nextHabitatName ? `<div style="color: #90EE90;">🔓 ${nextHabitatName} Unlocked!</div>` : ''}
            </div>
            <button id="continueToHabitats" style="
                background: #4ECDC4;
                color: white;
                border: none;
                padding: 15px 30px;
                font-size: 18px;
                border-radius: 25px;
                cursor: pointer;
                transition: background 0.3s ease;
                font-family: inherit;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 2px solid transparent;
            ">Continue to Habitats</button>
            <div style="margin-top: 15px; font-size: 14px; opacity: 0.7;">
                Click anywhere to continue
            </div>
        `;
        
        completionOverlay.appendChild(completionContent);
        document.body.appendChild(completionOverlay);
        
        // Create the completion handler function
        const handleCompletion = (source = 'unknown') => {
            console.log(`Completion triggered by: ${source}`);
            try {
                this.hideCompletionOverlay();
                this.cleanupCurrentHabitat();
                this.showHabitatSelection();
            } catch (error) {
                console.error('Error in completion handler:', error);
                // Fallback: force navigation to habitat selection
                this.showHabitatSelection();
            }
        };
        
        // Animate in
        setTimeout(() => {
            completionOverlay.style.opacity = '1';
            completionContent.style.transform = 'scale(1)';
        }, 100);
        
        // Add multiple ways to close the overlay for maximum reliability
        
        // 1. Click anywhere on overlay (but prevent event bubbling on content)
        completionOverlay.addEventListener('click', (e) => {
            if (e.target === completionOverlay) {
                handleCompletion('overlay-click');
            }
        });
        
        // 2. Button click
        const continueBtn = document.getElementById('continueToHabitats');
        if (continueBtn) {
            continueBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleCompletion('button-click');
            });
            
            // Make button more visible when focused
            continueBtn.addEventListener('mouseenter', () => {
                continueBtn.style.background = '#3DBDAE';
                continueBtn.style.transform = 'scale(1.05)';
            });
            
            continueBtn.addEventListener('mouseleave', () => {
                continueBtn.style.background = '#4ECDC4';
                continueBtn.style.transform = 'scale(1)';
            });
            
            // Focus the button
            continueBtn.tabIndex = 0;
            continueBtn.focus();
        }
        
        // 3. Keyboard support (any key)
        const keyHandler = (e) => {
            console.log('Key pressed in completion overlay:', e.key);
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                e.preventDefault();
                document.removeEventListener('keydown', keyHandler);
                handleCompletion('keyboard');
            }
        };
        document.addEventListener('keydown', keyHandler);
        
        // 4. Auto-continue after 3 seconds (reduced from 5)
        const autoCompleteTimer = setTimeout(() => {
            const overlay = document.getElementById('completionOverlay');
            if (overlay && overlay.parentNode) {
                console.log('Auto-completing after 3 seconds');
                document.removeEventListener('keydown', keyHandler);
                handleCompletion('auto-timeout');
            }
        }, 3000);
        
        // Store timer reference for cleanup
        completionOverlay.autoCompleteTimer = autoCompleteTimer;
    }

    getNextHabitat(currentHabitat) {
        const habitatOrder = [
            'bunnyMeadow', 'penguinPairsArctic', 'penguinArctic', 'elephantSavanna', 'monkeyJungle',
            'lionPride', 'dolphinCove', 'bearForest', 'giraffePlains',
            'owlObservatory', 'dragonSanctuary', 'earthwormSoil', 'caterpillarNursery', 'butterflyVivarium', 'frogPond', 'rainbowReserve', 'chickIncubator'
        ];
        
        const currentIndex = habitatOrder.indexOf(currentHabitat);
        if (currentIndex >= 0 && currentIndex < habitatOrder.length - 1) {
            return habitatOrder[currentIndex + 1];
        }
        return null;
    }

    hideCompletionOverlay() {
        const overlay = document.getElementById('completionOverlay');
        if (overlay) {
            console.log('Hiding completion overlay');
            
            // Clear any timers
            if (overlay.autoCompleteTimer) {
                clearTimeout(overlay.autoCompleteTimer);
                overlay.autoCompleteTimer = null;
            }
            
            // Remove all event listeners by cloning and replacing the overlay
            // This prevents any lingering event handlers
            const newOverlay = overlay.cloneNode(true);
            overlay.parentNode.replaceChild(newOverlay, overlay);
            
            // Fade out and remove
            newOverlay.style.opacity = '0';
            newOverlay.style.pointerEvents = 'none';
            
            setTimeout(() => {
                try {
                    if (newOverlay && newOverlay.parentNode) {
                        newOverlay.parentNode.removeChild(newOverlay);
                        console.log('Completion overlay removed from DOM');
                    }
                } catch (error) {
                    console.error('Error removing completion overlay:', error);
                }
            }, 500);
        } else {
            console.log('No completion overlay to hide');
        }
        
        // Also clean up any lingering overlays that might exist
        const allOverlays = document.querySelectorAll('.completion-overlay');
        allOverlays.forEach((overlay, index) => {
            console.log(`Removing lingering overlay ${index + 1}`);
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
    }

    switchScreen(screenName) {
        // Hide current screen
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show new screen
        const nextScreen = document.getElementById(screenName);
        if (!nextScreen) {
            console.error(`Screen not found: ${screenName}`);
            return;
        }

        nextScreen.classList.add('active');
        this.currentScreen = screenName;
    }

    initializeLeoMascot() {
        this.updateLeoHomeMessage('loadingScreen');
        this.updateLeoHomeMessage('mainMenu');
        this.updateLeoHomeMessage('habitatSelect');
    }

    showLoadingChoice() {
        const choice = document.querySelector('.loading-choice');
        const status = document.getElementById('loadingStatus');
        const quickStartBtn = document.getElementById('quickStartBtn');
        const statusText = document.getElementById('loadingStatusText');
        const spinner = document.getElementById('loadingSpinner');

        if (choice) {
            choice.classList.remove('hidden');
        }
        if (status) {
            status.classList.add('hidden');
        }
        if (quickStartBtn) {
            quickStartBtn.classList.add('hidden');
        }
        if (statusText) {
            statusText.textContent = 'Loading your animal adventure...';
        }
        if (spinner) {
            spinner.classList.remove('hidden');
        }

        this.rememberOpeningScreenState('choice');
    }

    showLoadingStatus(mode) {
        const choice = document.querySelector('.loading-choice');
        const status = document.getElementById('loadingStatus');
        const quickStartBtn = document.getElementById('quickStartBtn');
        const statusText = document.getElementById('loadingStatusText');
        const spinner = document.getElementById('loadingSpinner');

        if (choice) {
            choice.classList.add('hidden');
        }
        if (status) {
            status.classList.remove('hidden');
        }

        if (mode === 'quick') {
            if (statusText) {
                statusText.textContent = 'Ready to start right away?';
            }
            if (quickStartBtn) {
                quickStartBtn.classList.remove('hidden');
            }
            if (spinner) {
                spinner.classList.add('hidden');
            }
            this.rememberOpeningScreenState('quick');
            return;
        }

        if (statusText) {
            statusText.textContent = 'Loading your animal adventure...';
        }
        if (quickStartBtn) {
            quickStartBtn.classList.add('hidden');
        }
        if (spinner) {
            spinner.classList.remove('hidden');
        }

        this.rememberOpeningScreenState('loading');
    }

    rememberOpeningScreenState(state) {
        try {
            localStorage.setItem('openingScreenState', state);
        } catch (error) {
            console.warn('Could not save opening screen state:', error);
        }
    }

    restoreOpeningScreenState() {
        try {
            const savedState = localStorage.getItem('openingScreenState');
            if (savedState === 'quick') {
                this.showLoadingStatus('quick');
            } else if (savedState === 'loading') {
                this.showLoadingStatus('loading');
                if (!this.initialMenuTransitionScheduled) {
                    this.scheduleInitialMenuTransition();
                }
            } else {
                this.showLoadingChoice();
            }
        } catch (error) {
            console.warn('Could not restore opening screen state:', error);
            this.showLoadingChoice();
        }
    }

    clearOpeningScreenState() {
        try {
            localStorage.removeItem('openingScreenState');
        } catch (error) {
            console.warn('Could not clear opening screen state:', error);
        }
    }

    updateLeoHomeMessage(screenName) {
        const mascot = document.querySelector(`.leo-mascot[data-leo-context="${screenName}"]`);
        if (!mascot) return;

        const message = mascot.querySelector('.leo-message');
        if (message) {
            message.textContent = this.getLeoHomeMessage(screenName);
        }
    }

    getLeoHomeMessage(screenName) {
        const translationKeys = {
            loadingScreen: 'leo.home.loading',
            mainMenu: 'leo.home.main_menu',
            habitatSelect: 'leo.home.habitat_select'
        };
        const fallbacks = {
            loadingScreen: '" Hi, I\'m Leo. I\'m getting your animal adventure ready! "',
            mainMenu: '" Hi, I\'m Leo! I\'ll wave hello and help with tricky questions. "',
            habitatSelect: '" Pick a habitat, and if a question feels tricky, I\'ll help you break it down. "'
        };

        return this.translate(translationKeys[screenName], fallbacks[screenName] || '');
    }

    getLeoAdvice() {
        const problem = this.getActiveProblem();
        const hint = this.getLeoAdviceHint(problem);
        const starter = this.translate('leo.help.starter', 'Leo says');
        return `${starter}: ${hint}`;
    }

    getLeoAdviceHint(problem) {
        if (!problem) {
            return this.translate('leo.help.ready', 'Leo is ready to help when a problem appears.');
        }

        if (!this.leoHintIndexes) {
            this.leoHintIndexes = {};
        }

        const hints = this.getLeoAdviceOptions(problem);
        if (!hints.length) {
            return this.mathEngine && this.mathEngine.getHint
                ? this.mathEngine.getHint()
                : 'Take it one step at a time.';
        }

        const hintKey = problem.type || 'default';
        const nextIndex = this.leoHintIndexes[hintKey] || 0;
        const hint = hints[nextIndex % hints.length];
        this.leoHintIndexes[hintKey] = nextIndex + 1;
        return hint;
    }

    getLeoAdviceOptions(problem) {
        const fallbackHint = this.mathEngine && this.mathEngine.getHint
            ? this.mathEngine.getHint()
            : 'Take it one step at a time.';
        const numbers = Array.isArray(problem?.operation?.match(/\d+/g))
            ? problem.operation.match(/\d+/g).map(Number)
            : [];
        const first = numbers[0];
        const second = numbers[1];
        const baseNumber = problem?.baseNumber;

        const adviceByType = {
            addition: [
                fallbackHint,
                'Start with the bigger number, then count on the smaller one.',
                'Break the second number into smaller jumps if that feels easier.',
                'Use the picture and join the two groups instead of recounting from zero.'
            ],
            subtraction: [
                fallbackHint,
                'Start with the whole group, then count backwards by the number being taken away.',
                'Cover or cross out the items that leave, then count what is still there.',
                'Think of subtraction as finding how many stay, not how many disappear.'
            ],
            doubles: [
                fallbackHint,
                `If you know ${baseNumber || 'the number'} once, just add it again for the double.`,
                'Count by twos instead of counting every penguin one by one.',
                'Picture equal pairs: each pair adds 2 more.'
            ],
            doubles_word_problems: [
                fallbackHint,
                'Find the number of groups first, then give each group 2.',
                'When every group has 2, skip-count by twos to the total.',
                'You can add the group number to itself to get the same answer.'
            ],
            multiplication: [
                fallbackHint,
                'Think of multiplication as equal groups, not one giant count.',
                `Try repeated addition: ${first || 'one group'} added ${second || 'a few'} times.`,
                'Use rows or groups in the picture to keep your counting tidy.'
            ],
            division: [
                fallbackHint,
                'Share the total into equal groups one piece at a time.',
                'Ask yourself how many items belong in each group when everything is fair.',
                'You can check a division answer by multiplying back.'
            ],
            simple_division: [
                fallbackHint,
                'Split the total into equal groups and keep the groups balanced.',
                'Think: how many in each group so none are left over?',
                'Multiply your guess by the number of groups to check it.'
            ],
            fractions: [
                fallbackHint,
                'Look for the whole first, then split it into equal parts.',
                'The bottom number tells how many equal parts there are.',
                'The top number tells how many of those parts you need.'
            ],
            equations: [
                fallbackHint,
                'Treat the missing number like a box you need to figure out.',
                'Undo the operation step by step to isolate the unknown.',
                'Plug your answer back in to see if the equation becomes true.'
            ],
            decimals: [
                fallbackHint,
                'Line up place values carefully when you think about the numbers.',
                'Whole numbers and decimal parts should each make sense on their own.',
                'Estimate first so you know whether your answer feels reasonable.'
            ],
            measurement: [
                fallbackHint,
                'Notice the units first so you know what the answer is measuring.',
                'Draw or imagine the lengths, groups, or spaces in the problem.',
                'Estimate before calculating to catch answers that look too big or too small.'
            ],
            geometry: [
                fallbackHint,
                'Look at the shape properties before you calculate anything.',
                'Count sides, corners, or equal parts carefully.',
                'Sketching the shape in your head can make the numbers easier to use.'
            ],
            exponentials: [
                fallbackHint,
                'An exponent means repeated multiplication, not repeated addition.',
                'Square means multiply the number by itself once.',
                'Write out the repeated factors if the shortcut feels confusing.'
            ],
            mixed_operations: [
                fallbackHint,
                'Do one small step at a time so the whole problem feels easier.',
                'Remember the order of operations before combining everything.',
                'Rewrite the problem in smaller chunks if it looks crowded.'
            ],
            word_problems: [
                fallbackHint,
                'Find the important numbers and what the question is really asking.',
                'Turn the story into a math sentence before solving.',
                'Ignore extra words and focus on the action in the problem.'
            ],
            advanced_multiplication: [
                fallbackHint,
                'Break big multiplication into smaller facts you already know.',
                'Use place value to keep track of each part of the product.',
                'Estimate first so you know the answer range you expect.'
            ],
            patterns: [
                fallbackHint,
                'Look for what changes each time before guessing the next value.',
                'Check whether the pattern adds, subtracts, multiplies, or repeats.',
                'Say the rule out loud to see if it fits every term.'
            ],
            advanced_equations: [
                fallbackHint,
                'Undo the equation in the reverse order it was built.',
                'Keep the two sides balanced after every step.',
                'Substitute your answer back in to prove it works.'
            ],
            all_concepts: [
                fallbackHint,
                'Decide which math skill this question is testing before you start.',
                'Solve in stages instead of trying to do everything at once.',
                'Use estimation to make sure the final answer feels sensible.'
            ],
            challenge_problems: [
                fallbackHint,
                'This one is easier if you break it into smaller pieces first.',
                'Solve the safest part first, then build the rest around it.',
                'Check each step before moving on so small mistakes do not grow.'
            ]
        };

        return adviceByType[problem.type] || [fallbackHint];
    }

    translate(key, fallback = key) {
        if (this.languageManager && this.languageManager.translate) {
            return this.languageManager.translate(key);
        }

        return fallback;
    }

    saveGameState() {
        try {
            localStorage.setItem('timesTableAnimalsGame', JSON.stringify(this.gameState));
        } catch (error) {
            console.warn('Could not save game state:', error);
        }
    }

    loadGameState() {
        try {
            const savedState = localStorage.getItem('timesTableAnimalsGame');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.gameState = this.normalizeGameState(parsed);
            }
        } catch (error) {
            console.warn('Could not load game state:', error);
            this.gameState = this.createDefaultGameState();
        }
    }

    setupTimerCallbacks() {
        // Set up timer event callbacks
        this.timerManager.onTimeWarning = (timeRemaining) => {
            this.audioManager.playSFX('timer-warning');
            console.log(`Timer warning: ${timeRemaining} seconds remaining`);
        };

        this.timerManager.onTimeUp = (habitat) => {
            this.handleTimeUp(habitat);
        };

        this.timerManager.onTimerUpdate = (timeRemaining, percentage) => {
            // Timer UI is automatically updated by TimerManager
            // Can add additional logic here if needed
        };
    }

    handleTimeUp(habitat) {
        // Stop the game
        this.gameEngine.pauseGame();
        this.audioManager.pauseAll();
        this.audioManager.playSFX('catastrophic-event');
        
        // Show catastrophic overlay
        this.timerManager.showCatastrophicOverlay();
    }

    retryLevel() {
        // Reset and restart the current level
        const currentHabitat = this.gameState.currentHabitat;
        
        // Hide catastrophic overlay
        this.timerManager.hideCatastrophicOverlay();
        
        // Reset habitat progress for this attempt
        if (this.currentHabitat && this.currentHabitat.resetLevel) {
            this.currentHabitat.resetLevel();
        }
        
        // Restart timer
        this.timerManager.startTimer(currentHabitat);
        
        // Resume game
        this.gameEngine.resumeGame();
        this.audioManager.playBackgroundMusic(currentHabitat);
    }

    exitToHabitats() {
        // Stop timer
        this.timerManager.stopTimer();
        
        // Hide catastrophic overlay
        this.timerManager.hideCatastrophicOverlay();
        
        // Return to habitat selection
        this.showHabitatSelection();
    }

    completeLevel() {
        // Stop timer when level is completed successfully
        this.timerManager.stopTimer();
        
        // Continue with normal completion flow
        const habitat = this.gameState.currentHabitat;
        this.completeHabitat(habitat);
    }

    startTimerUpdateLoop() {
        console.log('GameController: Starting timer update loop');
        
        // Update timer every 100ms with error handling
        this.timerUpdateInterval = setInterval(() => {
            try {
                if (this.timerManager && this.timerManager.isTimerActive && this.timerManager.isTimerActive()) {
                    this.timerManager.update();
                }
            } catch (error) {
                console.error('Error in timer update loop:', error);
                // Don't stop the loop completely, just log the error
            }
        }, 100);
        
        // Also add a backup timer that runs less frequently for validation
        this.timerValidationInterval = setInterval(() => {
            try {
                if (this.timerManager && this.currentScreen === 'gameScreen') {
                    this.validateTimerState();
                }
            } catch (error) {
                console.error('Error in timer validation:', error);
            }
        }, 1000); // Every second
    }

    shouldTimerBeRunning() {
        if (!this.timerManager) return false;

        const completionOverlay = document.getElementById('completionOverlay');
        const completionOverlayVisible = completionOverlay && document.body.contains(completionOverlay);

        return this.currentScreen === 'gameScreen' &&
            Boolean(this.gameState.currentHabitat) &&
            !this.isGamePaused &&
            !completionOverlayVisible &&
            !this.timerManager.isCatastrophicEventActive();
    }
    
    validateTimerState() {
        if (!this.timerManager) return;
        
        // Check if timer should be active but isn't
        if (this.shouldTimerBeRunning() &&
            !this.timerManager.isTimerActive()) {
            
            console.warn('Timer should be active but isn\'t - attempting to restart');
            this.timerManager.startTimer(this.gameState.currentHabitat);
        }
        
        // Check if timer is active but shouldn't be
        if (!this.shouldTimerBeRunning() &&
            this.timerManager.isTimerActive()) {
            
            console.warn('Timer is active but shouldn\'t be - stopping timer');
            this.timerManager.stopTimer();
        }
    }
    
    stopTimerUpdateLoop() {
        if (this.timerUpdateInterval) {
            clearInterval(this.timerUpdateInterval);
            this.timerUpdateInterval = null;
            console.log('Timer update loop stopped');
        }
        
        if (this.timerValidationInterval) {
            clearInterval(this.timerValidationInterval);
            this.timerValidationInterval = null;
            console.log('Timer validation loop stopped');
        }
    }

    restartCurrentHabitat() {
        // Method called by TimerManager when user clicks "Try Again"
        const habitatName = this.gameState.currentHabitat;
        if (habitatName) {
            this.enterHabitat(habitatName);
        }
    }

    startCurrentHabitatAgain() {
        const habitatName = this.gameState.currentHabitat;
        if (!habitatName || !this.gameState.habitatProgress[habitatName]) {
            return;
        }

        const solvedCount = this.gameState.habitatProgress[habitatName].completed;
        this.showConfirmationDialog(
            'Start Habitat Again?',
            `You have solved ${solvedCount} problem(s) here. Starting again resets this habitat progress to 0.`,
            () => {
                const currentProgress = this.gameState.habitatProgress[habitatName];
                this.gameState.habitatProgress[habitatName] = {
                    ...currentProgress,
                    completed: 0,
                    unlocked: true
                };
                this.saveGameState();
                this.enterHabitat(habitatName);
            },
            {
                confirmLabel: 'Start Again',
                cancelLabel: 'Keep Progress'
            }
        );
    }

    cleanupCurrentHabitat() {
        // Stop any timers
        if (this.timerManager) {
            this.timerManager.stopTimer();
        }

        this.isGamePaused = false;
        this.hidePauseOverlay();
        
        // Hide math problem UI
        const mathProblem = document.getElementById('mathProblem');
        if (mathProblem) {
            mathProblem.classList.add('hidden');
        }
        
        // Hide feedback
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.classList.add('hidden');
        }

        const leoAdvice = document.getElementById('leoAdvice');
        if (leoAdvice) {
            leoAdvice.classList.add('hidden');
            leoAdvice.textContent = '';
        }
        
        // Clear answer option states
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Call habitat's cleanup if it exists
        if (this.currentHabitat && this.currentHabitat.cleanup) {
            this.currentHabitat.cleanup();
        }
        
        // Clear game engine state
        if (this.gameEngine) {
            this.gameEngine.clearSprites();
            this.gameEngine.clearParticles();
            this.gameEngine.clearAnimations();
            this.gameEngine.pauseGame();
        }
        
        // Clear current habitat reference
        this.currentHabitat = null;
        this.gameState.currentHabitat = null;
        
        console.log('Current habitat cleaned up');
    }

    resetProgress() {
        // Show custom confirmation dialog
        this.showConfirmationDialog(
            'Reset Progress',
            'Are you sure you want to reset all progress? This cannot be undone.',
            () => {
                // Reset all habitat progress
                for (const habitat in this.gameState.habitatProgress) {
                    this.gameState.habitatProgress[habitat].completed = 0;
                    // Keep only bunnyMeadow unlocked
                    if (habitat !== 'bunnyMeadow') {
                        this.gameState.habitatProgress[habitat].unlocked = false;
                    }
                }
                
                // Reset badge count
                this.gameState.badgeCount = 0;
                
                // Save the reset state
                this.saveGameState();
                
                // Update UI
                this.updateHabitatCards();
                this.updateGameUI();
                
                // Show temporary success message
                this.showTemporaryMessage('Progress has been reset! All habitats except Bunny Meadow are now locked.');
            },
            {
                confirmLabel: 'Reset Progress',
                cancelLabel: 'Cancel',
                confirmColor: '#4CAF50',
                cancelColor: '#f44336'
            }
        );
    }

    showConfirmationDialog(title, message, onConfirm, options = {}) {
        const confirmLabel = options.confirmLabel || 'Confirm';
        const cancelLabel = options.cancelLabel || 'Cancel';
        const confirmColor = options.confirmColor || '#4CAF50';
        const cancelColor = options.cancelColor || '#f44336';

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.style.cssText = `
            background: white;
            padding: 24px;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        modal.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #333; font-size: 20px;">${title}</h3>
            <p style="margin: 0 0 24px 0; color: #666; font-size: 16px; line-height: 1.4;">${message}</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="modal-btn cancel" style="
                    background: ${cancelColor};
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                ">${cancelLabel}</button>
                <button class="modal-btn confirm" style="
                    background: ${confirmColor};
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                ">${confirmLabel}</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Animate in
        setTimeout(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
        
        // Handle buttons
        const cancelBtn = modal.querySelector('.cancel');
        const confirmBtn = modal.querySelector('.confirm');
        
        const closeModal = () => {
            overlay.style.opacity = '0';
            modal.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        };
        
        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', () => {
            closeModal();
            onConfirm();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    applyTimerSettings() {
        if (!this.timerManager) {
            return;
        }

        this.timerManager.applyProfile({
            habitat: this.gameState.currentHabitat,
            habitatProgress: this.gameState.habitatProgress,
            difficulty: this.gameState.settings.difficulty,
            pace: this.gameState.settings.timerPace,
            style: this.gameState.settings.timerStyle
        });
    }

    showTemporaryMessage(message) {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = 'temporary-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 16px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // Language selector methods
    toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        const button = document.getElementById('languageSelectorBtn');
        
        if (dropdown && button) {
            const isHidden = dropdown.classList.contains('hidden');
            
            if (isHidden) {
                dropdown.classList.remove('hidden');
                button.classList.add('active');
                this.updateLanguageOptions();
            } else {
                dropdown.classList.add('hidden');
                button.classList.remove('active');
            }
        }
    }

    closeLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        const button = document.getElementById('languageSelectorBtn');
        
        if (dropdown && button) {
            dropdown.classList.add('hidden');
            button.classList.remove('active');
        }
    }

    updateLanguageOptions() {
        const currentLang = this.gameState.settings.language;
        const options = document.querySelectorAll('.language-option');
        
        options.forEach(option => {
            const langCode = option.getAttribute('data-lang');
            if (langCode === currentLang) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    selectLanguage(langCode) {
        if (this.gameState.settings.language !== langCode) {
            this.gameState.settings.language = langCode;
            this.languageManager.setLanguage(langCode);
            this.saveGameState();
            
            // Update UI immediately
            this.updateLanguageSelectorUI();
            
            // Play audio feedback
            this.audioManager.playSFX('ui-select');
        }
        
        this.closeLanguageDropdown();
    }

    updateLanguageSelectorUI() {
        const currentLang = this.languageManager.getLanguageData(this.gameState.settings.language);
        const button = document.getElementById('languageSelectorBtn');
        
        if (button && currentLang) {
            const flagSpan = button.querySelector('.language-flag');
            const nameSpan = button.querySelector('.language-name');
            
            if (flagSpan && nameSpan) {
                flagSpan.textContent = currentLang.flag;
                nameSpan.textContent = currentLang.name;
            }
        }
        
        // Update dropdown options selection
        this.updateLanguageOptions();
    }

    onLanguageChanged(languageCode) {
        // Update game state
        this.gameState.settings.language = languageCode;
        this.saveGameState();
        
        // Update language selector UI
        this.updateLanguageSelectorUI();
        
        // Update MathEngine language
        if (this.mathEngine && this.mathEngine.setLanguage) {
            this.mathEngine.setLanguage(languageCode);
        }

        this.initializeLeoMascot();

        const leoAdvice = document.getElementById('leoAdvice');
        if (leoAdvice && !leoAdvice.classList.contains('hidden')) {
            leoAdvice.textContent = this.getLeoAdvice();
        }
        
        console.log(`Language changed to: ${languageCode}`);
    }

    // Difficulty selector methods
    toggleDifficultyDropdown() {
        const dropdown = document.getElementById('difficultyDropdown');
        const button = document.getElementById('difficultySelectorBtn');
        
        if (dropdown && button) {
            const isHidden = dropdown.classList.contains('hidden');
            
            if (isHidden) {
                dropdown.classList.remove('hidden');
                button.classList.add('active');
                this.updateDifficultyOptions();
            } else {
                dropdown.classList.add('hidden');
                button.classList.remove('active');
            }
        }
    }

    closeDifficultyDropdown() {
        const dropdown = document.getElementById('difficultyDropdown');
        const button = document.getElementById('difficultySelectorBtn');
        
        if (dropdown && button) {
            dropdown.classList.add('hidden');
            button.classList.remove('active');
        }
    }

    updateDifficultyOptions() {
        const currentDifficulty = this.gameState.settings.difficulty;
        const options = document.querySelectorAll('.difficulty-option');
        
        options.forEach(option => {
            const difficulty = option.getAttribute('data-difficulty');
            if (difficulty === currentDifficulty) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    selectDifficulty(difficulty) {
        if (this.gameState.settings.difficulty !== difficulty) {
            this.gameState.settings.difficulty = difficulty;
            this.saveGameState();
            
            // Update math engine difficulty
            if (this.mathEngine && this.mathEngine.setDifficulty) {
                this.mathEngine.setDifficulty(difficulty);
            }
            
            // Update UI immediately
            this.updateDifficultySelectorUI();
            
            // Play audio feedback
            this.audioManager.playSFX('ui-select');
            
            console.log(`Difficulty changed to: ${difficulty}`);
        }
        
        this.closeDifficultyDropdown();
    }

    updateDifficultySelectorUI() {
        const currentDifficulty = this.gameState.settings.difficulty;
        const button = document.getElementById('difficultySelectorBtn');
        
        if (button && currentDifficulty) {
            const iconSpan = button.querySelector('.difficulty-icon');
            const nameSpan = button.querySelector('.difficulty-name');
            
            if (iconSpan && nameSpan) {
                // Update icon based on difficulty
                switch (currentDifficulty) {
                    case 'easy':
                        iconSpan.textContent = '⭐';
                        nameSpan.setAttribute('data-translate', 'difficulty.easy');
                        nameSpan.textContent = this.languageManager.translate('difficulty.easy');
                        break;
                    case 'medium':
                        iconSpan.textContent = '⭐⭐';
                        nameSpan.setAttribute('data-translate', 'difficulty.medium');
                        nameSpan.textContent = this.languageManager.translate('difficulty.medium');
                        break;
                    case 'hard':
                        iconSpan.textContent = '⭐⭐⭐';
                        nameSpan.setAttribute('data-translate', 'difficulty.hard');
                        nameSpan.textContent = this.languageManager.translate('difficulty.hard');
                        break;
                }
            }
        }
        
        // Update dropdown options selection
        this.updateDifficultyOptions();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}
