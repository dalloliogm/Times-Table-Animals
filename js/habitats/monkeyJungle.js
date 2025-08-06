// Monkey Jungle Habitat for Times Table Animals
// Fifth habitat focusing on fractions and mixed operations

class MonkeyJungle {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 15;
        this.nextProblemTimer = null;
        
        // Habitat elements
        this.monkeys = [];
        this.bananaGroves = [];
        this.vines = [];
        this.coconutPalms = [];
        this.treeHouses = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Jungle environment
        this.leaves = [];
        this.insects = [];
        this.jungleSounds = [];
        this.canopyLayers = [];
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('monkeyJungle');
        this.gameEngine.setBackground('monkeyJungle');
        
        // Create the jungle environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createMonkeyTroop();
        this.createJungleFeatures();
        this.createCanopyLayers();
        this.addInteractiveElements();
    }

    createMonkeyTroop() {
        // Create monkey families with different personalities
        const troopPositions = [
            { x: 200, y: 250, name: 'Chatter', personality: 'talkative' },
            { x: 150, y: 180, name: 'Swing', personality: 'acrobatic' },
            { x: 350, y: 200, name: 'Banana', personality: 'foodie' },
            { x: 400, y: 320, name: 'Curious', personality: 'explorer' },
            { x: 550, y: 180, name: 'Giggles', personality: 'playful' },
            { x: 600, y: 290, name: 'Wise', personality: 'elder' },
            { x: 750, y: 220, name: 'Bouncy', personality: 'energetic' },
            { x: 800, y: 350, name: 'Sleepy', personality: 'lazy' },
            { x: 950, y: 200, name: 'Quick', personality: 'fast' },
            { x: 900, y: 300, name: 'Gentle', personality: 'caring' },
            { x: 100, y: 350, name: 'Tiny', personality: 'baby' },
            { x: 450, y: 400, name: 'Climber', personality: 'adventurous' },
            { x: 650, y: 150, name: 'Smart', personality: 'clever' },
            { x: 1050, y: 280, name: 'Happy', personality: 'cheerful' },
            { x: 300, y: 450, name: 'Munch', personality: 'always_eating' }
        ];

        troopPositions.forEach((pos, index) => {
            const monkey = this.gameEngine.createSprite('monkey', pos.x, pos.y);
            monkey.name = pos.name;
            monkey.personality = pos.personality;
            monkey.id = `monkey_${index}`;
            monkey.isSwinging = false;
            monkey.swingCooldown = Math.random() * 3000 + 2000;
            monkey.originalX = pos.x;
            monkey.originalY = pos.y;
            monkey.happiness = 100;
            monkey.bananasEaten = 0;
            monkey.energy = Math.random() * 30 + 70;
            
            // Personality affects appearance and behavior
            switch (pos.personality) {
                case 'baby':
                    monkey.width = 30;
                    monkey.height = 40;
                    break;
                case 'elder':
                    monkey.tintColor = '#A0A0A0';
                    break;
                case 'energetic':
                    monkey.swingCooldown *= 0.5; // Swings more often
                    break;
                case 'lazy':
                    monkey.swingCooldown *= 2; // Swings less often
                    break;
            }
            
            // Add monkey behavior
            monkey.update = (deltaTime) => {
                this.updateMonkey(monkey, deltaTime);
            };
            
            monkey.onClick = () => {
                this.onMonkeyClick(monkey);
            };
            
            this.monkeys.push(monkey);
            this.gameEngine.addSprite(monkey);
        });
    }

    updateMonkey(monkey, deltaTime) {
        // Handle swinging animation
        monkey.swingCooldown -= deltaTime;
        
        if (monkey.swingCooldown <= 0 && !monkey.isSwinging) {
            monkey.isSwinging = true;
            monkey.swingCooldown = Math.random() * 4000 + 2000;
            if (monkey.personality === 'energetic') monkey.swingCooldown *= 0.5;
            if (monkey.personality === 'lazy') monkey.swingCooldown *= 2;
            
            monkey.swingAnimationTime = 0;
            monkey.swingDirection = Math.random() > 0.5 ? 1 : -1;
        }
        
        if (monkey.isSwinging) {
            monkey.swingAnimationTime += deltaTime;
            const swingProgress = monkey.swingAnimationTime / 1800; // 1.8 second swing
            
            if (swingProgress <= 1) {
                // Swinging motion (pendulum-like)
                const swingAngle = Math.sin(swingProgress * Math.PI * 2) * 0.5;
                monkey.x = monkey.originalX + swingAngle * 30 * monkey.swingDirection;
                monkey.y = monkey.originalY + Math.abs(swingAngle) * 15;
            } else {
                monkey.isSwinging = false;
                monkey.x = monkey.originalX;
                monkey.y = monkey.originalY;
            }
        }
        
        // Update energy and happiness based on personality
        if (monkey.personality === 'energetic') {
            monkey.energy = Math.min(100, monkey.energy + deltaTime / 100);
        } else if (monkey.personality === 'lazy') {
            monkey.energy = Math.max(20, monkey.energy - deltaTime / 200);
        }
        
        // Happiness affects behavior
        if (monkey.happiness > 80) {
            monkey.swingCooldown = Math.max(monkey.swingCooldown - deltaTime / 4, 500);
        }
    }

    onMonkeyClick(monkey) {
        if (this.audioManager) {
            this.audioManager.playSFX('monkey-chatter');
        }
        
        // Make monkey swing
        monkey.isSwinging = true;
        monkey.swingAnimationTime = 0;
        
        // Show monkey info
        this.showMonkeyInfo(monkey);
        
        // Personality-based responses
        switch (monkey.personality) {
            case 'foodie':
            case 'always_eating':
                monkey.bananasEaten++;
                break;
            case 'playful':
            case 'cheerful':
                monkey.happiness = Math.min(100, monkey.happiness + 20);
                break;
            case 'clever':
                this.createHelpfulHint(monkey.x, monkey.y);
                break;
        }
        
        // General happiness increase
        monkey.happiness = Math.min(100, monkey.happiness + 10);
    }

    showMonkeyInfo(monkey) {
        const infoSprite = {
            x: monkey.x + 30,
            y: monkey.y - 60,
            text: `${monkey.name}\n${monkey.personality}\n🍌 ${monkey.bananasEaten} ⚡ ${Math.floor(monkey.energy)}%`,
            life: 3000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 3000);
                this.y -= deltaTime / 50;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw info bubble
                ctx.fillStyle = 'rgba(144, 238, 144, 0.9)';
                ctx.strokeStyle = '#228B22';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 40, this.y - 30, 80, 60, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#8B4513';
                ctx.font = '11px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 15 + index * 13);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(infoSprite);
    }

    createHelpfulHint(x, y) {
        const hintSprite = {
            x: x,
            y: y - 80,
            text: "Think step by step!",
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
                ctx.fillStyle = '#FFD700';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(hintSprite);
    }

    createJungleFeatures() {
        // Create banana groves for fraction problems
        const grovePositions = [
            { x: 100, y: 500, bunches: 8 },
            { x: 300, y: 520, bunches: 12 },
            { x: 500, y: 480, bunches: 6 },
            { x: 700, y: 540, bunches: 10 },
            { x: 900, y: 500, bunches: 15 },
            { x: 1100, y: 520, bunches: 9 }
        ];

        grovePositions.forEach((pos, index) => {
            const grove = {
                x: pos.x,
                y: pos.y,
                type: 'banana_grove',
                totalBunches: pos.bunches,
                eatenBunches: Math.floor(Math.random() * 3),
                
                onClick: () => {
                    this.onBananaGroveClick(grove);
                },
                
                render: function(ctx) {
                    // Draw palm tree
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x - 5, this.y, 10, 40);
                    
                    // Draw palm fronds
                    ctx.fillStyle = '#228B22';
                    ctx.strokeStyle = '#006400';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        const fX = this.x + Math.cos(angle) * 25;
                        const fY = this.y + Math.sin(angle) * 15;
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(fX, fY);
                        ctx.stroke();
                    }
                    
                    // Draw banana bunches
                    const remainingBunches = this.totalBunches - this.eatenBunches;
                    for (let i = 0; i < remainingBunches; i++) {
                        const angle = (i / remainingBunches) * Math.PI * 2;
                        const bX = this.x + Math.cos(angle) * 15;
                        const bY = this.y + 10 + Math.sin(angle) * 8;
                        
                        // Draw banana bunch
                        ctx.fillStyle = '#FFFF00';
                        ctx.beginPath();
                        ctx.ellipse(bX, bY, 6, 10, angle, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Show fraction
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${remainingBunches}/${this.totalBunches}`, this.x, this.y + 60);
                }
            };
            
            this.bananaGroves.push(grove);
            this.gameEngine.addSprite(grove);
        });

        // Create swinging vines
        const vinePositions = [
            { x: 150, y: 50 }, { x: 250, y: 30 }, { x: 400, y: 60 },
            { x: 550, y: 40 }, { x: 700, y: 50 }, { x: 850, y: 35 },
            { x: 1000, y: 55 }
        ];

        vinePositions.forEach(pos => {
            const vine = {
                x: pos.x,
                y: pos.y,
                type: 'vine',
                length: Math.random() * 100 + 150,
                swayTime: Math.random() * 1000,
                
                update: function(deltaTime) {
                    this.swayTime += deltaTime;
                },
                
                onClick: () => {
                    this.onVineClick(vine);
                },
                
                render: function(ctx) {
                    const sway = Math.sin(this.swayTime / 1500) * 20;
                    
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.quadraticCurveTo(this.x + sway, this.y + this.length / 2, 
                                       this.x + sway, this.y + this.length);
                    ctx.stroke();
                    
                    // Draw leaves on vine
                    for (let i = 0; i < 5; i++) {
                        const leafY = this.y + (i / 4) * this.length;
                        const leafX = this.x + (sway * i / 4);
                        
                        ctx.fillStyle = '#228B22';
                        ctx.beginPath();
                        ctx.ellipse(leafX, leafY, 8, 4, 0, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            };
            
            this.vines.push(vine);
            this.gameEngine.addSprite(vine);
        });

        // Create tree houses for mixed operations
        const treehousePositions = [
            { x: 200, y: 120 }, { x: 500, y: 100 }, { x: 800, y: 130 }
        ];

        treehousePositions.forEach((pos, index) => {
            const treehouse = {
                x: pos.x,
                y: pos.y,
                type: 'treehouse',
                residents: index + 2, // 2, 3, or 4 monkeys
                
                onClick: () => {
                    this.onTreehouseClick(treehouse);
                },
                
                render: function(ctx) {
                    // Draw tree trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x - 15, this.y + 20, 30, 60);
                    
                    // Draw house platform
                    ctx.fillStyle = '#DEB887';
                    ctx.fillRect(this.x - 25, this.y, 50, 30);
                    
                    // Draw house walls
                    ctx.fillStyle = '#CD853F';
                    ctx.fillRect(this.x - 20, this.y - 20, 40, 20);
                    
                    // Draw roof
                    ctx.fillStyle = '#8B4513';
                    ctx.beginPath();
                    ctx.moveTo(this.x - 25, this.y - 20);
                    ctx.lineTo(this.x, this.y - 35);
                    ctx.lineTo(this.x + 25, this.y - 20);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Draw residents count
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🐵 ${this.residents}`, this.x, this.y + 100);
                }
            };
            
            this.treeHouses.push(treehouse);
            this.gameEngine.addSprite(treehouse);
        });
    }

    createCanopyLayers() {
        // Create layered jungle canopy for depth
        for (let layer = 0; layer < 3; layer++) {
            const canopy = {
                layer: layer,
                time: 0,
                opacity: 0.3 - layer * 0.1,
                
                update: function(deltaTime) {
                    this.time += deltaTime;
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    
                    // Draw leaves at different depths
                    ctx.fillStyle = layer === 0 ? '#228B22' : layer === 1 ? '#32CD32' : '#90EE90';
                    
                    for (let i = 0; i < 20; i++) {
                        const x = (i * 60 + this.time / (100 + layer * 50)) % 1200;
                        const y = 50 + layer * 20 + Math.sin(this.time / 1000 + i) * 5;
                        
                        ctx.beginPath();
                        ctx.ellipse(x, y, 15 + layer * 5, 8 + layer * 2, 0, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    ctx.restore();
                }
            };
            
            this.canopyLayers.push(canopy);
            this.gameEngine.addSprite(canopy);
        }

        // Create jungle insects for ambiance
        for (let i = 0; i < 10; i++) {
            const insect = {
                x: Math.random() * 1200,
                y: Math.random() * 600 + 100,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 15,
                size: Math.random() * 3 + 1,
                type: Math.random() > 0.5 ? 'butterfly' : 'firefly',
                
                update: function(deltaTime) {
                    this.x += this.vx * deltaTime / 1000;
                    this.y += this.vy * deltaTime / 1000;
                    
                    // Bounce off edges
                    if (this.x < 0 || this.x > 1200) this.vx *= -1;
                    if (this.y < 50 || this.y > 700) this.vy *= -1;
                    
                    // Keep in bounds
                    this.x = Math.max(0, Math.min(1200, this.x));
                    this.y = Math.max(50, Math.min(700, this.y));
                },
                
                render: function(ctx) {
                    if (this.type === 'butterfly') {
                        ctx.fillStyle = '#FF69B4';
                        ctx.beginPath();
                        ctx.ellipse(this.x - 2, this.y, 3, 2, 0, 0, Math.PI * 2);
                        ctx.ellipse(this.x + 2, this.y, 3, 2, 0, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.fillStyle = '#FFFF00';
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            };
            
            this.insects.push(insect);
            this.gameEngine.addSprite(insect);
        }
    }

    addInteractiveElements() {
        // Create coconut counting areas
        this.createCoconutPalms();
        
        // Create fraction visualization circles
        this.createFractionCircles();
    }

    createCoconutPalms() {
        for (let i = 0; i < 4; i++) {
            const palm = {
                x: 200 + i * 250,
                y: 600,
                type: 'coconut_palm',
                coconuts: (i + 1) * 3, // 3, 6, 9, 12 coconuts
                
                onClick: () => {
                    this.onCoconutPalmClick(palm);
                },
                
                render: function(ctx) {
                    // Draw palm trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x - 8, this.y - 60, 16, 60);
                    
                    // Draw coconuts in groups
                    const groupsOfThree = this.coconuts / 3;
                    for (let g = 0; g < groupsOfThree; g++) {
                        for (let c = 0; c < 3; c++) {
                            const cX = this.x + (g - groupsOfThree/2) * 40 + (c - 1) * 12;
                            const cY = this.y - 80 - g * 15;
                            
                            ctx.fillStyle = '#8B4513';
                            ctx.strokeStyle = '#654321';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(cX, cY, 6, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                    
                    // Show total and groups
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${groupsOfThree} groups of 3 = ${this.coconuts}`, this.x, this.y + 20);
                }
            };
            
            this.coconutPalms.push(palm);
            this.gameEngine.addSprite(palm);
        }
    }

    createFractionCircles() {
        // Create visual fraction circles for problems
        for (let i = 0; i < 6; i++) {
            const circle = {
                x: 150 + (i % 3) * 100,
                y: 150 + Math.floor(i / 3) * 80,
                type: 'fraction_circle',
                denominator: [2, 3, 4, 5, 6, 8][i],
                filledParts: 0,
                
                onClick: () => {
                    this.onFractionCircleClick(circle);
                },
                
                render: function(ctx) {
                    const radius = 25;
                    const centerX = this.x;
                    const centerY = this.y;
                    
                    // Draw circle outline
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Draw division lines
                    for (let d = 0; d < this.denominator; d++) {
                        const angle = (d / this.denominator) * Math.PI * 2 - Math.PI / 2;
                        const endX = centerX + Math.cos(angle) * radius;
                        const endY = centerY + Math.sin(angle) * radius;
                        
                        ctx.beginPath();
                        ctx.moveTo(centerX, centerY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();
                    }
                    
                    // Fill selected parts
                    for (let f = 0; f < this.filledParts; f++) {
                        const startAngle = (f / this.denominator) * Math.PI * 2 - Math.PI / 2;
                        const endAngle = ((f + 1) / this.denominator) * Math.PI * 2 - Math.PI / 2;
                        
                        ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
                        ctx.beginPath();
                        ctx.moveTo(centerX, centerY);
                        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                        ctx.closePath();
                        ctx.fill();
                    }
                    
                    // Show fraction
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.filledParts}/${this.denominator}`, centerX, centerY + radius + 20);
                }
            };
            
            this.gameEngine.addSprite(circle);
        }
    }

    onBananaGroveClick(grove) {
        if (this.audioManager) {
            this.audioManager.playSFX('munch');
        }
        
        if (grove.eatenBunches < grove.totalBunches) {
            grove.eatenBunches++;
        } else {
            grove.eatenBunches = 0; // Reset
        }
    }

    onVineClick(vine) {
        if (this.audioManager) {
            this.audioManager.playSFX('vine-swing');
        }
        
        // Create swinging monkey animation
        this.createSwingingMonkey(vine.x, vine.y + vine.length);
    }

    onTreehouseClick(treehouse) {
        if (this.audioManager) {
            this.audioManager.playSFX('monkey-chatter');
        }
        
        // Cycle residents
        treehouse.residents = (treehouse.residents % 6) + 1;
    }

    onCoconutPalmClick(palm) {
        if (this.audioManager) {
            this.audioManager.playSFX('coconut-drop');
        }
        
        // Drop a coconut (reduce by 3)
        if (palm.coconuts >= 3) {
            palm.coconuts -= 3;
        } else {
            palm.coconuts = 12; // Reset to full
        }
    }

    onFractionCircleClick(circle) {
        if (this.audioManager) {
            this.audioManager.playSFX('correct');
        }
        
        circle.filledParts = (circle.filledParts + 1) % (circle.denominator + 1);
    }

    createSwingingMonkey(x, y) {
        const swingingMonkey = {
            x: x,
            y: y,
            life: 2000,
            swingTime: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.swingTime += deltaTime;
                
                const swingProgress = this.swingTime / 500;
                const swingOffset = Math.sin(swingProgress * Math.PI) * 30;
                this.x = x + swingOffset;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                ctx.fillStyle = '#8B4513';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('🐵', this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(swingingMonkey);
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
        if (this.currentProblem.type === 'fractions') {
            this.addFractionVisuals();
        } else if (this.currentProblem.type === 'mixed_operations') {
            this.addMixedOperationVisuals();
        }
    }

    addFractionVisuals() {
        // Create visual fraction representation
        if (this.currentProblem.operation) {
            const match = this.currentProblem.operation.match(/(\d+)\/(\d+)/);
            if (match) {
                const numerator = parseInt(match[1]);
                const denominator = parseInt(match[2]);
                
                this.createFractionVisualization(numerator, denominator, 500, 150);
            }
        }
    }

    addMixedOperationVisuals() {
        // Create step-by-step visualization for mixed operations
        const operation = this.currentProblem.operation;
        this.createMixedOperationSteps(operation, 400, 120);
    }

    createFractionVisualization(numerator, denominator, x, y) {
        // Create large visual fraction
        const fractionCircle = {
            x: x,
            y: y,
            numerator: numerator,
            denominator: denominator,
            isProblemVisual: true,
            
            render: function(ctx) {
                const radius = 60;
                
                // Draw circle outline
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Draw division lines
                for (let d = 0; d < this.denominator; d++) {
                    const angle = (d / this.denominator) * Math.PI * 2 - Math.PI / 2;
                    const endX = this.x + Math.cos(angle) * radius;
                    const endY = this.y + Math.sin(angle) * radius;
                    
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }
                
                // Fill the numerator parts
                for (let n = 0; n < this.numerator; n++) {
                    const startAngle = (n / this.denominator) * Math.PI * 2 - Math.PI / 2;
                    const endAngle = ((n + 1) / this.denominator) * Math.PI * 2 - Math.PI / 2;
                    
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.arc(this.x, this.y, radius, startAngle, endAngle);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // Show fraction text
                ctx.fillStyle = '#8B4513';
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`${this.numerator}/${this.denominator}`, this.x, this.y + radius + 40);
            }
        };
        
        this.gameEngine.addSprite(fractionCircle);
    }

    createMixedOperationSteps(operation, x, y) {
        // Create step-by-step breakdown
        const steps = {
            x: x,
            y: y,
            operation: operation,
            isProblemVisual: true,
            
            render: function(ctx) {
                ctx.fillStyle = '#8B4513';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                // Show the operation
                ctx.fillText('Step by step:', this.x, this.y);
                ctx.fillText(this.operation, this.x, this.y + 40);
                
                // Add helpful arrows and labels
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.fillText('↓', this.x, this.y + 70);
                ctx.fillText('Solve step by step!', this.x, this.y + 100);
            }
        };
        
        this.gameEngine.addSprite(steps);
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`MonkeyJungle: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
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
        console.log(`Monkey Jungle: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
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
        
        // Make all monkeys swing
        this.monkeys.forEach(monkey => {
            monkey.isSwinging = true;
            monkey.swingAnimationTime = 0;
            monkey.happiness = 100;
            monkey.energy = 100;
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around monkeys
        this.monkeys.forEach(monkey => {
            this.gameEngine.createCelebrationParticles(monkey.x, monkey.y);
        });
        
        // Create jungle celebration
        this.createJungleCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createJungleCelebration() {
        const celebration = {
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
                ctx.fillStyle = '#228B22';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('JUNGLE PARTY!', this.x, this.y);
                ctx.fillText('JUNGLE PARTY!', this.x, this.y);
                
                // Draw swinging monkeys
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🐵🌿🐵🌿🐵', this.x, this.y + 60);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebration);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with monkey helper
        const hintBubble = {
            x: 600,
            y: 150,
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
                ctx.fillStyle = 'rgba(144, 238, 144, 0.95)';
                ctx.strokeStyle = '#228B22';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 150, this.y - 50, 300, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw bubble tail
                ctx.beginPath();
                ctx.moveTo(this.x - 35, this.y + 50);
                ctx.lineTo(this.x - 25, this.y + 70);
                ctx.lineTo(this.x - 15, this.y + 50);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Draw text with word wrap
                ctx.fillStyle = '#8B4513';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const words = this.text.split(' ');
                let line = '';
                let y = this.y - 20;
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;
                    
                    if (testWidth > 280 && i > 0) {
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
            text: 'Monkey Jungle Complete!',
            subtext: 'You mastered fractions! The monkeys are swinging with joy!',
            life: 6000,
            opacity: 1,
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, 1200, 800);
                
                // Draw main text
                ctx.fillStyle = '#228B22';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(this.text, this.x, this.y);
                ctx.fillText(this.text, this.x, this.y);
                
                // Draw subtext
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.subtext, this.x, this.y + 45);
                
                // Draw celebration monkeys
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🐵🌴🐵', this.x, this.y + 120);
                
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
        console.log('Monkey Jungle completed! Returning to habitat selection...');
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
        this.monkeys.forEach(monkey => {
            if (monkey.update) {
                monkey.update(deltaTime);
            }
        });
        
        // Update vines
        this.vines.forEach(vine => {
            if (vine.update) {
                vine.update(deltaTime);
            }
        });
        
        // Update canopy layers
        this.canopyLayers.forEach(layer => {
            if (layer.update) {
                layer.update(deltaTime);
            }
        });
        
        // Update insects
        this.insects.forEach(insect => {
            if (insect.update) {
                insect.update(deltaTime);
            }
        });
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 100000) { // 100 second timeout for fractions
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
        this.monkeys = [];
        this.bananaGroves = [];
        this.vines = [];
        this.coconutPalms = [];
        this.treeHouses = [];
        this.canopyLayers = [];
        this.insects = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonkeyJungle;
}