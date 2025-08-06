// Rainbow Reserve Habitat for Times Table Animals
// Final habitat - Ultimate Challenge with clear instructions and simple gameplay

class RainbowReserve {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 25;
        this.nextProblemTimer = null;
        
        // Simplified rainbow elements
        this.rainbowAnimals = [];
        this.magicStars = [];
        this.celebrationActive = false;
        this.showedInstructions = false;
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('rainbowReserve');
        this.gameEngine.setBackground('rainbowReserve');
        this.isActive = true;
        
        // Create simplified environment
        this.createRainbowAnimals();
        this.createMagicStars();
        
        // Show welcome instructions first
        this.showWelcomeInstructions();
        
        // Start first problem after instructions
        setTimeout(() => {
            this.startNextProblem();
        }, 5000);
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    showWelcomeInstructions() {
        const instructions = {
            x: 600,
            y: 300,
            life: 8000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = Math.min(1, this.life / 8000);
                
                // Draw instruction box
                const gradient = ctx.createLinearGradient(this.x, this.y - 150, this.x, this.y + 150);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                gradient.addColorStop(1, 'rgba(255, 182, 193, 0.9)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#FF69B4';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.roundRect(this.x - 300, this.y - 150, 600, 300, 25);
                ctx.fill();
                ctx.stroke();
                
                // Title
                ctx.fillStyle = '#FF1493';
                ctx.font = 'bold 28px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('🌈 Welcome to Rainbow Reserve! 🌈', this.x, this.y - 100);
                
                // Instructions
                ctx.fillStyle = '#4B0082';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText('🎯 ULTIMATE CHALLENGE HABITAT 🎯', this.x, this.y - 60);
                
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.fillText('HOW TO PLAY:', this.x, this.y - 30);
                ctx.fillText('1. Answer 25 mixed math problems', this.x, this.y - 5);
                ctx.fillText('2. Problems get harder as you progress', this.x, this.y + 20);
                ctx.fillText('3. Click rainbow animals for encouragement', this.x, this.y + 45);
                ctx.fillText('4. Use q-w-e-r keys or click answers', this.x, this.y + 70);
                
                ctx.fillStyle = '#32CD32';
                ctx.font = 'bold 16px "Comic Sans MS", cursive';
                ctx.fillText('Ready? First problem coming up!', this.x, this.y + 110);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(instructions);
        this.showedInstructions = true;
    }

    createRainbowAnimals() {
        // Create simple, friendly rainbow animals for encouragement
        const animals = [
            { x: 200, y: 400, type: '🦄', color: '#FF69B4', message: 'You can do it!' },
            { x: 400, y: 450, type: '🐧', color: '#87CEEB', message: 'Keep going!' },
            { x: 600, y: 350, type: '🐘', color: '#DDA0DD', message: 'Great job!' },
            { x: 800, y: 420, type: '🐵', color: '#98FB98', message: 'Almost there!' },
            { x: 1000, y: 380, type: '🦁', color: '#F0E68C', message: 'You\'re amazing!' }
        ];

        animals.forEach((animalData, index) => {
            const animal = {
                x: animalData.x,
                y: animalData.y,
                type: animalData.type,
                color: animalData.color,
                message: animalData.message,
                bounceTime: Math.random() * 2000,
                originalY: animalData.y,
                
                update: function(deltaTime) {
                    this.bounceTime += deltaTime;
                    this.y = this.originalY + Math.sin(this.bounceTime / 1000) * 10;
                },
                
                onClick: () => {
                    this.showEncouragement(animalData.message, animalData.x, animalData.y);
                    if (this.audioManager) {
                        this.audioManager.playSFX('encouragement');
                    }
                },
                
                render: function(ctx) {
                    // Draw simple friendly animal
                    ctx.fillStyle = this.color;
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw animal emoji
                    ctx.font = '36px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.type, this.x, this.y + 10);
                }
            };
            
            this.rainbowAnimals.push(animal);
            this.gameEngine.addSprite(animal);
        });
    }

    createMagicStars() {
        // Create twinkling background stars
        for (let i = 0; i < 15; i++) {
            const star = {
                x: Math.random() * 1200,
                y: Math.random() * 200 + 50,
                size: Math.random() * 3 + 2,
                twinkle: Math.random() * 2000,
                color: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD'][Math.floor(Math.random() * 5)],
                
                update: function(deltaTime) {
                    this.twinkle += deltaTime;
                },
                
                render: function(ctx) {
                    const alpha = 0.5 + Math.sin(this.twinkle / 1000) * 0.5;
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = this.color;
                    ctx.font = `${this.size * 8}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.fillText('✨', this.x, this.y);
                    ctx.restore();
                }
            };
            
            this.magicStars.push(star);
            this.gameEngine.addSprite(star);
        }
    }

    showEncouragement(message, x, y) {
        const encouragement = {
            x: x,
            y: y - 60,
            message: message,
            life: 2000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.y -= deltaTime / 30;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                
                // Draw message bubble
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.strokeStyle = '#FF69B4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 60, this.y - 20, 120, 40, 20);
                ctx.fill();
                ctx.stroke();
                
                // Draw message
                ctx.fillStyle = '#4B0082';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.message, this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(encouragement);
    }

    startNextProblem() {
        if (this.problemsSolved >= this.totalProblems) {
            this.completeHabitat();
            return;
        }

        // Generate a mixed problem appropriate for the final challenge
        const problemTypes = [
            'addition', 'subtraction', 'multiplication', 'division', 
            'mixed_operations', 'word_problems', 'fractions', 'decimals'
        ];
        
        const selectedType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        this.currentProblem = this.mathEngine.generateProblem(selectedType, this.problemsSolved + 1);
        
        // Show current problem in the math UI
        this.showProblem();
        
        if (this.audioManager) {
            this.audioManager.playSFX('new-problem');
        }
    }

    showProblem() {
        // Use the game's existing math problem UI
        if (this.gameController && this.gameController.updateProblemUI) {
            this.gameController.updateProblemUI();
        }
        
        // Show progress
        const progressElement = document.getElementById('progressText');
        if (progressElement) {
            progressElement.textContent = `Problem ${this.problemsSolved + 1} of ${this.totalProblems}`;
        }
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const percentage = (this.problemsSolved / this.totalProblems) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        // Show math problem container
        const mathProblem = document.getElementById('mathProblem');
        if (mathProblem) {
            mathProblem.classList.remove('hidden');
        }
    }

    checkAnswer(selectedAnswer) {
        const isCorrect = this.mathEngine.checkAnswer(selectedAnswer);
        
        if (isCorrect) {
            this.onCorrectAnswer();
        } else {
            this.onIncorrectAnswer();
        }
        
        return isCorrect;
    }

    onCorrectAnswer() {
        this.problemsSolved++;
        this.celebrationActive = true;
        
        // Show celebration
        this.createCelebration();
        
        if (this.audioManager) {
            this.audioManager.playSFX('correct');
        }
        
        // Move to next problem after a short delay
        setTimeout(() => {
            this.celebrationActive = false;
            this.startNextProblem();
        }, 2000);
    }

    onIncorrectAnswer() {
        // Show encouragement
        this.showSimpleEncouragement();
        
        if (this.audioManager) {
            this.audioManager.playSFX('incorrect');
        }
    }

    createCelebration() {
        const celebration = {
            x: 600,
            y: 300,
            life: 2000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                
                // Simple celebration text
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#FF1493';
                ctx.lineWidth = 2;
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('🌈 CORRECT! 🌈', this.x, this.y);
                ctx.fillText('🌈 CORRECT! 🌈', this.x, this.y);
                
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillStyle = '#4B0082';
                const progress = Math.floor((this.problemsSolved / this.totalProblems) * 100);
                ctx.fillText(`Progress: ${progress}%`, this.x, this.y + 40);
                
                ctx.restore();
            }.bind(this)
        };
        
        this.gameEngine.addSprite(celebration);
    }

    showSimpleEncouragement() {
        const messages = [
            "Try again! You can do it! 💪",
            "Keep going! You're learning! 📚", 
            "Almost there! Think it through! 🤔",
            "No worries! Every mistake helps you learn! ⭐"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const encouragement = {
            x: 600,
            y: 350,
            message: message,
            life: 3000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                
                // Draw encouragement bubble
                ctx.fillStyle = 'rgba(255, 182, 193, 0.9)';
                ctx.strokeStyle = '#FF69B4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 150, this.y - 30, 300, 60, 20);
                ctx.fill();
                ctx.stroke();
                
                // Draw message
                ctx.fillStyle = '#4B0082';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.message, this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(encouragement);
    }

    completeHabitat() {
        this.isActive = false;
        
        // Create completion celebration
        this.createCompletionCelebration();
        
        if (this.audioManager) {
            this.audioManager.playSFX('habitat-complete');
        }
        
        // Notify game controller after celebration
        setTimeout(() => {
            if (this.gameController) {
                this.gameController.completeLevel();
            }
        }, 4000);
    }

    createCompletionCelebration() {
        const completion = {
            x: 600,
            y: 300,
            life: 6000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 6000;
                
                // Draw celebration
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#FF1493';
                ctx.lineWidth = 3;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('🌈 CONGRATULATIONS! 🌈', this.x, this.y - 50);
                ctx.fillText('🌈 CONGRATULATIONS! 🌈', this.x, this.y - 50);
                
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.fillStyle = '#4B0082';
                ctx.fillText('Rainbow Reserve Complete!', this.x, this.y);
                
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillStyle = '#32CD32';
                ctx.fillText('You\'ve mastered all 25 challenges!', this.x, this.y + 40);
                
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillStyle = '#FF69B4';
                ctx.fillText('🎉 Ultimate Math Champion! 🎉', this.x, this.y + 80);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(completion);
    }

    // Method called by GameController when continue button is clicked
    onContinueButtonClicked() {
        // This habitat handles its own progression
        // The continue button is handled by the math problem UI
    }

    cleanup() {
        // Clear timers
        if (this.nextProblemTimer) {
            clearTimeout(this.nextProblemTimer);
            this.nextProblemTimer = null;
        }
        
        // Remove all sprites
        [...this.rainbowAnimals, ...this.magicStars].forEach(sprite => {
            if (sprite && this.gameEngine) {
                this.gameEngine.removeSprite(sprite);
            }
        });
        
        // Clear arrays
        this.rainbowAnimals = [];
        this.magicStars = [];
        
        // Reset state
        this.isActive = false;
        this.currentProblem = null;
        this.celebrationActive = false;
    }

    update(deltaTime) {
        if (!this.isActive) return;
        
        // Simple update - no complex effects
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RainbowReserve;
}