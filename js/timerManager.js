// Timer Manager for Times Table Animals
// Handles level timers, warnings, and catastrophic events

class TimerManager {
    constructor(gameController, audioManager) {
        this.gameController = gameController;
        this.audioManager = audioManager;
        
        // Timer configuration
        this.config = {
            levelDuration: 240000, // 4 minutes in milliseconds
            warningThresholds: [60000, 30000, 10000], // 1 min, 30 sec, 10 sec
            urgencyThreshold: 60000 // When to start urgency effects (1 minute)
        };
        
        // Timer state
        this.isActive = false;
        this.timeRemaining = 0;
        this.startTime = 0;
        this.warningsShown = [];
        this.currentHabitat = null;
        
        // UI elements
        this.timerBar = null;
        this.timerDisplay = null;
        this.catastrophicOverlay = null;
        
        this.init();
    }

    init() {
        this.createTimerUI();
        this.createCatastrophicOverlay();
    }

    createTimerUI() {
        // Use existing timer elements from HTML
        this.timerBar = document.getElementById('timerBar');
        this.timerDisplay = document.getElementById('timerText');
        
        // Set initial state
        if (this.timerBar) {
            this.timerBar.style.width = '100%';
            this.timerBar.className = 'timer-bar safe';
        }
        
        if (this.timerDisplay) {
            this.timerDisplay.textContent = '4:00';
        }
    }

    createCatastrophicOverlay() {
        // Create overlay for catastrophic events
        const overlay = document.createElement('div');
        overlay.id = 'catastrophicOverlay';
        overlay.className = 'catastrophic-overlay hidden';
        overlay.innerHTML = `
            <div class="catastrophic-content">
                <div class="catastrophic-icon">🌋</div>
                <h1 class="catastrophic-title">VOLCANO ERUPTS!</h1>
                <p class="catastrophic-message">The meadow is in danger! The animals need your help!</p>
                <div class="catastrophic-buttons">
                    <button id="tryAgainBtn" class="catastrophic-btn primary">Try Again</button>
                    <button id="backToHabitatsBtn" class="catastrophic-btn secondary">Back to Habitats</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.catastrophicOverlay = overlay;

        // Add event listeners
        document.getElementById('tryAgainBtn').addEventListener('click', () => {
            this.onTryAgain();
        });

        document.getElementById('backToHabitatsBtn').addEventListener('click', () => {
            this.onBackToHabitats();
        });
    }

    startTimer(habitat) {
        console.log(`TimerManager: Starting timer for habitat ${habitat}`);
        
        this.currentHabitat = habitat;
        this.isActive = true;
        this.timeRemaining = this.config.levelDuration;
        this.startTime = Date.now();
        this.warningsShown = [];
        
        // Show timer UI
        this.showTimerUI();
        this.updateTimerDisplay();
        
        // Update catastrophic event theme
        this.updateCatastrophicTheme(habitat);
    }

    stopTimer() {
        console.log('TimerManager: Stopping timer');
        this.isActive = false;
        this.hideTimerUI();
    }

    pauseTimer() {
        if (this.isActive) {
            this.isActive = false;
            console.log('TimerManager: Timer paused');
        }
    }

    resumeTimer() {
        if (!this.isActive && this.timeRemaining > 0) {
            this.isActive = true;
            this.startTime = Date.now() - (this.config.levelDuration - this.timeRemaining);
            console.log('TimerManager: Timer resumed');
        }
    }

    update(deltaTime) {
        if (!this.isActive) return;

        // Calculate time remaining
        const elapsed = Date.now() - this.startTime;
        this.timeRemaining = Math.max(0, this.config.levelDuration - elapsed);

        // Update display
        this.updateTimerDisplay();

        // Check for warnings
        this.checkWarnings();

        // Check for time up
        if (this.timeRemaining <= 0) {
            this.triggerCatastrophicEvent();
        }
    }

    updateTimerDisplay() {
        if (!this.timerDisplay || !this.timerBar) return;

        // Format time as MM:SS
        const minutes = Math.floor(this.timeRemaining / 60000);
        const seconds = Math.floor((this.timeRemaining % 60000) / 1000);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.timerDisplay.textContent = timeString;

        // Update progress bar
        const progress = (this.timeRemaining / this.config.levelDuration) * 100;
        this.timerBar.style.width = `${progress}%`;

        // Update colors based on urgency
        this.updateUrgencyEffects();
    }

    updateUrgencyEffects() {
        if (!this.timerBar) return;

        const progress = this.timeRemaining / this.config.levelDuration;
        
        // Color transitions based on time remaining
        if (progress > 0.5) {
            // Green zone
            this.timerBar.className = 'timer-bar safe';
        } else if (progress > 0.25) {
            // Yellow zone
            this.timerBar.className = 'timer-bar warning';
        } else if (progress > 0.1) {
            // Orange zone
            this.timerBar.className = 'timer-bar danger';
        } else {
            // Red zone with pulsing
            this.timerBar.className = 'timer-bar critical';
        }

        // Add pulsing effect when under 30 seconds
        const timerContainer = document.getElementById('timerContainer');
        if (timerContainer) {
            if (this.timeRemaining <= 30000) {
                timerContainer.classList.add('pulsing');
            } else {
                timerContainer.classList.remove('pulsing');
            }
        }
    }

    checkWarnings() {
        for (const threshold of this.config.warningThresholds) {
            if (this.timeRemaining <= threshold && !this.warningsShown.includes(threshold)) {
                this.showWarning(threshold);
                this.warningsShown.push(threshold);
            }
        }
    }

    showWarning(threshold) {
        console.log(`TimerManager: Showing warning for ${threshold}ms remaining`);
        
        // Play warning sound
        if (this.audioManager) {
            this.audioManager.playSFX('timer-warning');
        }

        // Show visual warning
        this.createWarningEffect(threshold);
    }

    createWarningEffect(threshold) {
        const warningText = threshold === 60000 ? '1 minute left!' : 
                          threshold === 30000 ? '30 seconds left!' : 
                          '10 seconds left!';

        // Create warning popup
        const warning = document.createElement('div');
        warning.className = 'timer-warning-popup';
        warning.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">⚠️</span>
                <span class="warning-text">${warningText}</span>
            </div>
        `;

        document.body.appendChild(warning);

        // Animate and remove
        setTimeout(() => {
            warning.classList.add('show');
        }, 10);

        setTimeout(() => {
            warning.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(warning);
            }, 300);
        }, 2000);
    }

    triggerCatastrophicEvent() {
        console.log(`TimerManager: Triggering catastrophic event for ${this.currentHabitat}`);
        
        this.stopTimer();
        
        // Play catastrophic sound
        if (this.audioManager) {
            this.audioManager.playSFX('catastrophic-event');
        }

        // Show catastrophic overlay
        this.showCatastrophicOverlay();

        // Pause the game
        if (this.gameController && this.gameController.gameEngine) {
            this.gameController.gameEngine.pauseGame();
        }
    }

    updateCatastrophicTheme(habitat) {
        const themes = {
            bunnyMeadow: {
                icon: '🌋',
                title: 'VOLCANO ERUPTS!',
                message: 'The meadow is in danger! The bunnies need your help!'
            },
            penguinPairsArctic: {
                icon: '❄️',
                title: 'MASSIVE BLIZZARD!',
                message: 'The penguins are lost in the storm!'
            },
            penguinArctic: {
                icon: '🧊',
                title: 'ICE AGE RETURNS!',
                message: 'Everything is freezing! Help the penguins!'
            },
            elephantSavanna: {
                icon: '🌵',
                title: 'SEVERE DROUGHT!',
                message: 'The savanna is parched! The elephants need water!'
            },
            monkeyJungle: {
                icon: '🔥',
                title: 'JUNGLE FIRE!',
                message: 'The trees are burning! Save the monkeys!'
            },
            lionPride: {
                icon: '🌪️',
                title: 'SANDSTORM CHAOS!',
                message: 'Can\'t see the pride! Help them find safety!'
            }
        };

        const theme = themes[habitat] || themes.bunnyMeadow;
        
        if (this.catastrophicOverlay) {
            const icon = this.catastrophicOverlay.querySelector('.catastrophic-icon');
            const title = this.catastrophicOverlay.querySelector('.catastrophic-title');
            const message = this.catastrophicOverlay.querySelector('.catastrophic-message');
            
            if (icon) icon.textContent = theme.icon;
            if (title) title.textContent = theme.title;
            if (message) message.textContent = theme.message;
        }
    }

    showCatastrophicOverlay() {
        if (this.catastrophicOverlay) {
            this.catastrophicOverlay.classList.remove('hidden');
            
            // Add entrance animation
            setTimeout(() => {
                this.catastrophicOverlay.classList.add('show');
            }, 10);
        }
    }

    hideCatastrophicOverlay() {
        if (this.catastrophicOverlay) {
            this.catastrophicOverlay.classList.remove('show');
            setTimeout(() => {
                this.catastrophicOverlay.classList.add('hidden');
            }, 300);
        }
    }

    onTryAgain() {
        console.log('TimerManager: Try again clicked');
        this.hideCatastrophicOverlay();
        
        // Restart the current habitat
        if (this.gameController && this.currentHabitat) {
            this.gameController.restartCurrentHabitat();
        }
    }

    onBackToHabitats() {
        console.log('TimerManager: Back to habitats clicked');
        this.hideCatastrophicOverlay();
        
        // Return to habitat selection
        if (this.gameController) {
            this.gameController.showHabitatSelection();
        }
    }

    showTimerUI() {
        const timerContainer = document.getElementById('timerContainer');
        if (timerContainer) {
            timerContainer.classList.remove('hidden');
        }
    }

    hideTimerUI() {
        const timerContainer = document.getElementById('timerContainer');
        if (timerContainer) {
            timerContainer.classList.add('hidden');
        }
    }

    // Get time remaining for external access
    getTimeRemaining() {
        return this.timeRemaining;
    }

    getTimeRemainingPercent() {
        return (this.timeRemaining / this.config.levelDuration) * 100;
    }

    isTimerActive() {
        return this.isActive;
    }

    // Reset timer for new level
    reset() {
        this.stopTimer();
        this.hideCatastrophicOverlay();
        this.warningsShown = [];
        this.currentHabitat = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerManager;
}