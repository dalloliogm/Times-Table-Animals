// Times Table Animals - Main Game Controller
// Welcome Albert Animals Sanctuary

class GameController {
    constructor() {
        this.currentScreen = 'loadingScreen';
        this.gameState = {
            playerName: 'Junior Caretaker',
            badgeCount: 0,
            currentHabitat: null,
            habitatProgress: {
                bunnyMeadow: { completed: 0, total: 10, unlocked: true },
                penguinArctic: { completed: 0, total: 12, unlocked: false },
                elephantSavanna: { completed: 0, total: 10, unlocked: false },
                monkeyJungle: { completed: 0, total: 15, unlocked: false },
                lionPride: { completed: 0, total: 12, unlocked: false },
                dolphinCove: { completed: 0, total: 14, unlocked: false },
                bearForest: { completed: 0, total: 11, unlocked: false },
                giraffePlains: { completed: 0, total: 13, unlocked: false },
                owlObservatory: { completed: 0, total: 16, unlocked: false },
                dragonSanctuary: { completed: 0, total: 20, unlocked: false },
                rainbowReserve: { completed: 0, total: 25, unlocked: false }
            },
            settings: {
                musicEnabled: true,
                sfxEnabled: true,
                voiceEnabled: true,
                masterVolume: 75
            }
        };
        this.init();
    }

    init() {
        // Load saved game state
        this.loadGameState();
        
        // Initialize event listeners
        this.setupEventListeners();
        
        // Initialize managers
        this.audioManager = new AudioManager(this.gameState.settings);
        this.mathEngine = new MathEngine();
        this.gameEngine = new GameEngine();
        this.sceneManager = new SceneManager();
        
        // Start loading sequence
        this.showLoadingScreen();
        
        // Simulate loading time
        setTimeout(() => {
            this.showMainMenu();
        }, 2000);
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

        // Game UI Events
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseGame();
        });

        document.getElementById('settingsGameBtn').addEventListener('click', () => {
            this.showGameSettings();
        });

        // Habitat Selection Events
        document.getElementById('backToHabitats').addEventListener('click', () => {
            this.showHabitatSelection();
        });

        // Math Problem Events
        document.getElementById('submitAnswer').addEventListener('click', () => {
            this.submitAnswer();
        });

        document.getElementById('answerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });

        document.getElementById('nextProblem').addEventListener('click', () => {
            this.nextProblem();
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
    }

    showMainMenu() {
        this.switchScreen('mainMenu');
        this.audioManager.playBackgroundMusic('menu');
    }

    showSettings() {
        this.switchScreen('settingsMenu');
        this.updateSettingsUI();
    }

    showAchievements() {
        // TODO: Implement achievements screen
        console.log('Achievements screen not yet implemented');
    }

    updateSettingsUI() {
        document.getElementById('musicToggle').checked = this.gameState.settings.musicEnabled;
        document.getElementById('sfxToggle').checked = this.gameState.settings.sfxEnabled;
        document.getElementById('voiceToggle').checked = this.gameState.settings.voiceEnabled;
        document.getElementById('volumeSlider').value = this.gameState.settings.masterVolume;
    }

    startGame() {
        this.showHabitatSelection();
    }

    showHabitatSelection() {
        this.switchScreen('habitatSelect');
        this.updateHabitatCards();
        this.audioManager.playBackgroundMusic('habitat-selection');
    }

    updateHabitatCards() {
        const habitatCards = document.querySelectorAll('.habitat-card');
        habitatCards.forEach(card => {
            const habitat = card.dataset.habitat;
            const progress = this.gameState.habitatProgress[habitat];
            
            if (progress.unlocked) {
                card.classList.remove('locked');
                card.classList.add('unlocked');
                
                // Update progress bar
                const progressFill = card.querySelector('.progress-fill');
                if (progressFill) {
                    const percentage = (progress.completed / progress.total) * 100;
                    progressFill.style.width = `${percentage}%`;
                }
            } else {
                card.classList.remove('unlocked');
                card.classList.add('locked');
            }
        });
    }

    enterHabitat(habitatName) {
        this.gameState.currentHabitat = habitatName;
        this.switchScreen('gameScreen');
        this.updateGameUI();
        
        // Initialize habitat
        switch(habitatName) {
            case 'bunnyMeadow':
                this.currentHabitat = new BunnyMeadow(this.gameEngine, this.mathEngine);
                break;
            // TODO: Add other habitats
            default:
                console.log(`Habitat ${habitatName} not yet implemented`);
        }
        
        this.audioManager.playBackgroundMusic(habitatName);
        this.gameEngine.startGame();
    }

    updateGameUI() {
        document.getElementById('playerName').textContent = this.gameState.playerName;
        document.getElementById('badgeCount').textContent = `🏆 ${this.gameState.badgeCount}`;
        
        // Update habitat name display
        const habitatNames = {
            bunnyMeadow: 'Bunny Meadow',
            penguinArctic: 'Penguin Arctic',
            elephantSavanna: 'Elephant Savanna',
            monkeyJungle: 'Monkey Jungle',
            lionPride: 'Lion Pride Lands',
            dolphinCove: 'Dolphin Cove',
            bearForest: 'Bear Forest',
            giraffePlains: 'Giraffe Plains',
            owlObservatory: 'Owl Observatory',
            dragonSanctuary: 'Dragon Sanctuary',
            rainbowReserve: 'Rainbow Reserve'
        };
        
        document.getElementById('currentHabitat').textContent = 
            habitatNames[this.gameState.currentHabitat] || 'Unknown Habitat';
    }

    pauseGame() {
        this.gameEngine.pauseGame();
        this.audioManager.pauseAll();
        // TODO: Show pause menu
    }

    showGameSettings() {
        this.pauseGame();
        this.showSettings();
    }

    submitAnswer() {
        const answerInput = document.getElementById('answerInput');
        const answer = parseInt(answerInput.value);
        
        if (isNaN(answer)) {
            this.showFeedback('Please enter a number!', false);
            return;
        }
        
        const isCorrect = this.mathEngine.checkAnswer(answer);
        this.showFeedback(isCorrect ? 'Correct! Well done!' : 'Not quite right, try again!', isCorrect);
        
        if (isCorrect) {
            this.audioManager.playSFX('correct');
            this.updateProgress();
        } else {
            this.audioManager.playSFX('incorrect');
        }
    }

    showFeedback(message, isCorrect) {
        const feedback = document.getElementById('feedback');
        const feedbackText = document.getElementById('feedbackText');
        
        feedbackText.textContent = message;
        feedback.className = isCorrect ? 'correct' : 'incorrect';
        feedback.classList.remove('hidden');
        
        // Add animation
        feedback.classList.add(isCorrect ? 'correct-feedback' : 'incorrect-feedback');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            feedback.classList.remove('correct-feedback', 'incorrect-feedback');
        }, 800);
    }

    nextProblem() {
        const feedback = document.getElementById('feedback');
        const answerInput = document.getElementById('answerInput');
        
        feedback.classList.add('hidden');
        answerInput.value = '';
        answerInput.focus();
        
        // Generate next problem
        this.mathEngine.generateProblem();
        this.updateProblemUI();
    }

    updateProblemUI() {
        const problem = this.mathEngine.getCurrentProblem();
        document.getElementById('problemTitle').textContent = problem.title;
        document.getElementById('problemText').textContent = problem.text;
        
        // Update visual representation
        this.updateProblemVisual(problem);
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
        // Award badge
        this.gameState.badgeCount++;
        this.audioManager.playSFX('badge-earned');
        
        // Unlock next habitat
        this.unlockNextHabitat(habitat);
        
        // Show completion celebration
        this.showHabitatCompletion(habitat);
    }

    unlockNextHabitat(currentHabitat) {
        const habitatOrder = [
            'bunnyMeadow', 'penguinArctic', 'elephantSavanna', 'monkeyJungle',
            'lionPride', 'dolphinCove', 'bearForest', 'giraffePlains',
            'owlObservatory', 'dragonSanctuary', 'rainbowReserve'
        ];
        
        const currentIndex = habitatOrder.indexOf(currentHabitat);
        if (currentIndex >= 0 && currentIndex < habitatOrder.length - 1) {
            const nextHabitat = habitatOrder[currentIndex + 1];
            this.gameState.habitatProgress[nextHabitat].unlocked = true;
        }
    }

    showHabitatCompletion(habitat) {
        // TODO: Implement completion celebration animation
        console.log(`Habitat ${habitat} completed!`);
    }

    switchScreen(screenName) {
        // Hide current screen
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show new screen
        document.getElementById(screenName).classList.add('active');
        this.currentScreen = screenName;
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
                // Merge with default state to ensure new properties are included
                this.gameState = { ...this.gameState, ...parsed };
            }
        } catch (error) {
            console.warn('Could not load game state:', error);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameController = new GameController();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}