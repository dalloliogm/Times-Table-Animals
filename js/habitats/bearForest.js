// Bear Forest Habitat for Times Table Animals
// Eighth habitat focusing on mixed operations and word problems

class BearForest {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 11;
        this.nextProblemTimer = null;
        
        // Habitat elements
        this.bears = [];
        this.bees = [];
        this.honeyPots = [];
        this.berryBushes = [];
        this.caves = [];
        this.rivers = [];
        this.trees = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Forest environment
        this.leaves = [];
        this.fireflies = [];
        this.squirrels = [];
        this.woodpeckers = [];
        this.season = 'summer';
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('bearForest');
        this.gameEngine.setBackground('bearForest');
        
        // Create the forest environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createBearFamily();
        this.createForestFeatures();
        this.createForestEffects();
        this.addInteractiveElements();
    }

    createBearFamily() {
        // Create bear family with different characteristics
        const bearFamily = [
            { x: 200, y: 400, name: 'Papa Bear', type: 'adult_male', activity: 'fishing', honey: 15 },
            { x: 300, y: 380, name: 'Mama Bear', type: 'adult_female', activity: 'berry_picking', honey: 12 },
            { x: 250, y: 450, name: 'Brother Bear', type: 'young_male', activity: 'playing', honey: 8 },
            { x: 280, y: 470, name: 'Sister Bear', type: 'young_female', activity: 'learning', honey: 6 },
            { x: 600, y: 350, name: 'Grandpa Bear', type: 'elder_male', activity: 'storytelling', honey: 20 },
            { x: 650, y: 380, name: 'Grandma Bear', type: 'elder_female', activity: 'cooking', honey: 18 },
            { x: 800, y: 420, name: 'Uncle Bear', type: 'adult_male', activity: 'hunting', honey: 14 },
            { x: 500, y: 500, name: 'Cousin Bear', type: 'young_male', activity: 'climbing', honey: 7 },
            { x: 400, y: 320, name: 'Aunt Bear', type: 'adult_female', activity: 'gathering', honey: 16 },
            { x: 750, y: 480, name: 'Baby Bear', type: 'cub', activity: 'sleeping', honey: 3 },
            { x: 150, y: 320, name: 'Forest Bear', type: 'adult_male', activity: 'patrolling', honey: 11 }
        ];

        bearFamily.forEach((member, index) => {
            const bear = this.gameEngine.createSprite('penguin', member.x, member.y); // Using penguin sprite as bear
            bear.name = member.name;
            bear.type = member.type;
            bear.activity = member.activity;
            bear.honey = member.honey;
            bear.id = `bear_${index}`;
            bear.isMoving = false;
            bear.moveCooldown = Math.random() * 5000 + 3000;
            bear.originalX = member.x;
            bear.originalY = member.y;
            bear.energy = 100;
            bear.happiness = Math.random() * 30 + 70;
            
            // Type-based characteristics
            switch (member.type) {
                case 'adult_male':
                    bear.width = 90;
                    bear.height = 80;
                    bear.tintColor = '#8B4513';
                    bear.strength = 90;
                    break;
                case 'adult_female':
                    bear.width = 75;
                    bear.height = 70;
                    bear.tintColor = '#A0522D';
                    bear.strength = 75;
                    break;
                case 'young_male':
                case 'young_female':
                    bear.width = 50;
                    bear.height = 45;
                    bear.tintColor = '#DEB887';
                    bear.strength = 40;
                    bear.moveCooldown *= 0.6; // Young bears move more
                    break;
                case 'elder_male':
                case 'elder_female':
                    bear.width = 85;
                    bear.height = 75;
                    bear.tintColor = '#696969';
                    bear.strength = 60;
                    bear.moveCooldown *= 1.8; // Elder bears move less
                    break;
                case 'cub':
                    bear.width = 35;
                    bear.height = 30;
                    bear.tintColor = '#F5DEB3';
                    bear.strength = 20;
                    bear.moveCooldown *= 0.3; // Cubs are very active
                    break;
            }
            
            // Add bear behavior
            bear.update = (deltaTime) => {
                this.updateBear(bear, deltaTime);
            };
            
            bear.onClick = () => {
                this.onBearClick(bear);
            };
            
            this.bears.push(bear);
            this.gameEngine.addSprite(bear);
        });
    }

    updateBear(bear, deltaTime) {
        // Handle movement animation
        bear.moveCooldown -= deltaTime;
        
        if (bear.moveCooldown <= 0 && !bear.isMoving) {
            bear.isMoving = true;
            bear.moveCooldown = Math.random() * 6000 + 4000;
            if (bear.type.includes('young') || bear.type === 'cub') bear.moveCooldown *= 0.6;
            if (bear.type.includes('elder')) bear.moveCooldown *= 1.8;
            
            bear.moveAnimationTime = 0;
            bear.moveDirection = Math.random() * Math.PI * 2;
            bear.moveDistance = Math.random() * 50 + 30;
        }
        
        if (bear.isMoving) {
            bear.moveAnimationTime += deltaTime;
            const moveProgress = bear.moveAnimationTime / 3000; // 3 second move
            
            if (moveProgress <= 1) {
                // Bear walking motion
                const moveX = Math.sin(moveProgress * Math.PI) * bear.moveDistance * Math.cos(bear.moveDirection);
                const moveY = Math.sin(moveProgress * Math.PI) * bear.moveDistance * 0.5 * Math.sin(bear.moveDirection);
                
                bear.x = bear.originalX + moveX;
                bear.y = bear.originalY + moveY;
                
                // Add walking bob
                const bobbing = Math.sin(moveProgress * Math.PI * 6) * 2;
                bear.y += bobbing;
                
                // Keep bears in forest bounds
                bear.x = Math.max(50, Math.min(1150, bear.x));
                bear.y = Math.max(250, Math.min(650, bear.y));
            } else {
                bear.isMoving = false;
                bear.x = bear.originalX;
                bear.y = bear.originalY;
            }
        }
        
        // Update energy and happiness based on activity
        switch (bear.activity) {
            case 'fishing':
                bear.energy = Math.max(50, bear.energy - deltaTime / 200);
                bear.happiness = Math.min(100, bear.happiness + deltaTime / 300);
                break;
            case 'berry_picking':
                bear.energy = Math.max(60, bear.energy - deltaTime / 250);
                bear.happiness = Math.min(100, bear.happiness + deltaTime / 200);
                break;
            case 'playing':
                bear.energy = Math.max(30, bear.energy - deltaTime / 150);
                bear.happiness = Math.min(100, bear.happiness + deltaTime / 100);
                break;
            case 'sleeping':
                bear.energy = Math.min(100, bear.energy + deltaTime / 100);
                bear.happiness = Math.min(100, bear.happiness + deltaTime / 400);
                break;
            case 'storytelling':
                bear.energy = Math.max(70, bear.energy - deltaTime / 400);
                bear.happiness = Math.min(100, bear.happiness + deltaTime / 150);
                break;
        }
    }

    onBearClick(bear) {
        if (this.audioManager) {
            this.audioManager.playSFX('bear-growl');
        }
        
        // Make bear move
        bear.isMoving = true;
        bear.moveAnimationTime = 0;
        
        // Show bear info
        this.showBearInfo(bear);
        
        // Activity-based actions
        switch (bear.activity) {
            case 'fishing':
                this.createFishingAnimation(bear.x, bear.y);
                bear.honey += 2;
                break;
            case 'berry_picking':
                this.createBerryPickingAnimation(bear.x, bear.y);
                bear.honey += 1;
                break;
            case 'playing':
                this.createPlayAnimation(bear.x, bear.y);
                bear.happiness = Math.min(100, bear.happiness + 10);
                break;
            case 'storytelling':
                this.createStoryAnimation(bear.x, bear.y);
                break;
            case 'sleeping':
                this.createSleepAnimation(bear.x, bear.y);
                bear.energy = Math.min(100, bear.energy + 15);
                break;
        }
        
        // Restore some energy
        bear.energy = Math.min(100, bear.energy + 10);
    }

    showBearInfo(bear) {
        const infoSprite = {
            x: bear.x + 50,
            y: bear.y - 100,
            text: `${bear.name}\n${bear.type}\n${bear.activity}\n🍯 ${bear.honey} 😊 ${Math.floor(bear.happiness)}%`,
            life: 4000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 4000);
                this.y -= deltaTime / 80;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw info bubble
                ctx.fillStyle = 'rgba(222, 184, 135, 0.9)';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 60, this.y - 50, 120, 100, 12);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#654321';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 35 + index * 16);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(infoSprite);
    }

    createFishingAnimation(x, y) {
        const fishing = {
            x: x + 30,
            y: y + 20,
            life: 2500,
            catchTime: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.catchTime += deltaTime;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2500;
                
                // Draw fishing rod
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x - 30, this.y - 10);
                ctx.lineTo(this.x + 20, this.y + 30);
                ctx.stroke();
                
                // Draw fishing line
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x + 20, this.y + 30);
                ctx.lineTo(this.x + 25, this.y + 60);
                ctx.stroke();
                
                // Draw fish if caught
                if (this.catchTime > 1500) {
                    ctx.fillStyle = '#FF6347';
                    ctx.font = '20px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('🐟', this.x + 25, this.y + 55);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(fishing);
    }

    createBerryPickingAnimation(x, y) {
        const berryPicking = {
            x: x,
            y: y - 30,
            life: 2000,
            berryCount: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.berryCount = Math.floor((2000 - this.life) / 400);
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                
                // Draw berry bush
                ctx.fillStyle = '#228B22';
                ctx.beginPath();
                ctx.arc(this.x, this.y, 25, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw berries
                ctx.fillStyle = '#8B0000';
                for (let i = 0; i < Math.min(this.berryCount, 5); i++) {
                    const angle = (i / 5) * Math.PI * 2;
                    const bx = this.x + Math.cos(angle) * 15;
                    const by = this.y + Math.sin(angle) * 15;
                    ctx.beginPath();
                    ctx.arc(bx, by, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Show berry count
                ctx.fillStyle = '#8B0000';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`🫐 ${this.berryCount}`, this.x, this.y + 45);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(berryPicking);
    }

    createPlayAnimation(x, y) {
        const playAnimation = {
            x: x,
            y: y,
            life: 2000,
            playTime: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.playTime += deltaTime;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                
                // Draw play elements
                const bounce = Math.sin(this.playTime / 200) * 10;
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('⚽', this.x + bounce, this.y - 20);
                ctx.fillText('🎾', this.x - bounce, this.y + 10);
                
                // Draw fun particles
                ctx.fillStyle = '#FF69B4';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.fillText('✨', this.x + 20, this.y - bounce);
                ctx.fillText('✨', this.x - 20, this.y + bounce);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(playAnimation);
    }

    createStoryAnimation(x, y) {
        const storyBubble = {
            x: x,
            y: y - 80,
            life: 3500,
            storyIndex: 0,
            stories: [
                "Once upon a time...",
                "In a magical forest...",
                "The bears learned math...",
                "And lived happily!"
            ],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.storyIndex = Math.floor((3500 - this.life) / 875);
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3500;
                
                // Draw story bubble
                ctx.fillStyle = 'rgba(255, 248, 220, 0.9)';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 30, 160, 60, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw story text
                ctx.fillStyle = '#654321';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                const currentStory = this.stories[Math.min(this.storyIndex, this.stories.length - 1)];
                ctx.fillText(currentStory, this.x, this.y);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(storyBubble);
    }

    createSleepAnimation(x, y) {
        const sleepAnimation = {
            x: x,
            y: y - 40,
            life: 2500,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2500;
                
                // Draw Z's for sleeping
                ctx.fillStyle = '#4169E1';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const time = (2500 - this.life) / 200;
                const z1Y = this.y - Math.sin(time) * 10;
                const z2Y = this.y - 20 - Math.sin(time + 1) * 10;
                const z3Y = this.y - 40 - Math.sin(time + 2) * 10;
                
                ctx.fillText('Z', this.x + 10, z1Y);
                ctx.fillText('Z', this.x + 20, z2Y);
                ctx.fillText('Z', this.x + 30, z3Y);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(sleepAnimation);
    }

    createForestFeatures() {
        // Create forest trees
        const treePositions = [
            { x: 100, y: 300, type: 'oak', height: 150, berries: 8 },
            { x: 300, y: 250, type: 'pine', height: 180, berries: 0 },
            { x: 500, y: 280, type: 'maple', height: 160, berries: 12 },
            { x: 700, y: 240, type: 'birch', height: 140, berries: 5 },
            { x: 900, y: 290, type: 'oak', height: 170, berries: 15 },
            { x: 1100, y: 260, type: 'pine', height: 190, berries: 0 },
            { x: 50, y: 500, type: 'maple', height: 120, berries: 7 },
            { x: 1150, y: 480, type: 'birch', height: 130, berries: 4 }
        ];

        treePositions.forEach((pos, index) => {
            const tree = {
                x: pos.x,
                y: pos.y,
                type: pos.type,
                height: pos.height,
                berries: pos.berries,
                swayTime: Math.random() * 1000,
                
                onClick: () => {
                    this.onTreeClick(tree);
                },
                
                update: function(deltaTime) {
                    this.swayTime += deltaTime;
                },
                
                render: function(ctx) {
                    const sway = Math.sin(this.swayTime / 2000) * 5;
                    
                    // Draw trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x - 8, this.y, 16, 80);
                    
                    // Draw leaves/needles
                    let leafColor = '#228B22';
                    switch (this.type) {
                        case 'oak':
                            leafColor = '#32CD32';
                            break;
                        case 'pine':
                            leafColor = '#006400';
                            break;
                        case 'maple':
                            leafColor = '#FF8C00';
                            break;
                        case 'birch':
                            leafColor = '#9ACD32';
                            break;
                    }
                    
                    ctx.fillStyle = leafColor;
                    if (this.type === 'pine') {
                        // Draw triangular pine
                        ctx.beginPath();
                        ctx.moveTo(this.x + sway, this.y - this.height);
                        ctx.lineTo(this.x - 40 + sway, this.y);
                        ctx.lineTo(this.x + 40 + sway, this.y);
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        // Draw round canopy
                        ctx.beginPath();
                        ctx.arc(this.x + sway, this.y - this.height/2, this.height/3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Draw berries if any
                    if (this.berries > 0) {
                        ctx.fillStyle = '#8B0000';
                        for (let i = 0; i < Math.min(this.berries, 10); i++) {
                            const angle = (i / 10) * Math.PI * 2;
                            const bx = this.x + Math.cos(angle) * (this.height/4) + sway;
                            const by = this.y - this.height/2 + Math.sin(angle) * (this.height/4);
                            ctx.beginPath();
                            ctx.arc(bx, by, 3, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        
                        // Show berry count
                        ctx.fillStyle = '#8B0000';
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText(`🫐 ${this.berries}`, this.x, this.y + 100);
                    }
                }
            };
            
            this.trees.push(tree);
            this.gameEngine.addSprite(tree);
        });

        // Create bear caves
        const cavePositions = [
            { x: 150, y: 600, name: 'Cozy Cave', occupant: 'Papa Bear', supplies: 25 },
            { x: 400, y: 580, name: 'Family Den', occupant: 'Bear Family', supplies: 40 },
            { x: 750, y: 620, name: 'Elder Cave', occupant: 'Grandparents', supplies: 30 },
            { x: 1000, y: 590, name: 'Storage Cave', occupant: 'None', supplies: 60 }
        ];

        cavePositions.forEach(pos => {
            const cave = {
                x: pos.x,
                y: pos.y,
                name: pos.name,
                occupant: pos.occupant,
                supplies: pos.supplies,
                type: 'bear_cave',
                
                onClick: () => {
                    this.onCaveClick(cave);
                },
                
                render: function(ctx) {
                    // Draw cave entrance
                    ctx.fillStyle = '#2F4F4F';
                    ctx.strokeStyle = '#708090';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 40, 0, Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw cave details
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 30, 0, Math.PI);
                    ctx.fill();
                    
                    // Show cave info
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.name, this.x, this.y + 60);
                    ctx.fillText(`🍯 ${this.supplies}`, this.x, this.y + 75);
                }
            };
            
            this.caves.push(cave);
            this.gameEngine.addSprite(cave);
        });

        // Create honey pots with word problems
        const honeyPositions = [
            { x: 250, y: 550, amount: 12.5, problem: 'bears shared 25 honey pots equally' },
            { x: 450, y: 520, amount: 8.75, problem: 'collected 35 honey, used 26.25' },
            { x: 650, y: 540, amount: 15.0, problem: '3 bears found 5 honey pots each' },
            { x: 850, y: 560, amount: 22.25, problem: 'had 18, found 4.25 more' }
        ];

        honeyPositions.forEach(pos => {
            const honeyPot = {
                x: pos.x,
                y: pos.y,
                amount: pos.amount,
                problem: pos.problem,
                type: 'honey_pot',
                isRevealed: false,
                
                onClick: () => {
                    this.onHoneyPotClick(honeyPot);
                },
                
                render: function(ctx) {
                    // Draw honey pot
                    ctx.fillStyle = '#DAA520';
                    ctx.strokeStyle = '#8B7D3A';
                    ctx.lineWidth = 2;
                    
                    // Pot body
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 20, 25, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Pot lid
                    ctx.fillStyle = '#CD853F';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y - 20, 22, 8, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Show problem if revealed
                    if (this.isRevealed) {
                        ctx.fillStyle = '#FF8C00';
                        ctx.font = '11px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        
                        // Word wrap the problem
                        const words = this.problem.split(' ');
                        let line = '';
                        let y = this.y + 45;
                        
                        for (let i = 0; i < words.length; i++) {
                            const testLine = line + words[i] + ' ';
                            const metrics = ctx.measureText(testLine);
                            
                            if (metrics.width > 120 && i > 0) {
                                ctx.fillText(line, this.x, y);
                                line = words[i] + ' ';
                                y += 14;
                            } else {
                                line = testLine;
                            }
                        }
                        ctx.fillText(line, this.x, y);
                        
                        // Show amount
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '14px "Comic Sans MS", cursive';
                        ctx.fillText(`= ${this.amount}`, this.x, y + 20);
                    }
                }
            };
            
            this.honeyPots.push(honeyPot);
            this.gameEngine.addSprite(honeyPot);
        });
    }

    createForestEffects() {
        // Create falling leaves
        for (let i = 0; i < 12; i++) {
            const leaf = {
                x: Math.random() * 1200,
                y: Math.random() * 800,
                size: Math.random() * 8 + 4,
                speed: Math.random() * 25 + 15,
                swayAmount: Math.random() * 30 + 10,
                swaySpeed: Math.random() * 2 + 1,
                color: ['#FF6347', '#FFD700', '#FF8C00', '#32CD32'][Math.floor(Math.random() * 4)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                
                update: function(deltaTime) {
                    this.y += this.speed * deltaTime / 1000;
                    this.x += Math.sin(this.y / 100) * this.swayAmount * deltaTime / 1000;
                    this.rotation += this.rotationSpeed * deltaTime;
                    
                    if (this.y > 850) {
                        this.y = -50;
                        this.x = Math.random() * 1200;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            };
            
            this.leaves.push(leaf);
            this.gameEngine.addSprite(leaf);
        }

        // Create fireflies for evening ambiance
        for (let i = 0; i < 8; i++) {
            const firefly = {
                x: Math.random() * 1200,
                y: Math.random() * 400 + 200,
                glowTime: Math.random() * 2000,
                glowDuration: 200,
                brightness: 0,
                directionX: (Math.random() - 0.5) * 20,
                directionY: (Math.random() - 0.5) * 20,
                
                update: function(deltaTime) {
                    this.glowTime += deltaTime;
                    this.x += this.directionX * deltaTime / 1000;
                    this.y += this.directionY * deltaTime / 1000;
                    
                    // Glow cycle
                    const cycle = this.glowTime % 3000;
                    if (cycle < this.glowDuration) {
                        this.brightness = Math.sin((cycle / this.glowDuration) * Math.PI);
                    } else {
                        this.brightness = 0;
                    }
                    
                    // Change direction occasionally
                    if (Math.random() < 0.001) {
                        this.directionX = (Math.random() - 0.5) * 20;
                        this.directionY = (Math.random() - 0.5) * 20;
                    }
                    
                    // Keep in bounds
                    if (this.x < 0 || this.x > 1200) this.directionX *= -1;
                    if (this.y < 150 || this.y > 650) this.directionY *= -1;
                    this.x = Math.max(0, Math.min(1200, this.x));
                    this.y = Math.max(150, Math.min(650, this.y));
                },
                
                render: function(ctx) {
                    if (this.brightness > 0) {
                        ctx.save();
                        ctx.globalAlpha = this.brightness;
                        ctx.fillStyle = '#FFFF00';
                        ctx.shadowColor = '#FFFF00';
                        ctx.shadowBlur = 10;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }
                }
            };
            
            this.fireflies.push(firefly);
            this.gameEngine.addSprite(firefly);
        }
    }

    addInteractiveElements() {
        // Create word problem stations
        this.createWordProblemStations();
        
        // Create mixed operation challenges
        this.createMixedOperationChallenges();
    }

    createWordProblemStations() {
        const stations = [
            { 
                x: 300, y: 150, 
                problem: "5 bears each found 3 honey pots. How many total?",
                answer: 15,
                type: 'multiplication_word'
            },
            { 
                x: 600, y: 120, 
                problem: "18 berries shared equally among 6 bears. How many each?",
                answer: 3,
                type: 'division_word'
            },
            { 
                x: 900, y: 140, 
                problem: "Bear family had 25 honey, used 8, found 12 more. Total now?",
                answer: 29,
                type: 'mixed_word'
            }
        ];

        stations.forEach(station => {
            const problemStation = {
                x: station.x,
                y: station.y,
                problem: station.problem,
                answer: station.answer,
                type: station.type,
                isSolved: false,
                
                onClick: () => {
                    this.onWordProblemClick(problemStation);
                },
                
                render: function(ctx) {
                    // Draw problem platform
                    ctx.fillStyle = this.isSolved ? '#90EE90' : '#DEB887';
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 60, this.y - 25, 120, 50, 10);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw problem text (shortened)
                    ctx.fillStyle = '#654321';
                    ctx.font = '10px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('Word Problem', this.x, this.y - 10);
                    ctx.fillText('Click to solve!', this.x, this.y + 5);
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.fillText(`✓ ${this.answer}`, this.x, this.y + 20);
                    }
                }
            };
            
            this.gameEngine.addSprite(problemStation);
        });
    }

    createMixedOperationChallenges() {
        const challenges = [
            { x: 200, y: 680, operations: ['8 + 4', '6 × 2', '15 - 3'], answer: 12 },
            { x: 500, y: 700, operations: ['9 × 2', '20 - 2', '24 ÷ 2'], answer: 18 },
            { x: 800, y: 690, operations: ['5 + 3', '4 × 2', '10 - 2'], answer: 8 }
        ];

        challenges.forEach(challenge => {
            const mixedChallenge = {
                x: challenge.x,
                y: challenge.y,
                operations: challenge.operations,
                answer: challenge.answer,
                currentStep: 0,
                isSolved: false,
                
                onClick: () => {
                    this.onMixedChallengeClick(mixedChallenge);
                },
                
                render: function(ctx) {
                    // Draw challenge platform
                    ctx.fillStyle = this.isSolved ? '#90EE90' : '#FFB6C1';
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 70, this.y - 30, 140, 60, 15);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw operations
                    ctx.fillStyle = '#654321';
                    ctx.font = '11px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    
                    ctx.fillText('Mixed Operations:', this.x, this.y - 15);
                    
                    this.operations.forEach((op, index) => {
                        const color = index <= this.currentStep ? '#008000' : '#654321';
                        ctx.fillStyle = color;
                        ctx.fillText(op, this.x, this.y + index * 12 - 3);
                    });
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '14px "Comic Sans MS", cursive';
                        ctx.fillText(`All = ${this.answer}`, this.x, this.y + 25);
                    }
                }
            };
            
            this.gameEngine.addSprite(mixedChallenge);
        });
    }

    onTreeClick(tree) {
        if (this.audioManager) {
            this.audioManager.playSFX('rustle-leaves');
        }
        
        if (tree.berries > 0) {
            tree.berries = Math.max(0, tree.berries - 1);
            this.createBerryFallAnimation(tree.x, tree.y);
        }
    }

    onCaveClick(cave) {
        if (this.audioManager) {
            this.audioManager.playSFX('cave-echo');
        }
        
        this.showCaveInfo(cave);
    }

    onHoneyPotClick(honeyPot) {
        if (this.audioManager) {
            this.audioManager.playSFX('honey-splash');
        }
        
        honeyPot.isRevealed = !honeyPot.isRevealed;
    }

    onWordProblemClick(station) {
        if (this.audioManager) {
            this.audioManager.playSFX(station.isSolved ? 'already-solved' : 'problem-reveal');
        }
        
        if (!station.isSolved) {
            this.showWordProblemDialog(station);
        }
    }

    onMixedChallengeClick(challenge) {
        if (this.audioManager) {
            this.audioManager.playSFX('challenge-step');
        }
        
        if (!challenge.isSolved) {
            challenge.currentStep = Math.min(challenge.currentStep + 1, challenge.operations.length);
            if (challenge.currentStep >= challenge.operations.length) {
                challenge.isSolved = true;
            }
        }
    }

    createBerryFallAnimation(x, y) {
        const berry = {
            x: x + (Math.random() - 0.5) * 40,
            y: y - 50,
            life: 1500,
            velocity: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.velocity += deltaTime / 100; // gravity
                this.y += this.velocity;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 1500;
                ctx.fillStyle = '#8B0000';
                ctx.beginPath();
                ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(berry);
    }

    showCaveInfo(cave) {
        const caveInfo = {
            x: cave.x,
            y: cave.y - 100,
            text: `${cave.name}\nOccupant: ${cave.occupant}\nSupplies: ${cave.supplies}`,
            life: 3500,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 3500);
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 30, 140, 60, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#654321';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 15 + index * 15);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(caveInfo);
    }

    showWordProblemDialog(station) {
        const dialog = {
            x: 600,
            y: 250,
            problem: station.problem,
            answer: station.answer,
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
                
                // Draw dialog background
                ctx.fillStyle = 'rgba(255, 248, 220, 0.95)';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 200, this.y - 80, 400, 160, 20);
                ctx.fill();
                ctx.stroke();
                
                // Draw problem text
                ctx.fillStyle = '#654321';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                // Word wrap
                const words = this.problem.split(' ');
                let line = '';
                let y = this.y - 40;
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width > 360 && i > 0) {
                        ctx.fillText(line, this.x, y);
                        line = words[i] + ' ';
                        y += 22;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, this.x, y);
                
                // Show answer
                ctx.fillStyle = '#FFD700';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillText(`Answer: ${this.answer}`, this.x, this.y + 40);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(dialog);
        station.isSolved = true;
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
        if (this.currentProblem.type === 'mixed_operations') {
            this.addMixedOperationVisuals();
        } else if (this.currentProblem.type === 'word_problems') {
            this.addWordProblemVisuals();
        }
    }

    addMixedOperationVisuals() {
        // Create mixed operation visualization
        this.createMixedOperationWorkspace(500, 120);
    }

    addWordProblemVisuals() {
        // Create word problem visualization
        this.createWordProblemWorkspace(450, 100);
    }

    createMixedOperationWorkspace(x, y) {
        const workspace = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw workspace
                ctx.fillStyle = 'rgba(222, 184, 135, 0.8)';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 130, this.y - 50, 260, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw operation symbols
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#654321';
                ctx.fillText('+ - × ÷', this.x, this.y - 10);
                
                // Draw helper text
                ctx.fillStyle = '#8B4513';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Mixed Operations!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(workspace);
    }

    createWordProblemWorkspace(x, y) {
        const workspace = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw workspace
                ctx.fillStyle = 'rgba(255, 248, 220, 0.8)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 140, this.y - 50, 280, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw reading symbols
                ctx.font = '28px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('📖', this.x - 60, this.y - 5);
                ctx.fillText('🐻', this.x, this.y - 5);
                ctx.fillText('🍯', this.x + 60, this.y - 5);
                
                // Draw helper text
                ctx.fillStyle = '#654321';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Read carefully and solve!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(workspace);
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`BearForest: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
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
        console.log(`Bear Forest: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
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
        
        // Make all bears happy and move
        this.bears.forEach(bear => {
            bear.isMoving = true;
            bear.moveAnimationTime = 0;
            bear.happiness = 100;
            bear.energy = Math.min(100, bear.energy + 20);
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around bears
        this.bears.forEach(bear => {
            this.gameEngine.createCelebrationParticles(bear.x, bear.y);
        });
        
        // Create forest celebration
        this.createForestCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createForestCelebration() {
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
                ctx.fillStyle = '#8B4513';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('BEAR-IFIC!', this.x, this.y);
                ctx.fillText('BEAR-IFIC!', this.x, this.y);
                
                // Draw happy bears
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🐻🍯🐻', this.x, this.y + 60);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebration);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with helpful bear
        const hintBubble = {
            x: 600,
            y: 170,
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
                ctx.fillStyle = 'rgba(222, 184, 135, 0.95)';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 150, this.y - 50, 300, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw bubble tail
                ctx.beginPath();
                ctx.moveTo(this.x - 40, this.y + 50);
                ctx.lineTo(this.x - 30, this.y + 70);
                ctx.lineTo(this.x - 20, this.y + 50);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Draw text with word wrap
                ctx.fillStyle = '#654321';
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
            text: 'Bear Forest Complete!',
            subtext: 'You mastered mixed operations! The bears are proud!',
            life: 6000,
            opacity: 1,
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, 1200, 800);
                
                // Draw main text
                ctx.fillStyle = '#8B4513';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(this.text, this.x, this.y);
                ctx.fillText(this.text, this.x, this.y);
                
                // Draw subtext
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.subtext, this.x, this.y + 45);
                
                // Draw celebration bears
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🐻🌲🐻', this.x, this.y + 120);
                
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
        console.log('Bear Forest completed! Returning to habitat selection...');
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
        this.bears.forEach(bear => {
            if (bear.update) {
                bear.update(deltaTime);
            }
        });
        
        // Update leaves
        this.leaves.forEach(leaf => {
            if (leaf.update) {
                leaf.update(deltaTime);
            }
        });
        
        // Update fireflies
        this.fireflies.forEach(firefly => {
            if (firefly.update) {
                firefly.update(deltaTime);
            }
        });
        
        // Update trees
        this.trees.forEach(tree => {
            if (tree.update) {
                tree.update(deltaTime);
            }
        });
        
        // Update treasure
        this.honeyPots.forEach(honeyPot => {
            if (honeyPot.update) {
                honeyPot.update(deltaTime);
            }
        });
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 120000) { // 2 minute timeout for mixed operations
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
        this.bears = [];
        this.bees = [];
        this.honeyPots = [];
        this.berryBushes = [];
        this.caves = [];
        this.rivers = [];
        this.trees = [];
        this.leaves = [];
        this.fireflies = [];
        this.squirrels = [];
        this.woodpeckers = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BearForest;
}