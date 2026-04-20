// Timer Manager for Times Table Animals
// Handles level timers, warnings, and catastrophic events

class TimerManager {
    constructor(gameController, audioManager) {
        this.gameController = gameController;
        this.audioManager = audioManager;
        
        // Timer configuration
        this.config = {
            levelDuration: 300000, 
            warningThresholds: [60_000, 45_000, 30_000, 20_000, 10_000, 5_000],
            urgencyThreshold: 120_000, // When to start urgency effects
            criticalThreshold: 80_000, // When to start critical effects
            emergencyThreshold: 40_000, // When to start emergency effects
            shakeIntensity: {
                mild: 2,
                moderate: 4,
                intense: 8,
                extreme: 16
            }
        };
        this.currentStyle = 'gentle';
        
        // Timer state
        this.isActive = false;
        this.timeRemaining = 0;
        this.startTime = 0;
        this.warningsShown = [];
        this.currentHabitat = null;
        this.catastrophicEventActive = false;
        
        // UI elements
        this.timerBar = null;
        this.timerDisplay = null;
        this.catastrophicOverlay = null;
        
        // Enhanced effects state
        this.effectsState = {
            isShaking: false,
            shakeInterval: null,
            rumbleInterval: null,
            flashInterval: null,
            particleInterval: null,
            currentIntensity: 0
        };
        
        this.init();
    }

    init() {
        this.createTimerUI();
        this.cacheCatastrophicOverlay();
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
            // Calculate initial display from levelDuration
            const minutes = Math.floor(this.config.levelDuration / 60000);
            const seconds = Math.floor((this.config.levelDuration % 60000) / 1000);
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            this.timerDisplay.textContent = timeString;
        }
    }

    cacheCatastrophicOverlay() {
        this.catastrophicOverlay = document.getElementById('catastrophicOverlay');

        if (!this.catastrophicOverlay) {
            console.warn('TimerManager: catastrophic overlay element not found in DOM');
        }
    }
    
    translate(key) {
        if (this.gameController && this.gameController.languageManager && this.gameController.languageManager.translate) {
            return this.gameController.languageManager.translate(key);
        }
        return key; // fallback to key if no translator available
    }

    startTimer(habitat) {
        console.log(`TimerManager: Starting timer for habitat ${habitat}`);

        const settings = this.gameController?.gameState?.settings || {};
        const habitatProgress = this.gameController?.gameState?.habitatProgress || {};
        this.applyProfile({
            habitat,
            habitatProgress,
            difficulty: settings.difficulty,
            pace: settings.timerPace,
            style: settings.timerStyle
        });
        
        this.currentHabitat = habitat;
        this.catastrophicEventActive = false;
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
        const isDramatic = this.currentStyle === 'dramatic';
        
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

        // Enhanced dramatic effects based on time remaining
        const timerContainer = document.getElementById('timerContainer');
        if (timerContainer) {
            if (this.timeRemaining <= this.config.emergencyThreshold) {
                timerContainer.classList.add('pulsing', 'emergency');
                this.startScreenShake(isDramatic ? 'extreme' : 'moderate');
                if (isDramatic) {
                    this.startRedFlash();
                } else {
                    this.stopFlash();
                }
            } else if (this.timeRemaining <= this.config.criticalThreshold) {
                timerContainer.classList.add('pulsing', 'critical');
                this.startScreenShake(isDramatic ? 'intense' : 'mild');
                if (isDramatic) {
                    this.startWarningFlash();
                } else {
                    this.stopFlash();
                }
            } else if (this.timeRemaining <= this.config.urgencyThreshold) {
                timerContainer.classList.add('pulsing', 'urgent');
                if (isDramatic) {
                    this.startScreenShake('moderate');
                } else {
                    this.stopScreenShake();
                }
            } else {
                timerContainer.classList.remove('pulsing', 'emergency', 'critical', 'urgent');
                this.stopScreenShake();
                this.stopFlash();
            }
        }
        
        // Add particle effects for critical moments
        if (isDramatic && this.timeRemaining <= this.config.emergencyThreshold) {
            this.createEmberParticles();
        } else if (!isDramatic && this.effectsState.particleInterval) {
            clearInterval(this.effectsState.particleInterval);
            this.effectsState.particleInterval = null;
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
        const warningSeconds = Math.ceil(threshold / 1000);
        
        // Play enhanced warning sounds based on urgency
        if (this.audioManager) {
            if (warningSeconds <= 5) {
                this.audioManager.playSFX('timer-warning-emergency');
                this.audioManager.playSFX('danger-siren');
            } else if (warningSeconds <= 10) {
                this.audioManager.playSFX('timer-warning-critical');
                this.audioManager.playSFX('volcano-rumble');
            } else if (warningSeconds <= 20) {
                this.audioManager.playSFX('timer-warning-urgent');
                this.audioManager.playSFX('ground-shake');
            } else if (warningSeconds <= 30) {
                this.audioManager.playSFX('timer-warning');
                this.audioManager.playSFX('earthquake');
            } else {
                this.audioManager.playSFX('timer-warning');
            }
        }

        // Show visual warning
        this.createWarningEffect(warningSeconds);
        
        // Add screen shake for more dramatic effect
        this.triggerWarningShake(warningSeconds);
    }

    createWarningEffect(remainingSeconds) {
        // Enhanced volcanic-themed warning messages
        const warningMessages = {
            60: { text: `1 minute left. ${this.translate('timer.warning')}`, icon: '⏰', class: 'warning-mild' },
            45: { text: '45 seconds left. Keep going!', icon: '⏳', class: 'warning-moderate' },
            30: { text: '30 seconds left. You can do it!', icon: '🔥', class: 'warning-urgent' },
            20: { text: '20 seconds left. Quick thinking time!', icon: '⚡', class: 'warning-critical' },
            10: { text: '10 seconds left. Almost there!', icon: '🚀', class: 'warning-emergency' },
            5: { text: '5 seconds left. Final push!', icon: '💥', class: 'warning-panic' }
        };

        const warningData = warningMessages[remainingSeconds] || {
            text: `${remainingSeconds} seconds left. Keep helping the animals!`,
            icon: '⚠️',
            class: 'warning-default'
        };

        // Use existing warning popup element for better mobile compatibility
        const warning = document.getElementById('timerWarningPopup');
        if (!warning) {
            console.warn('Timer warning popup element not found');
            return;
        }

        // Update content
        const warningIcon = warning.querySelector('.warning-icon');
        const warningMessage = document.getElementById('warningMessage');
        
        if (warningIcon) {
            if (warningData.icon.includes('<img')) {
                warningIcon.innerHTML = warningData.icon;
            } else {
                warningIcon.textContent = warningData.icon;
            }
        }
        if (warningMessage) warningMessage.textContent = warningData.text;

        // Reset all warning classes and add new one
        warning.className = `timer-warning-popup ${warningData.class}`;
        
        // Force reflow to ensure proper positioning on mobile
        warning.offsetHeight;
        
        // Show warning with mobile-friendly animation
        warning.classList.add('show');

        // Keep emergency warnings visible longer
        const displayTime = remainingSeconds <= 5 ? 3000 : 2000;
        setTimeout(() => {
            warning.classList.remove('show');
            // Clean up classes after animation
            setTimeout(() => {
                warning.className = 'timer-warning-popup';
            }, 300);
        }, displayTime);
    }

    triggerCatastrophicEvent() {
        console.log(`TimerManager: Triggering catastrophic event for ${this.currentHabitat}`);
        this.catastrophicEventActive = true;
        
        this.stopTimer();
        
        // Stop all ongoing effects
        this.stopScreenShake();
        this.stopFlash();
        
        // Play enhanced catastrophic sounds sequence
        if (this.audioManager) {
            if (this.currentStyle === 'dramatic') {
                this.audioManager.playSFX('volcanic-explosion');
                setTimeout(() => this.audioManager.playSFX('catastrophic-event'), 500);
                setTimeout(() => this.audioManager.playSFX('earthquake'), 1000);
            } else {
                this.audioManager.playSFX('timer-warning-critical');
                setTimeout(() => this.audioManager.playSFX('catastrophic-event'), 400);
            }
        }

        // Dramatic screen shake before showing overlay
        this.triggerCatastrophicShake();

        // Show catastrophic overlay with delay for dramatic effect
        setTimeout(() => {
            this.showCatastrophicOverlay();
        }, 1500);

        // Pause the game
        if (this.gameController && this.gameController.gameEngine) {
            this.gameController.gameEngine.pauseGame();
        }
    }
    
    triggerCatastrophicShake() {
        // Intense screen shake for catastrophic event
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;
        
        let shakeCount = 0;
        const dramatic = this.currentStyle === 'dramatic';
        const maxShakes = dramatic ? 30 : 16;
        let currentIntensity = dramatic ? 20 : 8;
        
        const shakeInterval = setInterval(() => {
            if (shakeCount >= maxShakes) {
                clearInterval(shakeInterval);
                gameContainer.style.transform = 'translate(0px, 0px)';
                return;
            }
            
            // Gradually reduce intensity
            currentIntensity = Math.max(2, currentIntensity - 0.5);
            
            const shakeX = (Math.random() - 0.5) * currentIntensity;
            const shakeY = (Math.random() - 0.5) * currentIntensity;
            const rotation = (Math.random() - 0.5) * 2; // Add slight rotation
            
            gameContainer.style.transform = `translate(${shakeX}px, ${shakeY}px) rotate(${rotation}deg)`;
            shakeCount++;
        }, 50);
    }

    updateCatastrophicTheme(habitat) {
        const themes = {
            bunnyMeadow: {
                icon: '<img src="assets/volcano.jpg" alt="Volcano Eruption" class="volcano-image">',
                title: this.translate('timer.catastrophic_title'),
                message: this.translate('timer.catastrophic_message')
            },
            penguinPairsArctic: {
                icon: '<img src="assets/volcano.jpg" alt="Volcano Eruption" class="volcano-image">',
                title: 'MASSIVE BLIZZARD!',
                message: 'The penguins are lost in the storm!'
            },
            penguinArctic: {
                icon: '<img src="assets/volcano.jpg" alt="Volcano Eruption" class="volcano-image">',
                title: 'ICE AGE RETURNS!',
                message: 'Everything is freezing! Help the penguins!'
            },
            elephantSavanna: {
                icon: '<img src="assets/volcano.jpg" alt="Volcano Eruption" class="volcano-image">',
                title: 'SEVERE DROUGHT!',
                message: 'The savanna is parched! The elephants need water!'
            },
            monkeyJungle: {
                icon: '<img src="assets/volcano.jpg" alt="Volcano Eruption" class="volcano-image">',
                title: 'JUNGLE FIRE!',
                message: 'The trees are burning! Save the monkeys!'
            },
            lionPride: {
                icon: '<img src="assets/volcano.jpg" alt="Volcano Eruption" class="volcano-image">',
                title: 'SANDSTORM CHAOS!',
                message: 'Can\'t see the pride! Help them find safety!'
            }
        };

        const dramaticTheme = themes[habitat] || themes.bunnyMeadow;
        const theme = this.currentStyle === 'dramatic'
            ? dramaticTheme
            : {
                icon: '⏰',
                title: 'Time Is Up!',
                message: 'No worries. Let\'s try that habitat again with a fresh timer!'
            };
        
        if (this.catastrophicOverlay) {
            const icon = this.catastrophicOverlay.querySelector('.catastrophic-icon');
            const title = this.catastrophicOverlay.querySelector('.catastrophic-title');
            const message = this.catastrophicOverlay.querySelector('.catastrophic-message');
            const tryAgainBtn = this.catastrophicOverlay.querySelector('#retryLevelBtn');
            const backToHabitatsBtn = this.catastrophicOverlay.querySelector('#backToHabitatsBtn');
            
            if (icon) {
                icon.innerHTML = theme.icon;
            }
            if (title) title.textContent = theme.title;
            if (message) message.textContent = theme.message;
            if (tryAgainBtn) tryAgainBtn.textContent = this.translate('timer.try_again');
            if (backToHabitatsBtn) backToHabitatsBtn.textContent = this.translate('timer.choose_different');
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
            this.catastrophicEventActive = false;
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

    isCatastrophicEventActive() {
        return this.catastrophicEventActive;
    }

    // Enhanced visual effects methods
    startScreenShake(intensity) {
        if (this.effectsState.isShaking) return;
        
        this.effectsState.isShaking = true;
        this.effectsState.currentIntensity = this.config.shakeIntensity[intensity] || 4;
        
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;
        
        this.effectsState.shakeInterval = setInterval(() => {
            const shakeX = (Math.random() - 0.5) * this.effectsState.currentIntensity;
            const shakeY = (Math.random() - 0.5) * this.effectsState.currentIntensity;
            gameContainer.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
        }, 50);
    }
    
    stopScreenShake() {
        if (!this.effectsState.isShaking) return;
        
        this.effectsState.isShaking = false;
        clearInterval(this.effectsState.shakeInterval);
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.transform = 'translate(0px, 0px)';
        }
    }
    
    startRedFlash() {
        if (this.effectsState.flashInterval) return;
        
        const gameScreen = document.getElementById('gameScreen');
        if (!gameScreen) return;
        
        this.effectsState.flashInterval = setInterval(() => {
            gameScreen.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            setTimeout(() => {
                gameScreen.style.backgroundColor = '';
            }, 100);
        }, 300);
    }
    
    startWarningFlash() {
        if (this.effectsState.flashInterval) return;
        
        const gameScreen = document.getElementById('gameScreen');
        if (!gameScreen) return;
        
        this.effectsState.flashInterval = setInterval(() => {
            gameScreen.style.backgroundColor = 'rgba(255, 165, 0, 0.08)';
            setTimeout(() => {
                gameScreen.style.backgroundColor = '';
            }, 150);
        }, 500);
    }
    
    stopFlash() {
        if (this.effectsState.flashInterval) {
            clearInterval(this.effectsState.flashInterval);
            this.effectsState.flashInterval = null;
        }
        
        const gameScreen = document.getElementById('gameScreen');
        if (gameScreen) {
            gameScreen.style.backgroundColor = '';
        }
    }
    
    createEmberParticles() {
        // Create floating ember particles for dramatic effect
        if (this.effectsState.particleInterval) return;
        
        this.effectsState.particleInterval = setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'ember-particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #ff6b35, #ff8c42);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * window.innerWidth}px;
                top: ${window.innerHeight + 10}px;
                animation: emberFloat 3s linear forwards;
                box-shadow: 0 0 6px #ff6b35;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }, 3000);
        }, 200);
    }
    
    triggerWarningShake(threshold) {
        // Trigger a quick shake effect for warnings
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;

          const adjustedThreshold = threshold * 1000;
          const dramatic = this.currentStyle === 'dramatic';
        
          const shakeIntensity = dramatic
                ? (adjustedThreshold <= 5000 ? 12 :
                    adjustedThreshold <= 10000 ? 8 :
                    adjustedThreshold <= 20000 ? 6 : 4)
                : (adjustedThreshold <= 5000 ? 5 :
                    adjustedThreshold <= 10000 ? 4 :
                    adjustedThreshold <= 20000 ? 3 : 2);
        
        let shakeCount = 0;
        const maxShakes = 6;
        
        const shakeInterval = setInterval(() => {
            if (shakeCount >= maxShakes) {
                clearInterval(shakeInterval);
                gameContainer.style.transform = 'translate(0px, 0px)';
                return;
            }
            
            const shakeX = (Math.random() - 0.5) * shakeIntensity;
            const shakeY = (Math.random() - 0.5) * shakeIntensity;
            gameContainer.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            shakeCount++;
        }, 50);
    }

    // Reset timer for new level
    reset() {
        this.stopTimer();
        this.hideCatastrophicOverlay();
        this.warningsShown = [];
        this.currentHabitat = null;
        
        // Clean up all effects
        this.stopScreenShake();
        this.stopFlash();
        if (this.effectsState.particleInterval) {
            clearInterval(this.effectsState.particleInterval);
            this.effectsState.particleInterval = null;
        }
    }

    applyProfile({ habitat, habitatProgress = {}, difficulty = 'medium', pace = 'balanced', style = 'gentle' } = {}) {
        const habitatTotal = habitat && habitatProgress[habitat]?.total
            ? Number(habitatProgress[habitat].total)
            : 12;
        const paceMultipliers = {
            relaxed: 1.25,
            balanced: 1.0,
            speedy: 0.85
        };
        const difficultyMultipliers = {
            easy: 1.15,
            medium: 1.0,
            hard: 0.9
        };

        const oldDuration = this.config.levelDuration;
        const oldRemaining = this.timeRemaining;
        const paceMultiplier = paceMultipliers[pace] || 1.0;
        const difficultyMultiplier = difficultyMultipliers[difficulty] || 1.0;

        // About 18 seconds per expected problem, then adjusted by pace+difficulty.
        const computedDuration = Math.round(habitatTotal * 18_000 * paceMultiplier * difficultyMultiplier);
        const levelDuration = Math.min(420_000, Math.max(150_000, computedDuration));

        const durationSeconds = Math.floor(levelDuration / 1000);
        const warningSeconds = [60, 45, 30, 20, 10, 5].filter((seconds) => seconds < durationSeconds);

        this.config.levelDuration = levelDuration;
        this.config.warningThresholds = warningSeconds.map((seconds) => seconds * 1000);
        this.config.urgencyThreshold = Math.max(30_000, Math.round(levelDuration * 0.45));
        this.config.criticalThreshold = Math.max(20_000, Math.round(levelDuration * 0.25));
        this.config.emergencyThreshold = Math.max(10_000, Math.round(levelDuration * 0.12));
        this.currentStyle = style === 'dramatic' ? 'dramatic' : 'gentle';

        if (this.isActive && oldDuration > 0) {
            const remainingRatio = Math.max(0, Math.min(1, oldRemaining / oldDuration));
            this.timeRemaining = Math.round(levelDuration * remainingRatio);
            this.startTime = Date.now() - (levelDuration - this.timeRemaining);
            this.warningsShown = [];
            this.updateTimerDisplay();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerManager;
}