// Penguin Pairs Arctic Habitat for Times Table Animals
// Specialized habitat focusing on doubles (2x multiplication)

class PenguinPairsArctic {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 12; // Cover doubles from 1×2 to 12×2
        
        // Habitat elements
        this.penguinPairs = [];
        this.iceBlocks = [];
        this.fish = [];
        this.iceHoles = [];
        this.sleds = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        this.currentAnimations = [];
        
        // Arctic environment
        this.snowflakes = [];
        this.auroraColors = ['#00FF87', '#60A5FA', '#A78BFA', '#F472B6'];
        this.auroraTime = 0;
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('penguinPairsArctic');
        this.gameEngine.setBackground('penguinPairsArctic');
        
        // Create the arctic environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createPenguinPairs();
        this.createIceElements();
        this.createWeatherEffects();
        this.addInteractiveElements();
    }

    createPenguinPairs() {
        // Create penguin pairs positioned around the arctic landscape
        const pairPositions = [
            { x: 100, y: 300, names: ['Pip', 'Pop'] },
            { x: 250, y: 200, names: ['Frost', 'Snow'] },
            { x: 400, y: 350, names: ['Ice', 'Berg'] },
            { x: 550, y: 180, names: ['Waddle', 'Slide'] },
            { x: 700, y: 320, names: ['Flipper', 'Splash'] },
            { x: 850, y: 250, names: ['Arctic', 'Chill'] },
            { x: 1000, y: 380, names: ['Polar', 'Breeze'] }
        ];

        pairPositions.forEach((pos, index) => {
            // Create a pair of penguins
            for (let i = 0; i < 2; i++) {
                const penguin = this.gameEngine.createSprite('penguin', 
                    pos.x + (i * 40), pos.y);
                
                penguin.name = pos.names[i];
                penguin.id = `penguin_${index}_${i}`;
                penguin.pairIndex = index;
                penguin.pairMate = i === 0 ? 1 : 0;
                penguin.isWaddling = false;
                penguin.waddleCooldown = Math.random() * 4000 + 2000;
                penguin.originalX = pos.x + (i * 40);
                penguin.originalY = pos.y;
                penguin.happiness = 100;
                penguin.isSliding = false;
                
                // Add penguin behavior
                penguin.update = (deltaTime) => {
                    this.updatePenguin(penguin, deltaTime);
                };
                
                penguin.onClick = () => {
                    this.onPenguinClick(penguin);
                };
                
                this.penguinPairs.push(penguin);
                this.gameEngine.addSprite(penguin);
            }
        });
    }

    updatePenguin(penguin, deltaTime) {
        // Handle waddle animation
        penguin.waddleCooldown -= deltaTime;
        
        if (penguin.waddleCooldown <= 0 && !penguin.isWaddling) {
            penguin.isWaddling = true;
            penguin.waddleCooldown = Math.random() * 5000 + 3000;
            penguin.waddleAnimationTime = 0;
            penguin.waddleDirection = Math.random() > 0.5 ? 1 : -1;
        }
        
        if (penguin.isWaddling) {
            penguin.waddleAnimationTime += deltaTime;
            const waddleProgress = penguin.waddleAnimationTime / 2000; // 2 second waddle
            
            if (waddleProgress <= 1) {
                // Waddle side to side
                const waddleOffset = Math.sin(waddleProgress * Math.PI * 4) * 10;
                penguin.x = penguin.originalX + waddleOffset * penguin.waddleDirection;
                
                // Bob up and down
                const bobOffset = Math.sin(waddleProgress * Math.PI * 8) * 5;
                penguin.y = penguin.originalY + bobOffset;
            } else {
                penguin.isWaddling = false;
                penguin.x = penguin.originalX;
                penguin.y = penguin.originalY;
            }
        }
        
        // Handle sliding animation
        if (penguin.isSliding) {
            penguin.slideTime += deltaTime;
            const slideProgress = penguin.slideTime / 1500; // 1.5 second slide
            
            if (slideProgress <= 1) {
                penguin.y = penguin.originalY + Math.sin(slideProgress * Math.PI) * 30;
                penguin.x = penguin.originalX + slideProgress * 60;
            } else {
                penguin.isSliding = false;
                penguin.x = penguin.originalX;
                penguin.y = penguin.originalY;
            }
        }
        
        // Happiness effects
        if (penguin.happiness > 80) {
            // Happy penguins waddle more
            penguin.waddleCooldown = Math.max(penguin.waddleCooldown - deltaTime / 2, 0);
        }
    }

    onPenguinClick(penguin) {
        if (this.audioManager) {
            this.audioManager.playSFX('penguin-call');
        }
        
        // Make penguin slide
        penguin.isSliding = true;
        penguin.slideTime = 0;
        
        // Show penguin's name
        this.showPenguinName(penguin);
        
        // Make pair mate respond
        const pairMate = this.penguinPairs.find(p => 
            p.pairIndex === penguin.pairIndex && p.id !== penguin.id
        );
        if (pairMate) {
            setTimeout(() => {
                pairMate.isWaddling = true;
                pairMate.waddleAnimationTime = 0;
                pairMate.happiness = Math.min(100, pairMate.happiness + 15);
            }, 300);
        }
        
        // Increase happiness
        penguin.happiness = Math.min(100, penguin.happiness + 10);
    }

    showPenguinName(penguin) {
        const nameSprite = {
            x: penguin.x + 20,
            y: penguin.y - 40,
            text: penguin.name,
            life: 2500,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 2500);
                this.y -= deltaTime / 25;
                
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
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(this.text, this.x, this.y);
                ctx.fillText(this.text, this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(nameSprite);
    }

    createIceElements() {
        // Create ice blocks
        const iceBlockPositions = [
            { x: 50, y: 450 }, { x: 150, y: 470 }, { x: 250, y: 460 },
            { x: 350, y: 480 }, { x: 450, y: 450 }, { x: 550, y: 470 },
            { x: 650, y: 460 }, { x: 750, y: 480 }, { x: 850, y: 450 },
            { x: 950, y: 470 }, { x: 1050, y: 460 }, { x: 1150, y: 480 }
        ];

        iceBlockPositions.forEach((pos, index) => {
            const iceBlock = {
                x: pos.x,
                y: pos.y,
                type: 'ice_block',
                width: 40,
                height: 30,
                canHold: 2, // Each block can hold 2 penguins
                currentPenguins: 0,
                isGlowing: false,
                
                onClick: () => {
                    this.onIceBlockClick(iceBlock);
                },
                
                render: function(ctx) {
                    ctx.save();
                    
                    // Glow effect if active
                    if (this.isGlowing) {
                        ctx.shadowColor = '#00BFFF';
                        ctx.shadowBlur = 10;
                    }
                    
                    // Draw ice block
                    ctx.fillStyle = '#E0F6FF';
                    ctx.strokeStyle = '#87CEEB';
                    ctx.lineWidth = 2;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                    
                    // Draw ice texture
                    ctx.fillStyle = '#B0E0E6';
                    ctx.fillRect(this.x + 5, this.y + 5, 10, 5);
                    ctx.fillRect(this.x + 25, this.y + 15, 8, 4);
                    
                    // Show capacity
                    ctx.fillStyle = '#000080';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.currentPenguins}/${this.canHold}`, 
                        this.x + this.width/2, this.y + this.height/2);
                    
                    ctx.restore();
                }
            };
            
            this.iceBlocks.push(iceBlock);
            this.gameEngine.addSprite(iceBlock);
        });

        // Create ice holes for fishing
        const holePositions = [
            { x: 200, y: 600 }, { x: 400, y: 620 }, { x: 600, y: 610 },
            { x: 800, y: 630 }, { x: 1000, y: 615 }
        ];

        holePositions.forEach(pos => {
            const hole = {
                x: pos.x,
                y: pos.y,
                type: 'ice_hole',
                fishCount: Math.floor(Math.random() * 8) + 2,
                
                onClick: () => {
                    this.onIceHoleClick(hole);
                },
                
                render: function(ctx) {
                    // Draw hole
                    ctx.fillStyle = '#000080';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 25, 15, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw fish swimming
                    ctx.fillStyle = '#FFD700';
                    for (let i = 0; i < Math.min(this.fishCount, 4); i++) {
                        const angle = (i / 4) * Math.PI * 2;
                        const fishX = this.x + Math.cos(angle) * 15;
                        const fishY = this.y + Math.sin(angle) * 8;
                        ctx.beginPath();
                        ctx.ellipse(fishX, fishY, 3, 2, angle, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            };
            
            this.iceHoles.push(hole);
            this.gameEngine.addSprite(hole);
        });
    }

    createWeatherEffects() {
        // Create snowflakes
        for (let i = 0; i < 30; i++) {
            const snowflake = {
                x: Math.random() * 1200,
                y: Math.random() * 800,
                size: Math.random() * 3 + 2,
                speed: Math.random() * 30 + 10,
                drift: Math.random() * 20 - 10,
                opacity: Math.random() * 0.5 + 0.5,
                
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

        // Create aurora effect
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
                ctx.globalAlpha = 0.3;
                
                // Draw aurora bands
                for (let i = 0; i < 3; i++) {
                    const gradient = ctx.createLinearGradient(0, 50 + i * 40, 1200, 150 + i * 40);
                    gradient.addColorStop(0, 'transparent');
                    gradient.addColorStop(0.5, this.colors[i % this.colors.length]);
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 50 + i * 40, 1200, 30);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(aurora);
    }

    addInteractiveElements() {
        // Create fish for feeding
        this.createFishSupply();
        
        // Create sleds for transportation
        this.createSleds();
        
        // Create counting stations
        this.createCountingStations();
    }

    createFishSupply() {
        const fishPositions = [
            { x: 50, y: 550 }, { x: 100, y: 570 }, { x: 150, y: 560 },
            { x: 200, y: 580 }, { x: 250, y: 550 }, { x: 300, y: 570 }
        ];

        fishPositions.forEach(pos => {
            const fish = this.gameEngine.createSprite('fish', pos.x, pos.y);
            fish.isFresh = true;
            fish.freshness = 100;
            
            fish.update = (deltaTime) => {
                if (fish.isFresh) {
                    fish.freshness -= deltaTime / 100;
                    if (fish.freshness <= 0) {
                        fish.isFresh = false;
                    }
                }
            };
            
            fish.onClick = () => {
                this.collectFish(fish);
            };
            
            this.fish.push(fish);
            this.gameEngine.addSprite(fish);
        });
    }

    createSleds() {
        const sledPositions = [
            { x: 900, y: 500 }, { x: 1000, y: 520 }, { x: 1100, y: 510 }
        ];

        sledPositions.forEach(pos => {
            const sled = {
                x: pos.x,
                y: pos.y,
                type: 'sled',
                capacity: 4, // Can carry 4 penguins (2 pairs)
                passengers: 0,
                
                onClick: () => {
                    this.onSledClick(sled);
                },
                
                render: function(ctx) {
                    // Draw sled
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x, this.y, 50, 20);
                    
                    // Draw runners
                    ctx.fillStyle = '#696969';
                    ctx.fillRect(this.x - 5, this.y + 20, 60, 3);
                    ctx.fillRect(this.x - 5, this.y + 25, 60, 3);
                    
                    // Show passenger count
                    ctx.fillStyle = '#000';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.passengers}/${this.capacity}`, 
                        this.x + 25, this.y + 35);
                }
            };
            
            this.sleds.push(sled);
            this.gameEngine.addSprite(sled);
        });
    }

    createCountingStations() {
        // Create visual counting areas for doubles practice
        const stations = [
            { x: 800, y: 150, label: 'Pairs Counter' },
            { x: 950, y: 150, label: 'Doubles Station' }
        ];

        stations.forEach(station => {
            const counter = {
                x: station.x,
                y: station.y,
                label: station.label,
                count: 0,
                
                render: function(ctx) {
                    // Draw station
                    ctx.fillStyle = '#F0F8FF';
                    ctx.strokeStyle = '#4682B4';
                    ctx.lineWidth = 2;
                    ctx.fillRect(this.x, this.y, 120, 60);
                    ctx.strokeRect(this.x, this.y, 120, 60);
                    
                    // Draw label
                    ctx.fillStyle = '#000080';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.label, this.x + 60, this.y + 15);
                    
                    // Draw count
                    ctx.font = '24px "Comic Sans MS", cursive';
                    ctx.fillText(this.count.toString(), this.x + 60, this.y + 40);
                }
            };
            
            this.gameEngine.addSprite(counter);
        });
    }

    onIceBlockClick(iceBlock) {
        if (this.audioManager) {
            this.audioManager.playSFX('ice-crack');
        }
        
        iceBlock.isGlowing = !iceBlock.isGlowing;
        
        // Demonstrate capacity
        if (iceBlock.currentPenguins < iceBlock.canHold) {
            iceBlock.currentPenguins++;
        } else {
            iceBlock.currentPenguins = 0;
        }
    }

    onIceHoleClick(hole) {
        if (this.audioManager) {
            this.audioManager.playSFX('splash');
        }
        
        if (hole.fishCount > 0) {
            hole.fishCount--;
            this.createFishCatchAnimation(hole.x, hole.y);
        }
    }

    createFishCatchAnimation(x, y) {
        const fishSprite = {
            x: x,
            y: y,
            life: 1000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.y -= deltaTime / 10;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 1000;
                ctx.fillStyle = '#FFD700';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('🐟', this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(fishSprite);
    }

    onSledClick(sled) {
        if (this.audioManager) {
            this.audioManager.playSFX('sled-bell');
        }
        
        // Demonstrate sled capacity with doubles
        if (sled.passengers < sled.capacity) {
            sled.passengers += 2; // Always add pairs
        } else {
            sled.passengers = 0;
        }
    }

    collectFish(fish) {
        if (this.audioManager) {
            this.audioManager.playSFX('collect');
        }
        
        // Remove fish
        this.gameEngine.removeSprite(fish);
        const index = this.fish.indexOf(fish);
        if (index > -1) {
            this.fish.splice(index, 1);
        }
        
        // Add collection particles
        this.gameEngine.createCelebrationParticles(fish.x, fish.y);
    }

    startNextProblem() {
        // Generate new doubles problem
        this.currentProblem = this.mathEngine.generateProblem();
        this.problemStartTime = Date.now();
        
        // Update UI
        this.updateProblemDisplay();
        
        // Add visual elements for the problem
        this.addProblemVisuals();
        
        // Highlight relevant penguins
        this.highlightPenguinPairs();
        
        // Play audio
        if (this.audioManager) {
            this.audioManager.playSFX('problem-appear');
        }
    }

    updateProblemDisplay() {
        // Update DOM elements
        const problemTitle = document.getElementById('problemTitle');
        const problemText = document.getElementById('problemText');
        const answerInput = document.getElementById('answerInput');
        const feedback = document.getElementById('feedback');
        
        if (problemTitle) problemTitle.textContent = this.currentProblem.title;
        if (problemText) {
            // Use innerHTML with highlighted numbers
            const highlightedText = this.mathEngine.highlightNumbers(this.currentProblem.text);
            problemText.innerHTML = highlightedText;
        }
        if (answerInput) {
            answerInput.value = '';
            answerInput.focus();
        }
        if (feedback) feedback.classList.add('hidden');
        
        // Update answer options with actual values
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
        
        // Add visual representation of doubles
        if (this.currentProblem.baseNumber) {
            this.createDoublesVisualization(this.currentProblem.baseNumber);
        }
    }

    createDoublesVisualization(number) {
        const startX = 400;
        const startY = 100;
        const pairSpacing = 80;
        
        // Create pairs of penguins to show doubles
        for (let i = 0; i < number; i++) {
            const pairX = startX + (i * pairSpacing);
            
            // Create pair
            for (let j = 0; j < 2; j++) {
                const penguin = this.gameEngine.createSprite('penguin', 
                    pairX + (j * 30), startY);
                penguin.isProblemVisual = true;
                penguin.scale = 0.8;
                
                // Add entrance animation
                penguin.originalY = startY;
                penguin.y = startY - 100;
                penguin.animationTime = (i * 2 + j) * 200;
                
                penguin.update = function(deltaTime) {
                    if (this.animationTime > 0) {
                        this.animationTime -= deltaTime;
                    } else {
                        this.y = Math.min(this.originalY, this.y + deltaTime / 5);
                    }
                };
                
                this.gameEngine.addSprite(penguin);
            }
            
            // Add pair indicator
            const pairIndicator = {
                x: pairX + 15,
                y: startY + 70,
                text: 'Pair ' + (i + 1),
                isProblemVisual: true,
                
                render: function(ctx) {
                    ctx.save();
                    ctx.fillStyle = '#FF69B4';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.text, this.x, this.y);
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(pairIndicator);
        }
        
        // Add equals sign and answer area
        const equalsSign = {
            x: startX + (number * pairSpacing) + 30,
            y: startY + 30,
            isProblemVisual: true,
            
            render: function(ctx) {
                ctx.fillStyle = '#4ECDC4';
                ctx.font = '28px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('=', this.x, this.y);
            }
        };
        
        this.gameEngine.addSprite(equalsSign);
    }

    highlightPenguinPairs() {
        // Highlight pairs of penguins that match the problem
        const baseNumber = this.currentProblem.baseNumber || 1;
        const pairsToHighlight = Math.min(baseNumber, this.penguinPairs.length / 2);
        
        for (let i = 0; i < pairsToHighlight; i++) {
            const pair1 = this.penguinPairs[i * 2];
            const pair2 = this.penguinPairs[i * 2 + 1];
            
            if (pair1) {
                pair1.isHighlighted = true;
                pair1.highlightTime = 3000;
            }
            if (pair2) {
                pair2.isHighlighted = true;
                pair2.highlightTime = 3000;
            }
        }
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
        
        // Clear highlights
        this.penguinPairs.forEach(penguin => {
            penguin.isHighlighted = false;
            penguin.highlightTime = 0;
        });
    }

    checkAnswer(userAnswer) {
        const isCorrect = this.mathEngine.checkAnswer(userAnswer);
        
        if (isCorrect) {
            this.onCorrectAnswer();
        } else {
            this.onIncorrectAnswer();
        }
        
        return isCorrect;
    }

    onCorrectAnswer() {
        this.problemsSolved++;
        
        // Update GameController progress tracking
        if (this.gameController) {
            this.gameController.updateProgress();
        }
        
        if (this.audioManager) {
            this.audioManager.playSFX('correct');
            this.audioManager.playVoice('celebration');
        }
        
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
        }
        // Note: Next problem will be started when user clicks Continue button
        // via onContinueButtonClicked() method
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
        
        // Make all penguins slide and waddle
        this.penguinPairs.forEach(penguin => {
            penguin.isSliding = true;
            penguin.slideTime = 0;
            penguin.happiness = 100;
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around penguin pairs
        this.penguinPairs.forEach(penguin => {
            this.gameEngine.createCelebrationParticles(penguin.x, penguin.y);
        });
        
        // Create aurora celebration
        this.createAuroraCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createAuroraCelebration() {
        const celebrationAurora = {
            x: 600,
            y: 50,
            life: 3000,
            colors: ['#FF69B4', '#00FF87', '#60A5FA', '#A78BFA'],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                
                for (let i = 0; i < 4; i++) {
                    const gradient = ctx.createRadialGradient(
                        this.x, this.y + i * 20, 0,
                        this.x, this.y + i * 20, 200
                    );
                    gradient.addColorStop(0, this.colors[i]);
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(this.x - 200, this.y + i * 20, 400, 15);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebrationAurora);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with penguin character
        const hintBubble = {
            x: 600,
            y: 120,
            text: hint,
            life: 6000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life < 1500) {
                    this.opacity = this.life / 1500;
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
                ctx.roundRect(this.x - 120, this.y - 40, 240, 80, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw bubble tail
                ctx.beginPath();
                ctx.moveTo(this.x - 20, this.y + 40);
                ctx.lineTo(this.x - 10, this.y + 60);
                ctx.lineTo(this.x, this.y + 40);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Draw text
                ctx.fillStyle = '#000080';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                // Word wrap the hint text
                const words = this.text.split(' ');
                let line = '';
                let y = this.y - 10;
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;
                    
                    if (testWidth > 220 && i > 0) {
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
            text: 'Penguin Pairs Arctic Complete!',
            subtext: 'You mastered doubles! The penguins are celebrating!',
            life: 6000,
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
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillText(this.subtext, this.x, this.y + 50);
                
                // Draw celebration penguins
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🐧🐧', this.x - 100, this.y + 120);
                ctx.fillText('🐧🐧', this.x + 100, this.y + 120);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(completionMessage);
        
        // Return to habitat selection after celebration
        setTimeout(() => {
            this.returnToHabitatSelection();
        }, 6000);
    }

    returnToHabitatSelection() {
        // This would be handled by the main game controller
        console.log('Penguin Pairs Arctic completed! Returning to habitat selection...');
    }

    onContinueButtonClicked() {
        // Start next problem immediately
        if (this.problemsSolved < this.totalProblems) {
            this.startNextProblem();
        }
    }

    update(deltaTime) {
        // Update all habitat-specific logic
        this.penguinPairs.forEach(penguin => {
            if (penguin.update) {
                penguin.update(deltaTime);
            }
            
            // Handle highlights
            if (penguin.isHighlighted) {
                penguin.highlightTime -= deltaTime;
                if (penguin.highlightTime <= 0) {
                    penguin.isHighlighted = false;
                }
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
            if (elapsed > 90000) { // 1.5 minute timeout for doubles
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
        this.penguinPairs = [];
        this.iceBlocks = [];
        this.fish = [];
        this.iceHoles = [];
        this.sleds = [];
        this.snowflakes = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PenguinPairsArctic;
}