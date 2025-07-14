// Bunny Meadow Habitat for Times Table Animals
// First habitat focusing on addition and subtraction

class BunnyMeadow {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 10;
        this.nextProblemTimer = null;
        
        // Habitat elements
        this.bunnies = [];
        this.carrots = [];
        this.flowers = [];
        this.lettuce = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('bunnyMeadow');
        this.gameEngine.setBackground('bunnyMeadow');
        
        // Create the meadow environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createBunnies();
        this.createDecorations();
        this.addInteractiveElements();
    }

    createBunnies() {
        // Create main bunny characters
        const bunnyPositions = [
            { x: 150, y: 200, name: 'Hoppy' },
            { x: 300, y: 350, name: 'Fluffy' },
            { x: 500, y: 180, name: 'Cottontail' },
            { x: 700, y: 320, name: 'Whiskers' },
            { x: 900, y: 250, name: 'Snowball' }
        ];

        bunnyPositions.forEach((pos, index) => {
            const bunny = this.gameEngine.createSprite('bunny', pos.x, pos.y);
            bunny.name = pos.name;
            bunny.id = `bunny_${index}`;
            bunny.isHopping = false;
            bunny.hopCooldown = Math.random() * 3000 + 2000;
            bunny.originalY = pos.y;
            bunny.happiness = 100;
            bunny.isHungry = false;
            
            // Add bunny behavior
            bunny.update = (deltaTime) => {
                this.updateBunny(bunny, deltaTime);
            };
            
            bunny.onClick = () => {
                this.onBunnyClick(bunny);
            };
            
            this.bunnies.push(bunny);
            this.gameEngine.addSprite(bunny);
        });
    }

    updateBunny(bunny, deltaTime) {
        // Handle hopping animation
        bunny.hopCooldown -= deltaTime;
        
        if (bunny.hopCooldown <= 0 && !bunny.isHopping) {
            bunny.isHopping = true;
            bunny.hopCooldown = Math.random() * 4000 + 3000;
            bunny.hopAnimationTime = 0;
        }
        
        if (bunny.isHopping) {
            bunny.hopAnimationTime += deltaTime;
            const hopProgress = bunny.hopAnimationTime / 600; // 600ms hop duration
            
            if (hopProgress <= 1) {
                // Sine wave for hopping motion
                bunny.y = bunny.originalY - Math.sin(hopProgress * Math.PI) * 20;
            } else {
                bunny.isHopping = false;
                bunny.y = bunny.originalY;
                bunny.hopAnimationTime = 0;
            }
        }
        
        // Handle emotional states
        if (bunny.isHungry) {
            bunny.happiness = Math.max(0, bunny.happiness - deltaTime / 100);
        } else {
            bunny.happiness = Math.min(100, bunny.happiness + deltaTime / 200);
        }
        
        // Visual feedback based on happiness
        if (bunny.happiness < 50) {
            bunny.velocity.x = Math.sin(this.gameEngine.gameTime / 1000) * 10;
        } else {
            bunny.velocity.x = 0;
        }
    }

    onBunnyClick(bunny) {
        if (this.audioManager) {
            this.audioManager.playSFX('bunny-hop');
        }
        
        // Make bunny hop
        bunny.isHopping = true;
        bunny.hopCooldown = 0;
        bunny.hopAnimationTime = 0;
        
        // Show bunny's name
        this.showBunnyName(bunny);
        
        // Increase happiness
        bunny.happiness = Math.min(100, bunny.happiness + 10);
    }

    showBunnyName(bunny) {
        // Create floating text showing bunny's name
        const nameSprite = {
            x: bunny.x + 30,
            y: bunny.y - 30,
            text: bunny.name,
            life: 2000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 2000);
                this.y -= deltaTime / 20;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#FF69B4';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(nameSprite);
    }

    createDecorations() {
        // Add flowers
        const flowerPositions = [
            { x: 100, y: 450 }, { x: 250, y: 500 }, { x: 400, y: 470 },
            { x: 600, y: 520 }, { x: 800, y: 480 }, { x: 950, y: 460 },
            { x: 120, y: 600 }, { x: 350, y: 650 }, { x: 550, y: 630 },
            { x: 750, y: 620 }, { x: 900, y: 580 }
        ];

        flowerPositions.forEach((pos, index) => {
            const flower = {
                x: pos.x,
                y: pos.y,
                type: 'flower',
                color: ['#FF69B4', '#FFD700', '#FF6347', '#9370DB'][index % 4],
                size: Math.random() * 10 + 8,
                swayTime: Math.random() * 1000,
                
                update: function(deltaTime) {
                    this.swayTime += deltaTime;
                },
                
                render: function(ctx) {
                    const sway = Math.sin(this.swayTime / 1000) * 2;
                    ctx.save();
                    ctx.translate(this.x + sway, this.y);
                    
                    // Draw flower
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw center
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            };
            
            this.flowers.push(flower);
            this.gameEngine.addSprite(flower);
        });
        
        // Add grass patches
        for (let i = 0; i < 20; i++) {
            const grass = {
                x: Math.random() * 1200,
                y: Math.random() * 200 + 600,
                type: 'grass',
                
                render: function(ctx) {
                    ctx.fillStyle = '#32CD32';
                    ctx.fillRect(this.x, this.y, 3, 10);
                    ctx.fillRect(this.x + 2, this.y - 2, 3, 8);
                    ctx.fillRect(this.x + 4, this.y + 1, 3, 9);
                }
            };
            
            this.gameEngine.addSprite(grass);
        }
    }

    addInteractiveElements() {
        // Add carrot garden
        this.createCarrotGarden();
        
        // Add lettuce patch
        this.createLettucePatch();
        
        // Add feeding bowl
        this.createFeedingBowl();
    }

    createCarrotGarden() {
        const gardenX = 50;
        const gardenY = 400;
        const rows = 3;
        const cols = 5;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const carrot = this.gameEngine.createSprite('carrot', 
                    gardenX + col * 40, 
                    gardenY + row * 40);
                
                carrot.isGrown = Math.random() > 0.3;
                carrot.growthTime = Math.random() * 5000;
                carrot.isHarvestable = carrot.isGrown;
                
                carrot.update = (deltaTime) => {
                    if (!carrot.isGrown) {
                        carrot.growthTime -= deltaTime;
                        if (carrot.growthTime <= 0) {
                            carrot.isGrown = true;
                            carrot.isHarvestable = true;
                        }
                    }
                };
                
                carrot.onClick = () => {
                    if (carrot.isHarvestable) {
                        this.harvestCarrot(carrot);
                    }
                };
                
                this.carrots.push(carrot);
                this.gameEngine.addSprite(carrot);
            }
        }
    }

    createLettucePatch() {
        const lettucePositions = [
            { x: 1000, y: 400 }, { x: 1040, y: 420 }, { x: 1080, y: 400 },
            { x: 1020, y: 450 }, { x: 1060, y: 470 }, { x: 1100, y: 450 }
        ];

        lettucePositions.forEach(pos => {
            const lettuce = {
                x: pos.x,
                y: pos.y,
                type: 'lettuce',
                isHarvestable: true,
                
                onClick: () => {
                    this.harvestLettuce(lettuce);
                },
                
                render: function(ctx) {
                    ctx.fillStyle = '#90EE90';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 15, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = '#228B22';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 10, 7, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            this.lettuce.push(lettuce);
            this.gameEngine.addSprite(lettuce);
        });
    }

    createFeedingBowl() {
        const bowl = {
            x: 600,
            y: 500,
            type: 'bowl',
            foodCount: 0,
            
            render: function(ctx) {
                // Draw bowl
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, 30, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw food if any
                if (this.foodCount > 0) {
                    ctx.fillStyle = '#FFA500';
                    for (let i = 0; i < this.foodCount; i++) {
                        const angle = (i / this.foodCount) * Math.PI * 2;
                        const fx = this.x + Math.cos(angle) * 15;
                        const fy = this.y + Math.sin(angle) * 10;
                        ctx.beginPath();
                        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        };
        
        this.gameEngine.addSprite(bowl);
    }

    harvestCarrot(carrot) {
        if (this.audioManager) {
            this.audioManager.playSFX('correct');
        }
        
        // Remove carrot
        this.gameEngine.removeSprite(carrot);
        const index = this.carrots.indexOf(carrot);
        if (index > -1) {
            this.carrots.splice(index, 1);
        }
        
        // Add particles
        this.gameEngine.createCelebrationParticles(carrot.x, carrot.y);
        
        // Make nearby bunnies happy
        this.bunnies.forEach(bunny => {
            const distance = Math.sqrt(
                Math.pow(bunny.x - carrot.x, 2) + 
                Math.pow(bunny.y - carrot.y, 2)
            );
            
            if (distance < 100) {
                bunny.happiness = Math.min(100, bunny.happiness + 20);
                bunny.isHungry = false;
            }
        });
    }

    harvestLettuce(lettuce) {
        if (this.audioManager) {
            this.audioManager.playSFX('correct');
        }
        
        // Remove lettuce
        this.gameEngine.removeSprite(lettuce);
        const index = this.lettuce.indexOf(lettuce);
        if (index > -1) {
            this.lettuce.splice(index, 1);
        }
        
        // Add particles
        this.gameEngine.createCelebrationParticles(lettuce.x, lettuce.y);
    }

    startNextProblem() {
        // Clear any existing timeout to prevent double problem generation
        if (this.nextProblemTimer) {
            clearTimeout(this.nextProblemTimer);
            this.nextProblemTimer = null;
        }
        
        // Generate new problem
        this.currentProblem = this.mathEngine.generateProblem();
        this.problemStartTime = Date.now();
        
        // Update UI
        this.updateProblemDisplay();
        
        // Add visual elements for the problem
        this.addProblemVisuals();
        
        // Play audio
        if (this.audioManager) {
            this.audioManager.playSFX('problem-appear');
        }
        
        // Ensure GameController has the same problem reference
        if (this.gameController && this.gameController.mathEngine) {
            this.gameController.mathEngine.currentProblem = this.currentProblem;
        }
    }

    updateProblemDisplay() {
        // Update DOM elements
        const problemTitle = document.getElementById('problemTitle');
        const problemText = document.getElementById('problemText');
        const feedback = document.getElementById('feedback');
        
        if (problemTitle) problemTitle.textContent = this.currentProblem.title;
        if (problemText) problemText.textContent = this.currentProblem.text;
        if (feedback) feedback.classList.add('hidden');
        
        // Update answer options with generated choices
        this.updateAnswerOptions();
        
        // Also update the GameController's answer options
        if (this.gameController && this.gameController.updateAnswerOptions) {
            this.gameController.updateAnswerOptions();
        }
        
        // Update progress indicator
        this.updateProgressIndicator();
        
        // Show problem UI
        const mathProblem = document.getElementById('mathProblem');
        if (mathProblem) {
            mathProblem.classList.remove('hidden');
        }
    }

    updateAnswerOptions() {
        if (!this.currentProblem || !this.currentProblem.options) return;
        
        this.currentProblem.options.forEach((option, index) => {
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
    
    updateProgressIndicator() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            const percentage = (this.problemsSolved / this.totalProblems) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Problem ${this.problemsSolved + 1} of ${this.totalProblems}`;
        }
    }

    addProblemVisuals() {
        // Clear previous problem visuals
        this.clearProblemVisuals();
        
        // Add visuals based on problem type
        if (this.currentProblem.type === 'addition') {
            this.addAdditionVisuals();
        } else if (this.currentProblem.type === 'subtraction') {
            this.addSubtractionVisuals();
        }
    }

    addAdditionVisuals() {
        const numbers = this.currentProblem.operation.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const a = parseInt(numbers[0]);
            const b = parseInt(numbers[1]);
            
            // Create visual groups
            this.createVisualGroup(a, 300, 200, 'carrot');
            this.createVisualGroup(b, 500, 200, 'carrot');
            
            // Add plus sign
            const plusSign = {
                x: 450,
                y: 220,
                type: 'plus',
                render: function(ctx) {
                    ctx.fillStyle = '#FF6B6B';
                    ctx.font = '32px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('+', this.x, this.y);
                }
            };
            plusSign.isProblemVisual = true;
            this.gameEngine.addSprite(plusSign);
        }
    }

    addSubtractionVisuals() {
        const numbers = this.currentProblem.operation.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const a = parseInt(numbers[0]);
            const b = parseInt(numbers[1]);
            
            // Create visual group showing subtraction
            this.createVisualGroup(a, 300, 200, 'carrot', b);
            
            // Add minus sign
            const minusSign = {
                x: 450,
                y: 220,
                type: 'minus',
                render: function(ctx) {
                    ctx.fillStyle = '#FF6B6B';
                    ctx.font = '32px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('-', this.x, this.y);
                }
            };
            minusSign.isProblemVisual = true;
            this.gameEngine.addSprite(minusSign);
        }
    }

    createVisualGroup(count, startX, startY, spriteType, fadedCount = 0) {
        const itemsPerRow = 5;
        const itemSpacing = 35;
        const rowSpacing = 40;
        
        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / itemsPerRow);
            const col = i % itemsPerRow;
            
            const x = startX + col * itemSpacing;
            const y = startY + row * rowSpacing;
            
            const sprite = this.gameEngine.createSprite(spriteType, x, y);
            sprite.isProblemVisual = true;
            
            // Make some items faded for subtraction
            if (i < fadedCount) {
                sprite.opacity = 0.3;
                sprite.isFaded = true;
            }
            
            // Add entrance animation
            sprite.originalY = y;
            sprite.y = y - 50;
            sprite.animationTime = i * 100; // Stagger animation
            
            sprite.update = function(deltaTime) {
                if (this.animationTime > 0) {
                    this.animationTime -= deltaTime;
                } else {
                    this.y = Math.min(this.originalY, this.y + deltaTime / 10);
                }
            };
            
            this.gameEngine.addSprite(sprite);
        }
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`BunnyMeadow: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
        const isCorrect = this.mathEngine.checkAnswer(userAnswer);
        
        if (isCorrect) {
            this.onCorrectAnswer();
            
            // GameController handles progress updates and audio
            if (this.gameController) {
                this.gameController.audioManager.playSFX('correct');
            }
        } else {
            this.onIncorrectAnswer();
            
            if (this.gameController) {
                this.gameController.audioManager.playSFX('incorrect');
            }
        }
        
        return isCorrect;
    }

    onCorrectAnswer() {
        this.problemsSolved++;
        console.log(`Bunny Meadow: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
        if (this.audioManager) {
            this.audioManager.playSFX('correct');
            this.audioManager.playVoice('celebration');
        }
        
        // Update progress indicator immediately
        this.updateProgressIndicator();
        
        // Celebration animation
        this.startCelebration();
        
        // Clear problem visuals
        this.clearProblemVisuals();
        
        // Check if habitat is complete
        if (this.problemsSolved >= this.totalProblems) {
            // Let GameController handle completion
            if (this.gameController) {
                this.gameController.completeLevel();
            }
        } else {
            // Schedule next problem, but allow Continue button to override
            this.nextProblemTimer = setTimeout(() => {
                this.startNextProblem();
            }, 3000);
        }
    }

    onIncorrectAnswer() {
        if (this.audioManager) {
            this.audioManager.playSFX('incorrect');
        }
        
        // Show hint after wrong answer
        setTimeout(() => {
            this.showHint();
        }, 1000);
    }

    startCelebration() {
        this.celebrationActive = true;
        
        // Make all bunnies hop
        this.bunnies.forEach(bunny => {
            bunny.isHopping = true;
            bunny.hopCooldown = 0;
            bunny.happiness = 100;
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add more particles around bunnies
        this.bunnies.forEach(bunny => {
            this.gameEngine.createCelebrationParticles(bunny.x, bunny.y);
        });
        
        // Stop celebration after 2 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 2000);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble
        const hintBubble = {
            x: 600,
            y: 100,
            text: hint,
            life: 5000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life < 1000) {
                    this.opacity = this.life / 1000;
                }
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw bubble
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.strokeStyle = '#4ECDC4';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 30, 200, 60, 20);
                ctx.fill();
                ctx.stroke();
                
                // Draw text
                ctx.fillStyle = '#333';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x, this.y);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(hintBubble);
    }

    completeHabitat() {
        // Play completion sound
        if (this.audioManager) {
            this.audioManager.playSFX('badge-earned');
            this.audioManager.playVoice('badge-earned');
        }
        
        // Show completion message
        const completionMessage = {
            x: 600,
            y: 300,
            text: 'Habitat Complete!',
            subtext: 'The bunnies are so happy!',
            life: 5000,
            opacity: 1,
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, 1200, 800);
                
                // Draw main text
                ctx.fillStyle = '#FFD700';
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x, this.y);
                
                // Draw subtext
                ctx.fillStyle = '#FFF';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillText(this.subtext, this.x, this.y + 50);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(completionMessage);
        
        // Return to habitat selection after celebration
        setTimeout(() => {
            this.returnToHabitatSelection();
        }, 5000);
    }

    returnToHabitatSelection() {
        // This would be handled by the main game controller
        // For now, just log the completion
        console.log('Bunny Meadow completed! Returning to habitat selection...');
    }

    onContinueButtonClicked() {
        // Clear any pending timer
        if (this.nextProblemTimer) {
            clearTimeout(this.nextProblemTimer);
            this.nextProblemTimer = null;
        }
        
        // Start next problem immediately
        if (this.problemsSolved < this.totalProblems) {
            this.startNextProblem();
        }
    }

    update(deltaTime) {
        // Update all habitat-specific logic
        this.bunnies.forEach(bunny => {
            if (bunny.update) {
                bunny.update(deltaTime);
            }
        });
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 60000) { // 1 minute timeout
                this.showHint();
                this.problemStartTime = Date.now(); // Reset timer
            }
        }
    }

    getProgress() {
        return {
            solved: this.problemsSolved,
            total: this.totalProblems,
            percentage: (this.problemsSolved / this.totalProblems) * 100
        };
    }

    cleanup() {
        // Clean up habitat resources
        this.bunnies = [];
        this.carrots = [];
        this.flowers = [];
        this.lettuce = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BunnyMeadow;
}