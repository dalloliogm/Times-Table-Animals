// Timer Manager for Times Table Animals
// Handles level timers, warnings, and catastrophic events

class TimerManager {
    constructor(gameController, audioManager) {
        this.gameController = gameController;
        this.audioManager = audioManager;
        
        // Timer configuration
        this.config = {
            levelDuration: 240000, // 4 minutes in milliseconds
            warningThresholds: [238000, 234000, 230000, 225000, 200000, 180000, 160000, 140000, 120000, 100000, 80000, 60000, 45000, 30000, 20000, 10000, 5000],
            urgencyThreshold: 60000, // When to start urgency effects (1 minute)
            criticalThreshold: 30000, // When to start critical effects (30 seconds)
            emergencyThreshold: 10000, // When to start emergency effects (10 seconds)
            shakeIntensity: {
                mild: 2,
                moderate: 4,
                intense: 8,
                extreme: 16
            }
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

        // Enhanced dramatic effects based on time remaining
        const timerContainer = document.getElementById('timerContainer');
        if (timerContainer) {
            if (this.timeRemaining <= this.config.emergencyThreshold) {
                timerContainer.classList.add('pulsing', 'emergency');
                this.startScreenShake('extreme');
                this.startRedFlash();
            } else if (this.timeRemaining <= this.config.criticalThreshold) {
                timerContainer.classList.add('pulsing', 'critical');
                this.startScreenShake('intense');
                this.startWarningFlash();
            } else if (this.timeRemaining <= this.config.urgencyThreshold) {
                timerContainer.classList.add('pulsing', 'urgent');
                this.startScreenShake('moderate');
            } else {
                timerContainer.classList.remove('pulsing', 'emergency', 'critical', 'urgent');
                this.stopScreenShake();
                this.stopFlash();
            }
        }
        
        // Add particle effects for critical moments
        if (this.timeRemaining <= this.config.emergencyThreshold) {
            this.createEmberParticles();
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
        
        // Play enhanced warning sounds based on urgency
        if (this.audioManager) {
            if (threshold <= 5000) {
                this.audioManager.playSFX('timer-warning-emergency');
                this.audioManager.playSFX('danger-siren');
            } else if (threshold <= 10000) {
                this.audioManager.playSFX('timer-warning-critical');
                this.audioManager.playSFX('volcano-rumble');
            } else if (threshold <= 20000) {
                this.audioManager.playSFX('timer-warning-urgent');
                this.audioManager.playSFX('ground-shake');
            } else if (threshold <= 30000) {
                this.audioManager.playSFX('timer-warning');
                this.audioManager.playSFX('earthquake');
            } else {
                this.audioManager.playSFX('timer-warning');
            }
        }

        // Show visual warning
        this.createWarningEffect(threshold);
        
        // Add screen shake for more dramatic effect
        this.triggerWarningShake(threshold);
    }

    createWarningEffect(threshold) {
        // Enhanced volcanic-themed warning messages
        const warningMessages = {
            60000: { text: 'The volcano is rumbling! 1 minute left!', icon: '🌋', class: 'warning-mild' },
            45000: { text: 'Smoke rising from the crater! 45 seconds!', icon: '💨', class: 'warning-moderate' },
            30000: { text: 'Lava bubbling! 30 seconds left!', icon: '🔥', class: 'warning-urgent' },
            20000: { text: 'Ground shaking! 20 seconds!', icon: '⚡', class: 'warning-critical' },
            10000: { text: 'VOLCANO ABOUT TO ERUPT! 10 seconds!', icon: '🌋', class: 'warning-emergency' },
            5000: { text: 'ERUPTION IMMINENT! 5 SECONDS!', icon: '💥', class: 'warning-panic' }
        };

        const warningData = warningMessages[threshold] || {
            text: 'Danger! A Volcano is going to erupt!<br>The only way to save the animals is to solve maths problems!',
            icon: '⚠️',
            class: 'warning-default'
        };

        // Create enhanced warning popup
        const warning = document.createElement('div');
        warning.className = `timer-warning-popup ${warningData.class}`;
        warning.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">${warningData.icon}</span>
                <span class="warning-text">${warningData.text}</span>
            </div>
        `;

        document.body.appendChild(warning);

        // Enhanced animation with scaling and rotation
        setTimeout(() => {
            warning.classList.add('show');
        }, 10);

        // Keep emergency warnings visible longer
        const displayTime = threshold <= 10000 ? 3000 : 2000;
        setTimeout(() => {
            warning.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(warning)) {
                    document.body.removeChild(warning);
                }
            }, 300);
        }, displayTime);
    }

    triggerCatastrophicEvent() {
        console.log(`TimerManager: Triggering catastrophic event for ${this.currentHabitat}`);
        
        this.stopTimer();
        
        // Stop all ongoing effects
        this.stopScreenShake();
        this.stopFlash();
        
        // Play enhanced catastrophic sounds sequence
        if (this.audioManager) {
            this.audioManager.playSFX('volcanic-explosion');
            setTimeout(() => this.audioManager.playSFX('catastrophic-event'), 500);
            setTimeout(() => this.audioManager.playSFX('earthquake'), 1000);
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
        const maxShakes = 30; // Longer shake sequence
        let currentIntensity = 20; // Start with intense shake
        
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
        
        const shakeIntensity = threshold <= 5000 ? 12 :
                              threshold <= 10000 ? 8 :
                              threshold <= 20000 ? 6 : 4;
        
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
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerManager;
}