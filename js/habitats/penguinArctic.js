// Penguin Arctic Habitat for Times Table Animals
// Third habitat focusing on multiplication and simple division

class PenguinArctic {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 12;
        this.nextProblemTimer = null;
        
        // Habitat elements
        this.penguins = [];
        this.icebergs = [];
        this.fish = [];
        this.fishingHoles = [];
        this.igloo = null;
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Arctic environment
        this.snowflakes = [];
        this.auroraColors = ['#00FF87', '#60A5FA', '#A78BFA', '#F472B6'];
        this.auroraTime = 0;
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('penguinArctic');
        this.gameEngine.setBackground('penguinArctic');
        
        // Create the arctic environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createPenguinColony();
        this.createIceFeatures();
        this.createWeatherEffects();
        this.addInteractiveElements();
    }

    createPenguinColony() {
        // Create penguins in groups for multiplication
        const colonyPositions = [
            { x: 150, y: 300, name: 'Captain' },
            { x: 300, y: 250, name: 'Scout' },
            { x: 450, y: 320, name: 'Fisher' },
            { x: 600, y: 280, name: 'Hunter' },
            { x: 750, y: 350, name: 'Explorer' },
            { x: 900, y: 270, name: 'Leader' },
            { x: 200, y: 400, name: 'Diver' },
            { x: 500, y: 180, name: 'Swimmer' },
            { x: 800, y: 420, name: 'Climber' },
            { x: 350, y: 480, name: 'Jumper' },
            { x: 650, y: 150, name: 'Slider' },
            { x: 950, y: 380, name: 'Waddler' }
        ];

        colonyPositions.forEach((pos, index) => {
            const penguin = this.gameEngine.createSprite('penguin', pos.x, pos.y);
            penguin.name = pos.name;
            penguin.id = `penguin_${index}`;
            penguin.isWaddling = false;
            penguin.waddleCooldown = Math.random() * 3000 + 2000;
            penguin.originalX = pos.x;
            penguin.originalY = pos.y;
            penguin.happiness = 100;
            penguin.fishCaught = 0;
            
            // Add penguin behavior
            penguin.update = (deltaTime) => {
                this.updatePenguin(penguin, deltaTime);
            };
            
            penguin.onClick = () => {
                this.onPenguinClick(penguin);
            };
            
            this.penguins.push(penguin);
            this.gameEngine.addSprite(penguin);
        });
    }

    updatePenguin(penguin, deltaTime) {
        // Handle waddle animation
        penguin.waddleCooldown -= deltaTime;
        
        if (penguin.waddleCooldown <= 0 && !penguin.isWaddling) {
            penguin.isWaddling = true;
            penguin.waddleCooldown = Math.random() * 4000 + 3000;
            penguin.waddleAnimationTime = 0;
            penguin.waddleDirection = Math.random() > 0.5 ? 1 : -1;
        }
        
        if (penguin.isWaddling) {
            penguin.waddleAnimationTime += deltaTime;
            const waddleProgress = penguin.waddleAnimationTime / 1500; // 1.5 second waddle
            
            if (waddleProgress <= 1) {
                // Waddle side to side
                const waddleOffset = Math.sin(waddleProgress * Math.PI * 3) * 15;
                penguin.x = penguin.originalX + waddleOffset * penguin.waddleDirection;
                
                // Bob up and down
                const bobOffset = Math.sin(waddleProgress * Math.PI * 6) * 3;
                penguin.y = penguin.originalY + bobOffset;
            } else {
                penguin.isWaddling = false;
                penguin.x = penguin.originalX;
                penguin.y = penguin.originalY;
            }
        }
        
        // Happiness effects
        if (penguin.happiness > 80) {
            // Happy penguins waddle more frequently
            penguin.waddleCooldown = Math.max(penguin.waddleCooldown - deltaTime / 3, 0);
        }
    }

    onPenguinClick(penguin) {
        if (this.audioManager) {
            this.audioManager.playSFX('penguin-call');
        }
        
        // Make penguin waddle
        penguin.isWaddling = true;
        penguin.waddleAnimationTime = 0;
        
        // Show penguin's name and fish count
        this.showPenguinInfo(penguin);
        
        // Increase happiness
        penguin.happiness = Math.min(100, penguin.happiness + 10);
        
        // Sometimes catch a fish
        if (Math.random() > 0.7) {
            penguin.fishCaught++;
            this.createFishCatchAnimation(penguin.x, penguin.y);
        }
    }

    showPenguinInfo(penguin) {
        const infoSprite = {
            x: penguin.x + 20,
            y: penguin.y - 50,
            text: `${penguin.name}\n🐟 ${penguin.fishCaught}`,
            life: 2000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 2000);
                this.y -= deltaTime / 30;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#00BFFF';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.strokeText(line, this.x, this.y + index * 16);
                    ctx.fillText(line, this.x, this.y + index * 16);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(infoSprite);
    }

    createIceFeatures() {
        // Create icebergs for grouping exercises
        const icebergPositions = [
            { x: 100, y: 500 }, { x: 300, y: 520 }, { x: 500, y: 480 },
            { x: 700, y: 540 }, { x: 900, y: 500 }, { x: 1100, y: 520 }
        ];

        icebergPositions.forEach((pos, index) => {
            const iceberg = {
                x: pos.x,
                y: pos.y,
                type: 'iceberg',
                width: 80,
                height: 60,
                capacity: Math.floor(Math.random() * 4) + 2, // 2-5 capacity
                currentCount: 0,
                
                onClick: () => {
                    this.onIcebergClick(iceberg);
                },
                
                render: function(ctx) {
                    // Draw main iceberg
                    ctx.fillStyle = '#E0F6FF';
                    ctx.strokeStyle = '#87CEEB';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(this.x + this.width/2, this.y + this.height/2, 
                               this.width/2, this.height/2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw ice texture
                    ctx.fillStyle = '#B0E0E6';
                    ctx.fillRect(this.x + 10, this.y + 15, 15, 8);
                    ctx.fillRect(this.x + 35, this.y + 25, 12, 6);
                    ctx.fillRect(this.x + 55, this.y + 18, 10, 7);
                    
                    // Show capacity
                    ctx.fillStyle = '#000080';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.currentCount}/${this.capacity}`, 
                        this.x + this.width/2, this.y + this.height/2);
                }
            };
            
            this.icebergs.push(iceberg);
            this.gameEngine.addSprite(iceberg);
        });

        // Create fishing holes for division
        const holePositions = [
            { x: 200, y: 650 }, { x: 450, y: 630 }, { x: 700, y: 660 },
            { x: 950, y: 640 }
        ];

        holePositions.forEach(pos => {
            const hole = {
                x: pos.x,
                y: pos.y,
                type: 'fishing_hole',
                fishCount: Math.floor(Math.random() * 15) + 5,
                totalCaught: 0,
                
                onClick: () => {
                    this.onFishingHoleClick(hole);
                },
                
                render: function(ctx) {
                    // Draw hole
                    ctx.fillStyle = '#000080';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 30, 20, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw fish swimming (show fewer as they get caught)
                    ctx.fillStyle = '#FFD700';
                    const visibleFish = Math.min(this.fishCount, 6);
                    for (let i = 0; i < visibleFish; i++) {
                        const angle = (i / visibleFish) * Math.PI * 2;
                        const fishX = this.x + Math.cos(angle) * 20;
                        const fishY = this.y + Math.sin(angle) * 12;
                        ctx.beginPath();
                        ctx.ellipse(fishX, fishY, 4, 2, angle, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Show fish count
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🐟 ${this.fishCount}`, this.x, this.y + 35);
                }
            };
            
            this.fishingHoles.push(hole);
            this.gameEngine.addSprite(hole);
        });
    }

    createWeatherEffects() {
        // Create snowflakes
        for (let i = 0; i < 25; i++) {
            const snowflake = {
                x: Math.random() * 1200,
                y: Math.random() * 800,
                size: Math.random() * 4 + 2,
                speed: Math.random() * 40 + 20,
                drift: Math.random() * 15 - 7,
                opacity: Math.random() * 0.6 + 0.4,
                
                update: function(deltaTime) {
                    this.y += this.speed * deltaTime / 1000;
                    this.x += this.drift * deltaTime / 1000;
                    
                    if (this.y > 800) {
                        this.y = -10;
                        this.x = Math.random() * 1200;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            };
            
            this.snowflakes.push(snowflake);
            this.gameEngine.addSprite(snowflake);
        }

        // Create northern lights
        const aurora = {
            x: 0,
            y: 0,
            time: 0,
            colors: this.auroraColors,
            
            update: function(deltaTime) {
                this.time += deltaTime;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = 0.4;
                
                // Draw aurora bands
                for (let i = 0; i < 4; i++) {
                    const waveOffset = Math.sin((this.time / 2000) + i) * 30;
                    const gradient = ctx.createLinearGradient(0, 40 + i * 30, 1200, 120 + i * 30);
                    gradient.addColorStop(0, 'transparent');
                    gradient.addColorStop(0.3, this.colors[i % this.colors.length]);
                    gradient.addColorStop(0.7, this.colors[(i + 1) % this.colors.length]);
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 40 + i * 30 + waveOffset, 1200, 25);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(aurora);
    }

    addInteractiveElements() {
        // Create igloo for problem visualization
        this.createIgloo();
        
        // Create ice counting blocks
        this.createCountingBlocks();
    }

    createIgloo() {
        this.igloo = {
            x: 50,
            y: 150,
            type: 'igloo',
            width: 100,
            height: 80,
            
            render: function(ctx) {
                // Draw igloo
                ctx.fillStyle = '#F0F8FF';
                ctx.strokeStyle = '#B0C4DE';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + this.height, this.width/2, Math.PI, 0);
                ctx.fill();
                ctx.stroke();
                
                // Draw entrance
                ctx.fillStyle = '#000080';
                ctx.fillRect(this.x + this.width/2 - 15, this.y + this.height - 25, 30, 25);
                
                // Draw ice blocks pattern
                ctx.strokeStyle = '#87CEEB';
                ctx.lineWidth = 1;
                for (let i = 0; i < 5; i++) {
                    const y = this.y + this.height - 10 - i * 12;
                    const width = this.width - i * 8;
                    ctx.strokeRect(this.x + i * 4, y, width, 10);
                }
            }
        };
        
        this.gameEngine.addSprite(this.igloo);
    }

    createCountingBlocks() {
        // Create ice blocks for counting and grouping
        for (let i = 0; i < 20; i++) {
            const block = {
                x: 150 + (i % 10) * 35,
                y: 600 + Math.floor(i / 10) * 40,
                type: 'ice_block',
                width: 25,
                height: 25,
                isSelected: false,
                
                onClick: () => {
                    this.onCountingBlockClick(block);
                },
                
                render: function(ctx) {
                    ctx.fillStyle = this.isSelected ? '#00BFFF' : '#E0F6FF';
                    ctx.strokeStyle = '#87CEEB';
                    ctx.lineWidth = 2;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                    
                    if (this.isSelected) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '16px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText('✓', this.x + this.width/2, this.y + this.height/2 + 5);
                    }
                }
            };
            
            this.gameEngine.addSprite(block);
        }
    }

    onIcebergClick(iceberg) {
        if (this.audioManager) {
            this.audioManager.playSFX('ice-crack');
        }
        
        if (iceberg.currentCount < iceberg.capacity) {
            iceberg.currentCount++;
        } else {
            iceberg.currentCount = 0;
        }
    }

    onFishingHoleClick(hole) {
        if (this.audioManager) {
            this.audioManager.playSFX('splash');
        }
        
        if (hole.fishCount > 0) {
            hole.fishCount--;
            hole.totalCaught++;
            this.createFishCatchAnimation(hole.x, hole.y);
        }
    }

    onCountingBlockClick(block) {
        if (this.audioManager) {
            this.audioManager.playSFX('correct');
        }
        
        block.isSelected = !block.isSelected;
    }

    createFishCatchAnimation(x, y) {
        const fishSprite = {
            x: x,
            y: y,
            life: 1500,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.y -= deltaTime / 8;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 1500;
                ctx.fillStyle = '#FFD700';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('🐟', this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(fishSprite);
    }

    startNextProblem() {
        // Clear any existing timeout
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
        if (problemText) {
            // Use innerHTML with highlighted numbers
            const highlightedText = this.mathEngine.highlightNumbers(this.currentProblem.text);
            problemText.innerHTML = highlightedText;
        }
        if (feedback) feedback.classList.add('hidden');
        
        // Update answer options
        this.updateAnswerOptions();
        
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
        if (this.currentProblem.type === 'multiplication') {
            this.addMultiplicationVisuals();
        } else if (this.currentProblem.type === 'division') {
            this.addDivisionVisuals();
        }
    }

    addMultiplicationVisuals() {
        const numbers = this.currentProblem.operation.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const a = parseInt(numbers[0]);
            const b = parseInt(numbers[1]);
            
            // Create visual groups of penguins
            this.createMultiplicationGroups(a, b, 350, 100);
            
            // Add multiplication sign
            const multiplySign = {
                x: 500,
                y: 180,
                type: 'multiply',
                render: function(ctx) {
                    ctx.fillStyle = '#FF6B6B';
                    ctx.font = '32px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('×', this.x, this.y);
                }
            };
            multiplySign.isProblemVisual = true;
            this.gameEngine.addSprite(multiplySign);
        }
    }

    addDivisionVisuals() {
        const numbers = this.currentProblem.operation.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const dividend = parseInt(numbers[0]);
            const divisor = parseInt(numbers[1]);
            
            // Create visual groups showing division
            this.createDivisionGroups(dividend, divisor, 350, 100);
            
            // Add division sign
            const divideSign = {
                x: 500,
                y: 180,
                type: 'divide',
                render: function(ctx) {
                    ctx.fillStyle = '#FF6B6B';
                    ctx.font = '32px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('÷', this.x, this.y);
                }
            };
            divideSign.isProblemVisual = true;
            this.gameEngine.addSprite(divideSign);
        }
    }

    createMultiplicationGroups(groups, itemsPerGroup, startX, startY) {
        const groupSpacing = 100;
        const itemSpacing = 35;
        
        for (let g = 0; g < groups; g++) {
            for (let i = 0; i < itemsPerGroup; i++) {
                const x = startX + g * groupSpacing + (i % 3) * itemSpacing;
                const y = startY + Math.floor(i / 3) * 40;
                
                const penguin = this.gameEngine.createSprite('penguin', x, y);
                penguin.isProblemVisual = true;
                penguin.scale = 0.7;
                
                // Add entrance animation
                penguin.originalY = y;
                penguin.y = y - 80;
                penguin.animationTime = (g * itemsPerGroup + i) * 150;
                
                penguin.update = function(deltaTime) {
                    if (this.animationTime > 0) {
                        this.animationTime -= deltaTime;
                    } else {
                        this.y = Math.min(this.originalY, this.y + deltaTime / 8);
                    }
                };
                
                this.gameEngine.addSprite(penguin);
            }
            
            // Add group label
            const groupLabel = {
                x: startX + g * groupSpacing + itemSpacing,
                y: startY + 120,
                text: `Group ${g + 1}`,
                isProblemVisual: true,
                
                render: function(ctx) {
                    ctx.save();
                    ctx.fillStyle = '#4ECDC4';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.text, this.x, this.y);
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(groupLabel);
        }
    }

    createDivisionGroups(total, groups, startX, startY) {
        const groupSpacing = 120;
        const itemsPerGroup = Math.floor(total / groups);
        const remainder = total % groups;
        
        for (let g = 0; g < groups; g++) {
            const itemsInThisGroup = itemsPerGroup + (g < remainder ? 1 : 0);
            
            for (let i = 0; i < itemsInThisGroup; i++) {
                const x = startX + g * groupSpacing + (i % 3) * 35;
                const y = startY + Math.floor(i / 3) * 40;
                
                const fish = this.gameEngine.createSprite('fish', x, y);
                fish.isProblemVisual = true;
                fish.scale = 0.8;
                
                // Add entrance animation
                fish.originalY = y;
                fish.y = y - 60;
                fish.animationTime = (g * itemsInThisGroup + i) * 100;
                
                fish.update = function(deltaTime) {
                    if (this.animationTime > 0) {
                        this.animationTime -= deltaTime;
                    } else {
                        this.y = Math.min(this.originalY, this.y + deltaTime / 6);
                    }
                };
                
                this.gameEngine.addSprite(fish);
            }
            
            // Add group container
            const container = {
                x: startX + g * groupSpacing - 10,
                y: startY - 10,
                width: 90,
                height: 100,
                isProblemVisual: true,
                
                render: function(ctx) {
                    ctx.strokeStyle = '#4ECDC4';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                    
                    ctx.fillStyle = '#4ECDC4';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Group ${g + 1}`, this.x + this.width/2, this.y + this.height + 15);
                }
            };
            
            this.gameEngine.addSprite(container);
        }
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`PenguinArctic: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
        const isCorrect = this.mathEngine.checkAnswer(userAnswer);
        
        if (isCorrect) {
            this.onCorrectAnswer();
            
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
        console.log(`Penguin Arctic: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
        // Update GameController progress tracking
        if (this.gameController) {
            this.gameController.updateProgress();
        }
        
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
            if (this.gameController) {
                this.gameController.completeLevel();
            }
        } else {
            // Schedule next problem
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
        
        // Make all penguins waddle
        this.penguins.forEach(penguin => {
            penguin.isWaddling = true;
            penguin.waddleAnimationTime = 0;
            penguin.happiness = 100;
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around penguins
        this.penguins.forEach(penguin => {
            this.gameEngine.createCelebrationParticles(penguin.x, penguin.y);
        });
        
        // Create aurora celebration
        this.createAuroraCelebration();
        
        // Stop celebration after 2.5 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 2500);
    }

    createAuroraCelebration() {
        const celebrationAurora = {
            x: 600,
            y: 60,
            life: 2500,
            colors: ['#FF69B4', '#00FF87', '#60A5FA', '#A78BFA'],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2500;
                
                for (let i = 0; i < 4; i++) {
                    const gradient = ctx.createRadialGradient(
                        this.x, this.y + i * 25, 0,
                        this.x, this.y + i * 25, 250
                    );
                    gradient.addColorStop(0, this.colors[i]);
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(this.x - 250, this.y + i * 25, 500, 20);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebrationAurora);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with penguin helper
        const hintBubble = {
            x: 600,
            y: 130,
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
                
                // Draw speech bubble
                ctx.fillStyle = 'rgba(240, 248, 255, 0.95)';
                ctx.strokeStyle = '#4682B4';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 130, this.y - 40, 260, 80, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw bubble tail
                ctx.beginPath();
                ctx.moveTo(this.x - 25, this.y + 40);
                ctx.lineTo(this.x - 15, this.y + 60);
                ctx.lineTo(this.x - 5, this.y + 40);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Draw text with word wrap
                ctx.fillStyle = '#000080';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const words = this.text.split(' ');
                let line = '';
                let y = this.y - 10;
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;
                    
                    if (testWidth > 240 && i > 0) {
                        ctx.fillText(line, this.x, y);
                        line = words[i] + ' ';
                        y += 20;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, this.x, y);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(hintBubble);
    }

    completeHabitat() {
        // Play completion sound
        if (this.audioManager) {
            this.audioManager.playSFX('badge-earned');
            this.audioManager.playVoice('habitat-complete');
        }
        
        // Show completion message
        const completionMessage = {
            x: 600,
            y: 300,
            text: 'Penguin Arctic Complete!',
            subtext: 'You mastered multiplication and division! The penguins are proud!',
            life: 5000,
            opacity: 1,
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, 1200, 800);
                
                // Draw main text
                ctx.fillStyle = '#00BFFF';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(this.text, this.x, this.y);
                ctx.fillText(this.text, this.x, this.y);
                
                // Draw subtext
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillText(this.subtext, this.x, this.y + 50);
                
                // Draw celebration penguins
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🐧❄️🐧', this.x, this.y + 120);
                
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
        console.log('Penguin Arctic completed! Returning to habitat selection...');
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
        this.penguins.forEach(penguin => {
            if (penguin.update) {
                penguin.update(deltaTime);
            }
        });
        
        // Update weather effects
        this.snowflakes.forEach(snowflake => {
            if (snowflake.update) {
                snowflake.update(deltaTime);
            }
        });
        
        // Update aurora
        this.auroraTime += deltaTime;
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 75000) { // 75 second timeout for multiplication/division
                this.showHint();
                this.problemStartTime = Date.now();
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
        this.penguins = [];
        this.icebergs = [];
        this.fish = [];
        this.fishingHoles = [];
        this.snowflakes = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PenguinArctic;
}