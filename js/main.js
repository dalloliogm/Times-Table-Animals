// Times Table Animals - Main Game Controller
// Welcome Albert Animals Sanctuary

class GameController {
    constructor() {
        this.currentScreen = 'loadingScreen';
        this.isSubmittingAnswer = false; // Flag to prevent double submission
        this.gameState = {
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
        this.timerManager = new TimerManager(this, this.audioManager);
        this.sceneManager = new SceneManager();
        
        // Set up timer callbacks
        this.setupTimerCallbacks();
        
        // Start timer update loop
        this.startTimerUpdateLoop();
        
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

        // Reset Progress Button
        document.getElementById('resetProgressBtn').addEventListener('click', () => {
            this.resetProgress();
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

        // Home Button Event
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
        // Cleanup any current habitat
        this.cleanupCurrentHabitat();
        
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
        // Cleanup previous habitat first
        this.cleanupCurrentHabitat();
        
        this.gameState.currentHabitat = habitatName;
        this.switchScreen('gameScreen');
        this.updateGameUI();
        
        // Initialize habitat
        switch(habitatName) {
            case 'bunnyMeadow':
                this.currentHabitat = new BunnyMeadow(this.gameEngine, this.mathEngine, this);
                break;
            case 'penguinPairsArctic':
                this.currentHabitat = new PenguinPairsArctic(this.gameEngine, this.mathEngine, this);
                break;
            // TODO: Add other habitats
            default:
                console.log(`Habitat ${habitatName} not yet implemented`);
        }
        
        // Start timer for the level
        this.timerManager.startTimer(habitatName);
        
        this.audioManager.playBackgroundMusic(habitatName);
        this.gameEngine.startGame();
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
            rainbowReserve: 'Rainbow Reserve'
        };
        
        document.getElementById('currentHabitat').textContent = 
            habitatNames[this.gameState.currentHabitat] || 'Unknown Habitat';
    }

    pauseGame() {
        this.gameEngine.pauseGame();
        this.audioManager.pauseAll();
        this.timerManager.pauseTimer();
        // TODO: Show pause menu
    }

    showGameSettings() {
        this.pauseGame();
        this.showSettings();
    }

    selectAnswer(optionNumber) {
        // Prevent selection during submission
        if (this.isSubmittingAnswer) {
            console.log('GameController: Answer submission already in progress, ignoring selection');
            return;
        }
        
        // Visual feedback
        this.highlightSelectedOption(optionNumber);
        
        // Get the selected answer value
        const currentProblem = this.mathEngine.getCurrentProblem();
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
        
        // Let the habitat handle the answer checking
        if (this.currentHabitat && this.currentHabitat.checkAnswer) {
            const isCorrect = this.currentHabitat.checkAnswer(selectedAnswer);
            this.showFeedback(isCorrect ? 'Correct! Well done!' : 'Not quite right, try again!', isCorrect);
            
            // Visual feedback on options
            this.showAnswerFeedback(selectedAnswer, isCorrect);
        } else {
            // Fallback to mathEngine for habitats that don't have checkAnswer
            const isCorrect = this.mathEngine.checkAnswer(selectedAnswer);
            this.showFeedback(isCorrect ? 'Correct! Well done!' : 'Not quite right, try again!', isCorrect);
            
            // Visual feedback on options
            this.showAnswerFeedback(selectedAnswer, isCorrect);
            
            if (isCorrect) {
                this.audioManager.playSFX('correct');
                this.updateProgress();
            } else {
                this.audioManager.playSFX('incorrect');
            }
        }
        
        // Reset flag after processing, with a small delay to prevent rapid re-submission
        setTimeout(() => {
            this.isSubmittingAnswer = false;
            console.log('GameController: Reset isSubmittingAnswer to false (after timeout)');
        }, 100);
    }

    showAnswerFeedback(selectedAnswer, isCorrect) {
        const currentProblem = this.mathEngine.getCurrentProblem();
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
        
        feedback.classList.add('hidden');
        
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
        const problem = this.mathEngine.getCurrentProblem();
        document.getElementById('problemTitle').textContent = problem.title;
        document.getElementById('problemText').textContent = problem.text;
        
        // Update answer options
        this.updateAnswerOptions();
        
        // Update visual representation
        this.updateProblemVisual(problem);
    }

    updateAnswerOptions() {
        const currentProblem = this.mathEngine.getCurrentProblem();
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
            'owlObservatory', 'dragonSanctuary', 'rainbowReserve'
        ];
        
        const currentIndex = habitatOrder.indexOf(currentHabitat);
        if (currentIndex >= 0 && currentIndex < habitatOrder.length - 1) {
            const nextHabitat = habitatOrder[currentIndex + 1];
            this.gameState.habitatProgress[nextHabitat].unlocked = true;
        }
    }

    showHabitatCompletion(habitat) {
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
            rainbowReserve: 'Rainbow Reserve'
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
        `;
        
        // Create completion content
        const completionContent = document.createElement('div');
        completionContent.className = 'completion-content';
        completionContent.style.cssText = `
            text-align: center;
            color: white;
            transform: scale(0.8);
            transition: transform 0.5s ease;
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
            ">Continue to Habitats</button>
        `;
        
        completionOverlay.appendChild(completionContent);
        document.body.appendChild(completionOverlay);
        
        // Animate in
        setTimeout(() => {
            completionOverlay.style.opacity = '1';
            completionContent.style.transform = 'scale(1)';
        }, 100);
        
        // Handle continue button
        const continueBtn = document.getElementById('continueToHabitats');
        continueBtn.addEventListener('click', () => {
            this.hideCompletionOverlay();
            this.cleanupCurrentHabitat();
            this.showHabitatSelection();
        });
        
        // Auto-continue after 5 seconds
        setTimeout(() => {
            if (document.getElementById('completionOverlay')) {
                continueBtn.click();
            }
        }, 5000);
    }

    getNextHabitat(currentHabitat) {
        const habitatOrder = [
            'bunnyMeadow', 'penguinPairsArctic', 'penguinArctic', 'elephantSavanna', 'monkeyJungle',
            'lionPride', 'dolphinCove', 'bearForest', 'giraffePlains',
            'owlObservatory', 'dragonSanctuary', 'rainbowReserve'
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
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 500);
        }
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
        // Update timer every 100ms
        setInterval(() => {
            if (this.timerManager) {
                this.timerManager.update();
            }
        }, 100);
    }

    restartCurrentHabitat() {
        // Method called by TimerManager when user clicks "Try Again"
        const habitatName = this.gameState.currentHabitat;
        if (habitatName) {
            this.enterHabitat(habitatName);
        }
    }

    cleanupCurrentHabitat() {
        // Stop any timers
        if (this.timerManager) {
            this.timerManager.stopTimer();
        }
        
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
            }
        );
    }

    showConfirmationDialog(title, message, onConfirm) {
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
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                ">Cancel</button>
                <button class="modal-btn confirm" style="
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                ">Reset Progress</button>
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
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameController = new GameController();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}