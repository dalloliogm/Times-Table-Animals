// Elephant Savanna Habitat for Times Table Animals
// Fourth habitat focusing on division and multiplication with larger numbers

class ElephantSavanna {
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
        this.elephants = [];
        this.waterHoles = [];
        this.acaciaTrees = [];
        this.peanutPiles = [];
        this.mudBaths = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Savanna environment
        this.grassPatches = [];
        this.rocks = [];
        this.sunPosition = { x: 1100, y: 100 };
        this.heatShimmer = [];
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('elephantSavanna');
        this.gameEngine.setBackground('elephantSavanna');
        
        // Create the savanna environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createElephantHerd();
        this.createSavannaFeatures();
        this.createWeatherEffects();
        this.addInteractiveElements();
    }

    createElephantHerd() {
        // Create elephant family groups
        const herdPositions = [
            { x: 200, y: 300, name: 'Mama Ellie', age: 'adult' },
            { x: 180, y: 350, name: 'Baby Peanut', age: 'baby' },
            { x: 400, y: 280, name: 'Papa Trunk', age: 'adult' },
            { x: 420, y: 330, name: 'Little Ears', age: 'baby' },
            { x: 650, y: 320, name: 'Grandma Wise', age: 'elder' },
            { x: 850, y: 300, name: 'Uncle Strong', age: 'adult' },
            { x: 900, y: 360, name: 'Tiny Tusks', age: 'baby' },
            { x: 300, y: 450, name: 'Aunt Grace', age: 'adult' },
            { x: 600, y: 480, name: 'Cousin Splash', age: 'adult' },
            { x: 800, y: 520, name: 'Junior Stomp', age: 'baby' }
        ];

        herdPositions.forEach((pos, index) => {
            const elephant = this.gameEngine.createSprite('elephant', pos.x, pos.y);
            elephant.name = pos.name;
            elephant.age = pos.age;
            elephant.id = `elephant_${index}`;
            elephant.isSwaying = false;
            elephant.swayCooldown = Math.random() * 4000 + 3000;
            elephant.originalX = pos.x;
            elephant.originalY = pos.y;
            elephant.happiness = 100;
            elephant.thirst = Math.random() * 50 + 25;
            elephant.hunger = Math.random() * 40 + 30;
            
            // Size based on age
            if (pos.age === 'baby') {
                elephant.width = 40;
                elephant.height = 30;
            } else if (pos.age === 'elder') {
                elephant.width = 90;
                elephant.height = 70;
                elephant.tintColor = '#A0A0A0'; // Slightly gray for elders
            } else {
                elephant.width = 80;
                elephant.height = 60;
            }
            
            // Add elephant behavior
            elephant.update = (deltaTime) => {
                this.updateElephant(elephant, deltaTime);
            };
            
            elephant.onClick = () => {
                this.onElephantClick(elephant);
            };
            
            this.elephants.push(elephant);
            this.gameEngine.addSprite(elephant);
        });
    }

    updateElephant(elephant, deltaTime) {
        // Handle swaying animation
        elephant.swayCooldown -= deltaTime;
        
        if (elephant.swayCooldown <= 0 && !elephant.isSwaying) {
            elephant.isSwaying = true;
            elephant.swayCooldown = Math.random() * 5000 + 4000;
            elephant.swayAnimationTime = 0;
        }
        
        if (elephant.isSwaying) {
            elephant.swayAnimationTime += deltaTime;
            const swayProgress = elephant.swayAnimationTime / 2500; // 2.5 second sway
            
            if (swayProgress <= 1) {
                // Gentle swaying motion
                const swayOffset = Math.sin(swayProgress * Math.PI * 2) * 8;
                elephant.x = elephant.originalX + swayOffset;
                
                // Slight vertical bob
                const bobOffset = Math.sin(swayProgress * Math.PI * 4) * 2;
                elephant.y = elephant.originalY + bobOffset;
            } else {
                elephant.isSwaying = false;
                elephant.x = elephant.originalX;
                elephant.y = elephant.originalY;
            }
        }
        
        // Update needs
        elephant.thirst += deltaTime / 100;
        elephant.hunger += deltaTime / 150;
        
        // Happiness based on needs
        if (elephant.thirst > 80 || elephant.hunger > 70) {
            elephant.happiness = Math.max(20, elephant.happiness - deltaTime / 200);
        } else if (elephant.thirst < 40 && elephant.hunger < 40) {
            elephant.happiness = Math.min(100, elephant.happiness + deltaTime / 300);
        }
    }

    onElephantClick(elephant) {
        if (this.audioManager) {
            this.audioManager.playSFX('elephant-trumpet');
        }
        
        // Make elephant sway
        elephant.isSwaying = true;
        elephant.swayAnimationTime = 0;
        
        // Show elephant info
        this.showElephantInfo(elephant);
        
        // Increase happiness
        elephant.happiness = Math.min(100, elephant.happiness + 15);
        
        // Reduce thirst and hunger slightly
        elephant.thirst = Math.max(0, elephant.thirst - 10);
        elephant.hunger = Math.max(0, elephant.hunger - 8);
    }

    showElephantInfo(elephant) {
        const infoSprite = {
            x: elephant.x + 40,
            y: elephant.y - 60,
            text: `${elephant.name}\n${elephant.age}\n💧 ${Math.floor(100-elephant.thirst)}% 🥜 ${Math.floor(100-elephant.hunger)}%`,
            life: 3000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 3000);
                this.y -= deltaTime / 40;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw info bubble
                ctx.fillStyle = 'rgba(255, 248, 220, 0.9)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 50, this.y - 25, 100, 50, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#8B4513';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 10 + index * 15);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(infoSprite);
    }

    createSavannaFeatures() {
        // Create water holes for division problems
        const waterHolePositions = [
            { x: 150, y: 550 }, { x: 450, y: 580 }, { x: 750, y: 560 }, { x: 1050, y: 570 }
        ];

        waterHolePositions.forEach((pos, index) => {
            const waterHole = {
                x: pos.x,
                y: pos.y,
                type: 'water_hole',
                capacity: (index + 2) * 5, // 10, 15, 20, 25 capacity
                currentWater: Math.floor(Math.random() * 20) + 10,
                elephantsServed: 0,
                
                onClick: () => {
                    this.onWaterHoleClick(waterHole);
                },
                
                render: function(ctx) {
                    // Draw water hole
                    ctx.fillStyle = '#4169E1';
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 40, 25, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw water level
                    const waterLevel = this.currentWater / this.capacity;
                    ctx.fillStyle = `rgba(65, 105, 225, ${waterLevel})`;
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 35 * waterLevel, 20 * waterLevel, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Show water amount
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`💧 ${this.currentWater}`, this.x, this.y + 45);
                }
            };
            
            this.waterHoles.push(waterHole);
            this.gameEngine.addSprite(waterHole);
        });

        // Create acacia trees for shade and grouping
        const treePositions = [
            { x: 100, y: 200 }, { x: 350, y: 150 }, { x: 600, y: 180 },
            { x: 850, y: 160 }, { x: 1100, y: 190 }
        ];

        treePositions.forEach(pos => {
            const tree = {
                x: pos.x,
                y: pos.y,
                type: 'acacia_tree',
                elephantsInShade: 0,
                maxShade: 3,
                
                onClick: () => {
                    this.onTreeClick(tree);
                },
                
                render: function(ctx) {
                    // Draw tree trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x - 8, this.y + 20, 16, 40);
                    
                    // Draw tree canopy
                    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 50);
                    gradient.addColorStop(0, '#228B22');
                    gradient.addColorStop(1, '#006400');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 45, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw shade area
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y + 60, 60, 20, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Show elephants in shade
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🐘 ${this.elephantsInShade}/${this.maxShade}`, this.x, this.y + 90);
                }
            };
            
            this.acaciaTrees.push(tree);
            this.gameEngine.addSprite(tree);
        });

        // Create peanut piles for multiplication
        const peanutPositions = [
            { x: 250, y: 200 }, { x: 500, y: 220 }, { x: 750, y: 200 }, { x: 950, y: 240 }
        ];

        peanutPositions.forEach((pos, index) => {
            const peanutPile = {
                x: pos.x,
                y: pos.y,
                type: 'peanut_pile',
                peanutsPerGroup: index + 2, // 2, 3, 4, 5 peanuts per group
                numberOfGroups: Math.floor(Math.random() * 4) + 2,
                totalPeanuts: 0,
                
                onClick: () => {
                    this.onPeanutPileClick(peanutPile);
                },
                
                render: function(ctx) {
                    this.totalPeanuts = this.peanutsPerGroup * this.numberOfGroups;
                    
                    // Draw peanut groups
                    for (let g = 0; g < this.numberOfGroups; g++) {
                        for (let p = 0; p < this.peanutsPerGroup; p++) {
                            const px = this.x + g * 35 + (p % 2) * 15;
                            const py = this.y + Math.floor(p / 2) * 12;
                            
                            // Draw individual peanut
                            ctx.fillStyle = '#DEB887';
                            ctx.strokeStyle = '#8B4513';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.ellipse(px, py, 6, 4, 0, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                        }
                        
                        // Draw group border
                        ctx.strokeStyle = '#DAA520';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(this.x + g * 35 - 5, this.y - 8, 25, 20);
                    }
                    
                    // Show total count
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🥜 ${this.totalPeanuts}`, this.x + (this.numberOfGroups * 35) / 2, this.y + 40);
                }
            };
            
            this.peanutPiles.push(peanutPile);
            this.gameEngine.addSprite(peanutPile);
        });
    }

    createWeatherEffects() {
        // Create heat shimmer effect
        for (let i = 0; i < 15; i++) {
            const shimmer = {
                x: Math.random() * 1200,
                y: Math.random() * 200 + 500,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 30 + 20,
                opacity: Math.random() * 0.3 + 0.1,
                
                update: function(deltaTime) {
                    this.y -= this.speed * deltaTime / 1000;
                    this.x += Math.sin(this.y / 50) * 2;
                    
                    if (this.y < 400) {
                        this.y = 700;
                        this.x = Math.random() * 1200;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, this.size, this.size * 0.3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            };
            
            this.heatShimmer.push(shimmer);
            this.gameEngine.addSprite(shimmer);
        }

        // Create grass patches
        for (let i = 0; i < 30; i++) {
            const grass = {
                x: Math.random() * 1200,
                y: Math.random() * 300 + 400,
                type: 'grass_patch',
                
                render: function(ctx) {
                    ctx.fillStyle = '#9ACD32';
                    for (let j = 0; j < 5; j++) {
                        const gx = this.x + Math.random() * 20 - 10;
                        const gy = this.y + Math.random() * 10 - 5;
                        ctx.fillRect(gx, gy, 2, 8);
                        ctx.fillRect(gx + 1, gy - 3, 2, 6);
                    }
                }
            };
            
            this.grassPatches.push(grass);
            this.gameEngine.addSprite(grass);
        }

        // Create sun with moving light rays
        const sun = {
            x: this.sunPosition.x,
            y: this.sunPosition.y,
            time: 0,
            
            update: function(deltaTime) {
                this.time += deltaTime;
            },
            
            render: function(ctx) {
                ctx.save();
                
                // Draw sun rays
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2 + this.time / 2000;
                    const rayLength = 40 + Math.sin(this.time / 500) * 10;
                    const startX = this.x + Math.cos(angle) * 25;
                    const startY = this.y + Math.sin(angle) * 25;
                    const endX = this.x + Math.cos(angle) * rayLength;
                    const endY = this.y + Math.sin(angle) * rayLength;
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }
                
                // Draw sun body
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 25);
                gradient.addColorStop(0, '#FFFF00');
                gradient.addColorStop(1, '#FFD700');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 25, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(sun);
    }

    addInteractiveElements() {
        // Create mud baths for relaxation
        this.createMudBaths();
        
        // Create counting rocks
        this.createCountingRocks();
    }

    createMudBaths() {
        const mudBathPositions = [
            { x: 300, y: 650 }, { x: 700, y: 680 }
        ];

        mudBathPositions.forEach(pos => {
            const mudBath = {
                x: pos.x,
                y: pos.y,
                type: 'mud_bath',
                capacity: 4,
                currentElephants: 0,
                
                onClick: () => {
                    this.onMudBathClick(mudBath);
                },
                
                render: function(ctx) {
                    // Draw mud bath
                    ctx.fillStyle = '#8B4513';
                    ctx.strokeStyle = '#654321';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 50, 30, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw mud bubbles
                    for (let i = 0; i < this.currentElephants; i++) {
                        const bubbleX = this.x + (Math.random() - 0.5) * 60;
                        const bubbleY = this.y + (Math.random() - 0.5) * 40;
                        ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
                        ctx.beginPath();
                        ctx.arc(bubbleX, bubbleY, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Show capacity
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🐘 ${this.currentElephants}/${this.capacity}`, this.x, this.y + 50);
                }
            };
            
            this.mudBaths.push(mudBath);
            this.gameEngine.addSprite(mudBath);
        });
    }

    createCountingRocks() {
        // Create rocks for division counting
        for (let i = 0; i < 15; i++) {
            const rock = {
                x: 100 + (i % 5) * 40,
                y: 100 + Math.floor(i / 5) * 30,
                type: 'counting_rock',
                isSelected: false,
                
                onClick: () => {
                    this.onRockClick(rock);
                },
                
                render: function(ctx) {
                    ctx.fillStyle = this.isSelected ? '#DAA520' : '#808080';
                    ctx.strokeStyle = '#696969';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    if (this.isSelected) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '16px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText('✓', this.x, this.y + 5);
                    }
                }
            };
            
            this.rocks.push(rock);
            this.gameEngine.addSprite(rock);
        }
    }

    onWaterHoleClick(waterHole) {
        if (this.audioManager) {
            this.audioManager.playSFX('splash');
        }
        
        if (waterHole.currentWater > 0) {
            waterHole.currentWater = Math.max(0, waterHole.currentWater - 2);
            waterHole.elephantsServed++;
            
            // Create splash animation
            this.createSplashAnimation(waterHole.x, waterHole.y);
        }
    }

    onTreeClick(tree) {
        if (this.audioManager) {
            this.audioManager.playSFX('leaves-rustle');
        }
        
        if (tree.elephantsInShade < tree.maxShade) {
            tree.elephantsInShade++;
        } else {
            tree.elephantsInShade = 0;
        }
    }

    onPeanutPileClick(peanutPile) {
        if (this.audioManager) {
            this.audioManager.playSFX('collect');
        }
        
        // Cycle through different group configurations
        peanutPile.numberOfGroups = (peanutPile.numberOfGroups % 5) + 1;
    }

    onMudBathClick(mudBath) {
        if (this.audioManager) {
            this.audioManager.playSFX('mud-splash');
        }
        
        if (mudBath.currentElephants < mudBath.capacity) {
            mudBath.currentElephants++;
        } else {
            mudBath.currentElephants = 0;
        }
    }

    onRockClick(rock) {
        if (this.audioManager) {
            this.audioManager.playSFX('click');
        }
        
        rock.isSelected = !rock.isSelected;
    }

    createSplashAnimation(x, y) {
        for (let i = 0; i < 8; i++) {
            const droplet = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 100,
                vy: -Math.random() * 80 - 20,
                life: 1000,
                
                update: function(deltaTime) {
                    this.x += this.vx * deltaTime / 1000;
                    this.y += this.vy * deltaTime / 1000;
                    this.vy += 100 * deltaTime / 1000; // gravity
                    this.life -= deltaTime;
                    
                    if (this.life <= 0) {
                        this.isDead = true;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.life / 1000;
                    ctx.fillStyle = '#4169E1';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(droplet);
        }
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
        if (this.currentProblem.type === 'division') {
            this.addDivisionVisuals();
        } else if (this.currentProblem.type === 'multiplication') {
            this.addMultiplicationVisuals();
        }
    }

    addDivisionVisuals() {
        const numbers = this.currentProblem.operation.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const dividend = parseInt(numbers[0]);
            const divisor = parseInt(numbers[1]);
            
            // Create visual groups showing division
            this.createDivisionVisualization(dividend, divisor, 400, 120);
            
            // Add division sign
            const divideSign = {
                x: 550,
                y: 200,
                type: 'divide',
                render: function(ctx) {
                    ctx.fillStyle = '#FF6B6B';
                    ctx.font = '36px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('÷', this.x, this.y);
                }
            };
            divideSign.isProblemVisual = true;
            this.gameEngine.addSprite(divideSign);
        }
    }

    addMultiplicationVisuals() {
        const numbers = this.currentProblem.operation.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const a = parseInt(numbers[0]);
            const b = parseInt(numbers[1]);
            
            // Create visual groups
            this.createMultiplicationVisualization(a, b, 400, 120);
            
            // Add multiplication sign
            const multiplySign = {
                x: 550,
                y: 200,
                type: 'multiply',
                render: function(ctx) {
                    ctx.fillStyle = '#FF6B6B';
                    ctx.font = '36px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('×', this.x, this.y);
                }
            };
            multiplySign.isProblemVisual = true;
            this.gameEngine.addSprite(multiplySign);
        }
    }

    createDivisionVisualization(total, groups, startX, startY) {
        const itemsPerGroup = Math.floor(total / groups);
        const remainder = total % groups;
        const groupSpacing = 120;
        
        for (let g = 0; g < groups; g++) {
            const itemsInThisGroup = itemsPerGroup + (g < remainder ? 1 : 0);
            
            // Create container for each group
            const container = {
                x: startX + g * groupSpacing - 15,
                y: startY - 15,
                width: 100,
                height: 120,
                isProblemVisual: true,
                
                render: function(ctx) {
                    ctx.strokeStyle = '#DAA520';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                    
                    ctx.fillStyle = '#DAA520';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Group ${g + 1}`, this.x + this.width/2, this.y + this.height + 20);
                }
            };
            this.gameEngine.addSprite(container);
            
            // Add peanuts to each group
            for (let i = 0; i < itemsInThisGroup; i++) {
                const x = startX + g * groupSpacing + (i % 3) * 30;
                const y = startY + Math.floor(i / 3) * 35;
                
                const peanut = this.gameEngine.createSprite('peanut', x, y);
                peanut.isProblemVisual = true;
                peanut.scale = 0.8;
                
                // Add entrance animation
                peanut.originalY = y;
                peanut.y = y - 100;
                peanut.animationTime = (g * itemsInThisGroup + i) * 120;
                
                peanut.update = function(deltaTime) {
                    if (this.animationTime > 0) {
                        this.animationTime -= deltaTime;
                    } else {
                        this.y = Math.min(this.originalY, this.y + deltaTime / 6);
                    }
                };
                
                this.gameEngine.addSprite(peanut);
            }
        }
    }

    createMultiplicationVisualization(groups, itemsPerGroup, startX, startY) {
        const groupSpacing = 110;
        
        for (let g = 0; g < groups; g++) {
            // Create elephants for each group
            for (let i = 0; i < itemsPerGroup; i++) {
                const x = startX + g * groupSpacing + (i % 2) * 40;
                const y = startY + Math.floor(i / 2) * 45;
                
                const elephant = this.gameEngine.createSprite('elephant', x, y);
                elephant.isProblemVisual = true;
                elephant.scale = 0.6;
                
                // Add entrance animation
                elephant.originalY = y;
                elephant.y = y - 80;
                elephant.animationTime = (g * itemsPerGroup + i) * 150;
                
                elephant.update = function(deltaTime) {
                    if (this.animationTime > 0) {
                        this.animationTime -= deltaTime;
                    } else {
                        this.y = Math.min(this.originalY, this.y + deltaTime / 8);
                    }
                };
                
                this.gameEngine.addSprite(elephant);
            }
            
            // Add group label
            const groupLabel = {
                x: startX + g * groupSpacing + 20,
                y: startY + 140,
                text: `Herd ${g + 1}`,
                isProblemVisual: true,
                
                render: function(ctx) {
                    ctx.save();
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.text, this.x, this.y);
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(groupLabel);
        }
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`ElephantSavanna: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
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
        console.log(`Elephant Savanna: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
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
        
        // Make all elephants sway
        this.elephants.forEach(elephant => {
            elephant.isSwaying = true;
            elephant.swayAnimationTime = 0;
            elephant.happiness = 100;
            elephant.thirst = Math.max(0, elephant.thirst - 20);
            elephant.hunger = Math.max(0, elephant.hunger - 15);
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around elephants
        this.elephants.forEach(elephant => {
            this.gameEngine.createCelebrationParticles(elephant.x, elephant.y);
        });
        
        // Create trumpet sound effect visual
        this.createTrumpetCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createTrumpetCelebration() {
        const trumpetEffect = {
            x: 600,
            y: 300,
            life: 3000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                
                // Draw celebration text
                ctx.fillStyle = '#DAA520';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('TRUMPETING!', this.x, this.y);
                ctx.fillText('TRUMPETING!', this.x, this.y);
                
                // Draw trumpet symbols
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🎺🐘🎺', this.x, this.y + 60);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(trumpetEffect);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with elephant helper
        const hintBubble = {
            x: 600,
            y: 140,
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
                ctx.fillStyle = 'rgba(255, 248, 220, 0.95)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 140, this.y - 45, 280, 90, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw bubble tail
                ctx.beginPath();
                ctx.moveTo(this.x - 30, this.y + 45);
                ctx.lineTo(this.x - 20, this.y + 65);
                ctx.lineTo(this.x - 10, this.y + 45);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Draw text with word wrap
                ctx.fillStyle = '#8B4513';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const words = this.text.split(' ');
                let line = '';
                let y = this.y - 15;
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;
                    
                    if (testWidth > 260 && i > 0) {
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
            text: 'Elephant Savanna Complete!',
            subtext: 'You mastered advanced math! The elephant herd celebrates!',
            life: 6000,
            opacity: 1,
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, 1200, 800);
                
                // Draw main text
                ctx.fillStyle = '#DAA520';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(this.text, this.x, this.y);
                ctx.fillText(this.text, this.x, this.y);
                
                // Draw subtext
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillText(this.subtext, this.x, this.y + 45);
                
                // Draw celebration elephants
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🐘🌞🐘', this.x, this.y + 120);
                
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
        console.log('Elephant Savanna completed! Returning to habitat selection...');
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
        this.elephants.forEach(elephant => {
            if (elephant.update) {
                elephant.update(deltaTime);
            }
        });
        
        // Update heat shimmer effects
        this.heatShimmer.forEach(shimmer => {
            if (shimmer.update) {
                shimmer.update(deltaTime);
            }
        });
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 90000) { // 90 second timeout for division/multiplication
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
        this.elephants = [];
        this.waterHoles = [];
        this.acaciaTrees = [];
        this.peanutPiles = [];
        this.mudBaths = [];
        this.grassPatches = [];
        this.rocks = [];
        this.heatShimmer = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElephantSavanna;
}