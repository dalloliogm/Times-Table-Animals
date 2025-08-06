// Lion Pride Habitat for Times Table Animals
// Sixth habitat focusing on equations and word problems

class LionPride {
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
        this.lions = [];
        this.cubs = [];
        this.wateringHoles = [];
        this.huntingGrounds = [];
        this.rocks = [];
        this.acaciaTrees = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Pride land environment
        this.grassland = [];
        this.antelopes = [];
        this.vultures = [];
        this.sunPosition = { x: 1000, y: 120 };
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('lionPride');
        this.gameEngine.setBackground('lionPride');
        
        // Create the pride land environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createLionPride();
        this.createPrideLandFeatures();
        this.createWildlifeElements();
        this.addInteractiveElements();
    }

    createLionPride() {
        // Create the lion pride with different roles
        const prideMembers = [
            { x: 400, y: 300, name: 'Rex', role: 'alpha_male', age: 'adult' },
            { x: 350, y: 280, name: 'Mane', role: 'male', age: 'adult' },
            { x: 300, y: 320, name: 'Nala', role: 'female', age: 'adult' },
            { x: 320, y: 350, name: 'Sarabi', role: 'female', age: 'adult' },
            { x: 450, y: 350, name: 'Sarafina', role: 'female', age: 'adult' },
            { x: 380, y: 380, name: 'Simba', role: 'cub', age: 'young' },
            { x: 420, y: 370, name: 'Kiara', role: 'cub', age: 'young' },
            { x: 360, y: 400, name: 'Kovu', role: 'cub', age: 'young' },
            { x: 500, y: 320, name: 'Zazu', role: 'advisor', age: 'adult' },
            { x: 280, y: 380, name: 'Timon', role: 'friend', age: 'adult' },
            { x: 480, y: 400, name: 'Pumbaa', role: 'friend', age: 'adult' },
            { x: 550, y: 280, name: 'Rafiki', role: 'wise', age: 'elder' }
        ];

        prideMembers.forEach((member, index) => {
            const lion = this.gameEngine.createSprite('lion', member.x, member.y);
            lion.name = member.name;
            lion.role = member.role;
            lion.age = member.age;
            lion.id = `lion_${index}`;
            lion.isRoaming = false;
            lion.roamCooldown = Math.random() * 5000 + 3000;
            lion.originalX = member.x;
            lion.originalY = member.y;
            lion.strength = 100;
            lion.hunger = Math.random() * 40 + 20;
            lion.territory = { x: member.x, y: member.y, radius: 50 };
            
            // Role-based characteristics
            switch (member.role) {
                case 'alpha_male':
                    lion.width = 100;
                    lion.height = 80;
                    lion.tintColor = '#DAA520';
                    lion.strength = 150;
                    break;
                case 'male':
                    lion.width = 90;
                    lion.height = 70;
                    lion.tintColor = '#CD853F';
                    break;
                case 'female':
                    lion.width = 80;
                    lion.height = 60;
                    lion.tintColor = '#DEB887';
                    break;
                case 'cub':
                    lion.width = 50;
                    lion.height = 40;
                    lion.tintColor = '#F5DEB3';
                    lion.roamCooldown *= 0.5; // Cubs are more active
                    this.cubs.push(lion);
                    break;
                case 'advisor':
                    lion.tintColor = '#4169E1'; // Blue for Zazu
                    lion.width = 30;
                    lion.height = 25;
                    break;
                case 'friend':
                    lion.tintColor = member.name === 'Timon' ? '#8B4513' : '#A0522D';
                    lion.width = 40;
                    lion.height = 35;
                    break;
                case 'wise':
                    lion.tintColor = '#A0A0A0'; // Gray for wisdom
                    break;
            }
            
            // Add lion behavior
            lion.update = (deltaTime) => {
                this.updateLion(lion, deltaTime);
            };
            
            lion.onClick = () => {
                this.onLionClick(lion);
            };
            
            this.lions.push(lion);
            this.gameEngine.addSprite(lion);
        });
    }

    updateLion(lion, deltaTime) {
        // Handle roaming animation
        lion.roamCooldown -= deltaTime;
        
        if (lion.roamCooldown <= 0 && !lion.isRoaming) {
            lion.isRoaming = true;
            lion.roamCooldown = Math.random() * 6000 + 4000;
            if (lion.role === 'cub') lion.roamCooldown *= 0.6;
            
            lion.roamAnimationTime = 0;
            lion.roamDirection = Math.random() * Math.PI * 2;
            lion.roamDistance = Math.random() * 30 + 20;
        }
        
        if (lion.isRoaming) {
            lion.roamAnimationTime += deltaTime;
            const roamProgress = lion.roamAnimationTime / 3000; // 3 second roam
            
            if (roamProgress <= 1) {
                // Roam within territory
                const roamX = Math.sin(roamProgress * Math.PI) * lion.roamDistance * Math.cos(lion.roamDirection);
                const roamY = Math.sin(roamProgress * Math.PI) * lion.roamDistance * Math.sin(lion.roamDirection);
                
                lion.x = lion.originalX + roamX;
                lion.y = lion.originalY + roamY;
                
                // Keep within territory bounds
                const distFromCenter = Math.sqrt(
                    Math.pow(lion.x - lion.territory.x, 2) + 
                    Math.pow(lion.y - lion.territory.y, 2)
                );
                
                if (distFromCenter > lion.territory.radius) {
                    const angle = Math.atan2(lion.y - lion.territory.y, lion.x - lion.territory.x);
                    lion.x = lion.territory.x + Math.cos(angle) * lion.territory.radius;
                    lion.y = lion.territory.y + Math.sin(angle) * lion.territory.radius;
                }
            } else {
                lion.isRoaming = false;
                // Don't reset to original position, stay where roaming ended
            }
        }
        
        // Update hunger and strength
        lion.hunger = Math.min(100, lion.hunger + deltaTime / 200);
        if (lion.hunger > 80) {
            lion.strength = Math.max(20, lion.strength - deltaTime / 100);
        } else {
            lion.strength = Math.min(150, lion.strength + deltaTime / 300);
        }
    }

    onLionClick(lion) {
        if (this.audioManager) {
            this.audioManager.playSFX('lion-roar');
        }
        
        // Make lion roam
        lion.isRoaming = true;
        lion.roamAnimationTime = 0;
        
        // Show lion info
        this.showLionInfo(lion);
        
        // Role-specific actions
        switch (lion.role) {
            case 'alpha_male':
                this.createTerritoryRoar(lion.x, lion.y);
                break;
            case 'cub':
                this.createPlayfulBounce(lion.x, lion.y);
                break;
            case 'wise':
                this.createWisdomQuote(lion.x, lion.y);
                break;
        }
        
        // Reduce hunger slightly
        lion.hunger = Math.max(0, lion.hunger - 10);
        lion.strength = Math.min(150, lion.strength + 15);
    }

    showLionInfo(lion) {
        const infoSprite = {
            x: lion.x + 50,
            y: lion.y - 70,
            text: `${lion.name}\n${lion.role}\n💪 ${Math.floor(lion.strength)} 🍖 ${Math.floor(100-lion.hunger)}%`,
            life: 3500,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 3500);
                this.y -= deltaTime / 60;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw info bubble
                ctx.fillStyle = 'rgba(255, 218, 185, 0.9)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 50, this.y - 35, 100, 70, 12);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#8B4513';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 20 + index * 16);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(infoSprite);
    }

    createTerritoryRoar(x, y) {
        const roarEffect = {
            x: x,
            y: y - 40,
            life: 2000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 2;
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('ROAR!', this.x, this.y);
                ctx.fillText('ROAR!', this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(roarEffect);
    }

    createPlayfulBounce(x, y) {
        const bounceEffect = {
            x: x,
            y: y,
            life: 1500,
            bounceTime: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.bounceTime += deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 1500;
                const bounce = Math.sin(this.bounceTime / 200) * 10;
                ctx.fillStyle = '#FFB6C1';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Playful!', this.x, this.y + bounce);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(bounceEffect);
    }

    createWisdomQuote(x, y) {
        const quotes = [
            "Think carefully!",
            "The answer is within you!",
            "Step by step!",
            "You can do this!"
        ];
        
        const wisdomEffect = {
            x: x,
            y: y - 50,
            text: quotes[Math.floor(Math.random() * quotes.length)],
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
                ctx.fillStyle = '#9370DB';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(wisdomEffect);
    }

    createPrideLandFeatures() {
        // Create watering holes for gathering
        const wateringHolePositions = [
            { x: 200, y: 500, size: 'large' },
            { x: 600, y: 600, size: 'medium' },
            { x: 900, y: 550, size: 'small' }
        ];

        wateringHolePositions.forEach((pos, index) => {
            const hole = {
                x: pos.x,
                y: pos.y,
                type: 'watering_hole',
                size: pos.size,
                visitors: 0,
                maxVisitors: pos.size === 'large' ? 8 : pos.size === 'medium' ? 5 : 3,
                
                onClick: () => {
                    this.onWateringHoleClick(hole);
                },
                
                render: function(ctx) {
                    const radius = this.size === 'large' ? 50 : this.size === 'medium' ? 35 : 25;
                    
                    // Draw water
                    ctx.fillStyle = '#4169E1';
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw ripples
                    for (let i = 1; i <= 3; i++) {
                        ctx.strokeStyle = `rgba(65, 105, 225, ${0.3 / i})`;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, radius + i * 8, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    
                    // Show visitor count
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🦁 ${this.visitors}/${this.maxVisitors}`, this.x, this.y + radius + 25);
                }
            };
            
            this.wateringHoles.push(hole);
            this.gameEngine.addSprite(hole);
        });

        // Create pride rocks for territory marking
        const rockPositions = [
            { x: 150, y: 200, height: 'tall' },
            { x: 500, y: 150, height: 'medium' },
            { x: 800, y: 180, height: 'tall' },
            { x: 1000, y: 220, height: 'short' }
        ];

        rockPositions.forEach(pos => {
            const rock = {
                x: pos.x,
                y: pos.y,
                type: 'pride_rock',
                height: pos.height,
                
                onClick: () => {
                    this.onPrideRockClick(rock);
                },
                
                render: function(ctx) {
                    const rockHeight = this.height === 'tall' ? 80 : this.height === 'medium' ? 60 : 40;
                    const rockWidth = rockHeight * 1.2;
                    
                    // Draw rock
                    ctx.fillStyle = '#8B7355';
                    ctx.strokeStyle = '#654321';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, rockWidth/2, rockHeight/2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw rock texture
                    ctx.fillStyle = '#A0522D';
                    ctx.fillRect(this.x - 15, this.y - 10, 8, 6);
                    ctx.fillRect(this.x + 5, this.y + 5, 10, 4);
                    ctx.fillRect(this.x - 8, this.y + 15, 6, 5);
                }
            };
            
            this.rocks.push(rock);
            this.gameEngine.addSprite(rock);
        });

        // Create acacia trees for shade
        const treePositions = [
            { x: 100, y: 350 }, { x: 750, y: 400 }, { x: 1100, y: 300 }
        ];

        treePositions.forEach(pos => {
            const tree = {
                x: pos.x,
                y: pos.y,
                type: 'acacia_tree',
                lionsInShade: 0,
                
                onClick: () => {
                    this.onAcaciaTreeClick(tree);
                },
                
                render: function(ctx) {
                    // Draw trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x - 8, this.y + 30, 16, 50);
                    
                    // Draw canopy (acacia style - flat top)
                    ctx.fillStyle = '#228B22';
                    ctx.strokeStyle = '#006400';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 60, 30, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw shade
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y + 80, 80, 25, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Show lions in shade
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🦁 ${this.lionsInShade}`, this.x, this.y + 110);
                }
            };
            
            this.acaciaTrees.push(tree);
            this.gameEngine.addSprite(tree);
        });
    }

    createWildlifeElements() {
        // Create roaming antelopes (prey)
        for (let i = 0; i < 6; i++) {
            const antelope = {
                x: Math.random() * 800 + 200,
                y: Math.random() * 300 + 400,
                vx: (Math.random() - 0.5) * 30,
                vy: (Math.random() - 0.5) * 20,
                type: 'antelope',
                alertLevel: 0,
                
                update: function(deltaTime) {
                    this.x += this.vx * deltaTime / 1000;
                    this.y += this.vy * deltaTime / 1000;
                    
                    // Bounce off boundaries
                    if (this.x < 100 || this.x > 1100) this.vx *= -1;
                    if (this.y < 300 || this.y > 700) this.vy *= -1;
                    
                    // Keep in bounds
                    this.x = Math.max(100, Math.min(1100, this.x));
                    this.y = Math.max(300, Math.min(700, this.y));
                    
                    // Reduce alert level over time
                    this.alertLevel = Math.max(0, this.alertLevel - deltaTime / 100);
                },
                
                onClick: () => {
                    this.onAntelopeClick(antelope);
                },
                
                render: function(ctx) {
                    // Draw antelope
                    ctx.fillStyle = this.alertLevel > 50 ? '#CD853F' : '#DEB887';
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 1;
                    
                    // Body
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 20, 12, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Head
                    ctx.beginPath();
                    ctx.ellipse(this.x + 15, this.y - 5, 8, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Legs
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(this.x - 10, this.y + 12);
                    ctx.lineTo(this.x - 10, this.y + 25);
                    ctx.moveTo(this.x + 10, this.y + 12);
                    ctx.lineTo(this.x + 10, this.y + 25);
                    ctx.stroke();
                    
                    // Alert indicator
                    if (this.alertLevel > 30) {
                        ctx.fillStyle = '#FF0000';
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText('!', this.x, this.y - 20);
                    }
                }
            };
            
            this.antelopes.push(antelope);
            this.gameEngine.addSprite(antelope);
        }

        // Create circling vultures
        for (let i = 0; i < 3; i++) {
            const vulture = {
                centerX: 300 + i * 300,
                centerY: 200,
                radius: 80,
                angle: i * (Math.PI * 2 / 3),
                speed: 0.5,
                type: 'vulture',
                
                update: function(deltaTime) {
                    this.angle += this.speed * deltaTime / 1000;
                    this.x = this.centerX + Math.cos(this.angle) * this.radius;
                    this.y = this.centerY + Math.sin(this.angle) * this.radius;
                },
                
                render: function(ctx) {
                    ctx.fillStyle = '#2F4F4F';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('🦅', this.x, this.y);
                }
            };
            
            this.vultures.push(vulture);
            this.gameEngine.addSprite(vulture);
        }
    }

    addInteractiveElements() {
        // Create hunting grounds for word problems
        this.createHuntingGrounds();
        
        // Create equation solving stones
        this.createEquationStones();
    }

    createHuntingGrounds() {
        const huntingAreas = [
            { x: 300, y: 450, size: 'large' },
            { x: 700, y: 400, size: 'medium' },
            { x: 1000, y: 480, size: 'small' }
        ];

        huntingAreas.forEach((area, index) => {
            const huntingGround = {
                x: area.x,
                y: area.y,
                type: 'hunting_ground',
                size: area.size,
                preyCount: area.size === 'large' ? 12 : area.size === 'medium' ? 8 : 5,
                huntersNeeded: area.size === 'large' ? 4 : area.size === 'medium' ? 3 : 2,
                
                onClick: () => {
                    this.onHuntingGroundClick(huntingGround);
                },
                
                render: function(ctx) {
                    const radius = this.size === 'large' ? 60 : this.size === 'medium' ? 45 : 30;
                    
                    // Draw hunting area
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([10, 5]);
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                    // Draw prey symbols
                    const preyPositions = Math.min(this.preyCount, 6);
                    for (let i = 0; i < preyPositions; i++) {
                        const angle = (i / preyPositions) * Math.PI * 2;
                        const px = this.x + Math.cos(angle) * (radius * 0.7);
                        const py = this.y + Math.sin(angle) * (radius * 0.7);
                        
                        ctx.fillStyle = '#DEB887';
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText('🦌', px, py);
                    }
                    
                    // Show equation
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.preyCount} ÷ ${this.huntersNeeded} = ?`, this.x, this.y + radius + 25);
                }
            };
            
            this.huntingGrounds.push(huntingGround);
            this.gameEngine.addSprite(huntingGround);
        });
    }

    createEquationStones() {
        // Create stones with equations carved on them
        const equations = [
            { equation: '2x + 3 = 11', answer: 4 },
            { equation: '3x - 5 = 10', answer: 5 },
            { equation: '4x + 2 = 18', answer: 4 },
            { equation: '5x - 3 = 17', answer: 4 },
            { equation: '2x + 7 = 15', answer: 4 },
            { equation: '6x - 4 = 20', answer: 4 }
        ];

        equations.forEach((eq, index) => {
            const stone = {
                x: 200 + (index % 3) * 150,
                y: 100 + Math.floor(index / 3) * 80,
                type: 'equation_stone',
                equation: eq.equation,
                answer: eq.answer,
                isSolved: false,
                
                onClick: () => {
                    this.onEquationStoneClick(stone);
                },
                
                render: function(ctx) {
                    // Draw stone
                    ctx.fillStyle = this.isSolved ? '#32CD32' : '#808080';
                    ctx.strokeStyle = '#654321';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, 40, 25, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw equation
                    ctx.fillStyle = this.isSolved ? '#FFFFFF' : '#000000';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.equation, this.x, this.y);
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '16px "Comic Sans MS", cursive';
                        ctx.fillText('✓', this.x, this.y + 35);
                    }
                }
            };
            
            this.gameEngine.addSprite(stone);
        });
    }

    onWateringHoleClick(hole) {
        if (this.audioManager) {
            this.audioManager.playSFX('splash');
        }
        
        if (hole.visitors < hole.maxVisitors) {
            hole.visitors++;
        } else {
            hole.visitors = 0; // Lions leave
        }
    }

    onPrideRockClick(rock) {
        if (this.audioManager) {
            this.audioManager.playSFX('lion-roar');
        }
        
        this.createTerritoryRoar(rock.x, rock.y - 30);
    }

    onAcaciaTreeClick(tree) {
        if (this.audioManager) {
            this.audioManager.playSFX('leaves-rustle');
        }
        
        tree.lionsInShade = (tree.lionsInShade + 1) % 6;
    }

    onAntelopeClick(antelope) {
        if (this.audioManager) {
            this.audioManager.playSFX('startled');
        }
        
        // Make antelope alert and move away
        antelope.alertLevel = 100;
        antelope.vx *= 2;
        antelope.vy *= 2;
    }

    onHuntingGroundClick(huntingGround) {
        if (this.audioManager) {
            this.audioManager.playSFX('hunt-success');
        }
        
        if (huntingGround.preyCount > 0) {
            huntingGround.preyCount = Math.max(0, huntingGround.preyCount - huntingGround.huntersNeeded);
        } else {
            huntingGround.preyCount = huntingGround.size === 'large' ? 12 : huntingGround.size === 'medium' ? 8 : 5;
        }
    }

    onEquationStoneClick(stone) {
        if (this.audioManager) {
            this.audioManager.playSFX(stone.isSolved ? 'already-solved' : 'equation-reveal');
        }
        
        if (!stone.isSolved) {
            // Show the answer briefly
            stone.isSolved = true;
            setTimeout(() => {
                stone.isSolved = false;
            }, 2000);
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
        
        // Ensure GameController has the same problem reference and updates UI
        if (this.gameController && this.gameController.mathEngine) {
            this.gameController.mathEngine.currentProblem = this.currentProblem;
            // Also call GameController's updateProblemUI to ensure everything is synced
            if (this.gameController.updateProblemUI) {
                this.gameController.updateProblemUI();
            }
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
        if (this.currentProblem.type === 'equations') {
            this.addEquationVisuals();
        } else if (this.currentProblem.type === 'word_problems') {
            this.addWordProblemVisuals();
        }
    }

    addEquationVisuals() {
        // Create visual equation solving steps
        const equation = this.currentProblem.operation;
        this.createEquationSteps(equation, 500, 150);
    }

    addWordProblemVisuals() {
        // Create story visual elements
        this.createStoryElements(450, 120);
    }

    createEquationSteps(equation, x, y) {
        const steps = {
            x: x,
            y: y,
            equation: equation,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw equation solving area
                ctx.fillStyle = 'rgba(255, 218, 185, 0.8)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 40, 200, 80, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw equation
                ctx.fillStyle = '#8B4513';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Solve:', this.x, this.y - 15);
                ctx.fillText(this.equation, this.x, this.y + 15);
                
                // Draw helper text
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Find the value!', this.x, this.y + 35);
            }
        };
        
        this.gameEngine.addSprite(steps);
    }

    createStoryElements(x, y) {
        const storyVisual = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw story backdrop
                ctx.fillStyle = 'rgba(255, 248, 220, 0.9)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 120, this.y - 50, 240, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw story icons
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('📖', this.x - 60, this.y - 10);
                ctx.fillText('🦁', this.x, this.y - 10);
                ctx.fillText('🧮', this.x + 60, this.y - 10);
                
                // Draw helper text
                ctx.fillStyle = '#8B4513';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Listen to the story!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(storyVisual);
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`LionPride: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
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
        console.log(`Lion Pride: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
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
        
        // Make all lions roam
        this.lions.forEach(lion => {
            lion.isRoaming = true;
            lion.roamAnimationTime = 0;
            lion.strength = 150;
            lion.hunger = Math.max(0, lion.hunger - 20);
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around lions
        this.lions.forEach(lion => {
            this.gameEngine.createCelebrationParticles(lion.x, lion.y);
        });
        
        // Create pride celebration
        this.createPrideCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createPrideCelebration() {
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
                ctx.fillStyle = '#DAA520';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('PRIDE ROARS!', this.x, this.y);
                ctx.fillText('PRIDE ROARS!', this.x, this.y);
                
                // Draw roaring lions
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🦁👑🦁', this.x, this.y + 60);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebration);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with wise lion
        const hintBubble = {
            x: 600,
            y: 160,
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
                ctx.fillStyle = 'rgba(255, 218, 185, 0.95)';
                ctx.strokeStyle = '#DAA520';
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
            text: 'Lion Pride Complete!',
            subtext: 'You mastered equations! The pride celebrates your wisdom!',
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
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.subtext, this.x, this.y + 45);
                
                // Draw celebration lions
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🦁🏰🦁', this.x, this.y + 120);
                
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
        console.log('Lion Pride completed! Returning to habitat selection...');
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
        this.lions.forEach(lion => {
            if (lion.update) {
                lion.update(deltaTime);
            }
        });
        
        // Update antelopes
        this.antelopes.forEach(antelope => {
            if (antelope.update) {
                antelope.update(deltaTime);
            }
        });
        
        // Update vultures
        this.vultures.forEach(vulture => {
            if (vulture.update) {
                vulture.update(deltaTime);
            }
        });
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 100000) { // 100 second timeout for equations
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
        this.lions = [];
        this.cubs = [];
        this.wateringHoles = [];
        this.huntingGrounds = [];
        this.rocks = [];
        this.acaciaTrees = [];
        this.antelopes = [];
        this.vultures = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LionPride;
}