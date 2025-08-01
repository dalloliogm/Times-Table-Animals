// Dolphin Cove Habitat for Times Table Animals
// Seventh habitat focusing on decimals and measurement

class DolphinCove {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 14;
        this.nextProblemTimer = null;
        
        // Habitat elements
        this.dolphins = [];
        this.seaTurtles = [];
        this.coral = [];
        this.treasure = [];
        this.kelp = [];
        this.buoys = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Marine environment
        this.waves = [];
        this.bubbles = [];
        this.fish = [];
        this.jellyfish = [];
        this.seaLevel = 150;
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('dolphinCove');
        this.gameEngine.setBackground('dolphinCove');
        
        // Create the marine environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createDolphinPod();
        this.createMarineFeatures();
        this.createOceanEffects();
        this.addInteractiveElements();
    }

    createDolphinPod() {
        // Create dolphin pod with different characteristics
        const podMembers = [
            { x: 300, y: 200, name: 'Echo', type: 'adult', specialty: 'echolocation' },
            { x: 250, y: 180, name: 'Splash', type: 'adult', specialty: 'jumping' },
            { x: 450, y: 220, name: 'Flip', type: 'young', specialty: 'acrobatics' },
            { x: 400, y: 250, name: 'Bubbles', type: 'young', specialty: 'playful' },
            { x: 600, y: 190, name: 'Marina', type: 'adult', specialty: 'swimming' },
            { x: 550, y: 240, name: 'Coral', type: 'elder', specialty: 'wisdom' },
            { x: 350, y: 300, name: 'Tide', type: 'adult', specialty: 'diving' },
            { x: 500, y: 280, name: 'Wave', type: 'young', specialty: 'surfing' },
            { x: 750, y: 210, name: 'Pearl', type: 'adult', specialty: 'treasure_hunting' },
            { x: 700, y: 260, name: 'Reef', type: 'young', specialty: 'exploring' },
            { x: 200, y: 240, name: 'Azure', type: 'adult', specialty: 'teaching' },
            { x: 800, y: 180, name: 'Aqua', type: 'young', specialty: 'racing' },
            { x: 150, y: 200, name: 'Blue', type: 'elder', specialty: 'storytelling' },
            { x: 650, y: 320, name: 'Sandy', type: 'adult', specialty: 'shellfish_collecting' }
        ];

        podMembers.forEach((member, index) => {
            const dolphin = this.gameEngine.createSprite('penguin', member.x, member.y); // Using penguin sprite as dolphin
            dolphin.name = member.name;
            dolphin.type = member.type;
            dolphin.specialty = member.specialty;
            dolphin.id = `dolphin_${index}`;
            dolphin.isSwimming = false;
            dolphin.swimCooldown = Math.random() * 4000 + 2000;
            dolphin.originalX = member.x;
            dolphin.originalY = member.y;
            dolphin.oxygen = 100;
            dolphin.speed = Math.random() * 20 + 30;
            dolphin.depth = Math.random() * 100 + member.y;
            
            // Type-based characteristics
            switch (member.type) {
                case 'adult':
                    dolphin.width = 70;
                    dolphin.height = 50;
                    dolphin.tintColor = '#4682B4';
                    break;
                case 'young':
                    dolphin.width = 50;
                    dolphin.height = 35;
                    dolphin.tintColor = '#87CEEB';
                    dolphin.swimCooldown *= 0.7; // Younger dolphins swim more
                    break;
                case 'elder':
                    dolphin.width = 80;
                    dolphin.height = 60;
                    dolphin.tintColor = '#778899';
                    dolphin.swimCooldown *= 1.5; // Elder dolphins are calmer
                    break;
            }
            
            // Add dolphin behavior
            dolphin.update = (deltaTime) => {
                this.updateDolphin(dolphin, deltaTime);
            };
            
            dolphin.onClick = () => {
                this.onDolphinClick(dolphin);
            };
            
            this.dolphins.push(dolphin);
            this.gameEngine.addSprite(dolphin);
        });
    }

    updateDolphin(dolphin, deltaTime) {
        // Handle swimming animation
        dolphin.swimCooldown -= deltaTime;
        
        if (dolphin.swimCooldown <= 0 && !dolphin.isSwimming) {
            dolphin.isSwimming = true;
            dolphin.swimCooldown = Math.random() * 5000 + 3000;
            if (dolphin.type === 'young') dolphin.swimCooldown *= 0.7;
            if (dolphin.type === 'elder') dolphin.swimCooldown *= 1.5;
            
            dolphin.swimAnimationTime = 0;
            dolphin.swimDirection = Math.random() * Math.PI * 2;
            dolphin.swimDistance = Math.random() * 60 + 40;
        }
        
        if (dolphin.isSwimming) {
            dolphin.swimAnimationTime += deltaTime;
            const swimProgress = dolphin.swimAnimationTime / 2500; // 2.5 second swim
            
            if (swimProgress <= 1) {
                // Graceful swimming motion
                const swimX = Math.sin(swimProgress * Math.PI) * dolphin.swimDistance * Math.cos(dolphin.swimDirection);
                const swimY = Math.sin(swimProgress * Math.PI) * dolphin.swimDistance * 0.3 * Math.sin(dolphin.swimDirection);
                
                dolphin.x = dolphin.originalX + swimX;
                dolphin.y = dolphin.originalY + swimY;
                
                // Add gentle bobbing motion
                const bobbing = Math.sin(swimProgress * Math.PI * 4) * 3;
                dolphin.y += bobbing;
                
                // Keep dolphins in water (below sea level)
                dolphin.y = Math.max(this.seaLevel + 20, dolphin.y);
            } else {
                dolphin.isSwimming = false;
                dolphin.x = dolphin.originalX;
                dolphin.y = dolphin.originalY;
            }
        }
        
        // Update oxygen (dolphins need to surface)
        if (dolphin.y > this.seaLevel + 50) {
            dolphin.oxygen = Math.max(20, dolphin.oxygen - deltaTime / 100);
        } else {
            dolphin.oxygen = Math.min(100, dolphin.oxygen + deltaTime / 50);
        }
    }

    onDolphinClick(dolphin) {
        if (this.audioManager) {
            this.audioManager.playSFX('dolphin-click');
        }
        
        // Make dolphin swim
        dolphin.isSwimming = true;
        dolphin.swimAnimationTime = 0;
        
        // Show dolphin info
        this.showDolphinInfo(dolphin);
        
        // Specialty-based actions
        switch (dolphin.specialty) {
            case 'echolocation':
                this.createEcholocationPulse(dolphin.x, dolphin.y);
                break;
            case 'jumping':
                this.createJumpAnimation(dolphin.x, dolphin.y);
                break;
            case 'treasure_hunting':
                this.revealNearbyTreasure(dolphin.x, dolphin.y);
                break;
            case 'teaching':
                this.createHelpfulTip(dolphin.x, dolphin.y);
                break;
        }
        
        // Restore oxygen
        dolphin.oxygen = Math.min(100, dolphin.oxygen + 20);
    }

    showDolphinInfo(dolphin) {
        const infoSprite = {
            x: dolphin.x + 40,
            y: dolphin.y - 80,
            text: `${dolphin.name}\n${dolphin.type}\n${dolphin.specialty}\n🫁 ${Math.floor(dolphin.oxygen)}%`,
            life: 3500,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 3500);
                this.y -= deltaTime / 70;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw info bubble
                ctx.fillStyle = 'rgba(175, 238, 238, 0.9)';
                ctx.strokeStyle = '#4682B4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 50, this.y - 40, 100, 80, 12);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#000080';
                ctx.font = '11px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 25 + index * 14);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(infoSprite);
    }

    createEcholocationPulse(x, y) {
        const pulse = {
            x: x,
            y: y,
            radius: 0,
            maxRadius: 100,
            life: 2000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.radius = (1 - this.life / 2000) * this.maxRadius;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                ctx.strokeStyle = '#00CED1';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(pulse);
    }

    createJumpAnimation(x, y) {
        const jumpingDolphin = {
            x: x,
            y: y,
            startY: y,
            life: 1500,
            jumpTime: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.jumpTime += deltaTime;
                
                const jumpProgress = this.jumpTime / 1500;
                const jumpHeight = Math.sin(jumpProgress * Math.PI) * 80;
                this.y = this.startY - jumpHeight;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 1500;
                ctx.fillStyle = '#4682B4';
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('🐬', this.x, this.y);
                
                // Add splash effect when near water
                if (this.y > this.startY - 10) {
                    ctx.fillStyle = '#87CEEB';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.fillText('💦', this.x - 20, this.y + 20);
                    ctx.fillText('💦', this.x + 20, this.y + 20);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(jumpingDolphin);
    }

    revealNearbyTreasure(x, y) {
        // Find and highlight nearby treasure
        this.treasure.forEach(treasure => {
            const distance = Math.sqrt(Math.pow(treasure.x - x, 2) + Math.pow(treasure.y - y, 2));
            if (distance < 150) {
                treasure.isRevealed = true;
                treasure.revealTime = 3000;
            }
        });
    }

    createHelpfulTip(x, y) {
        const tips = [
            "Remember: 0.5 = 1/2",
            "Count decimal places!",
            "Line up the decimal points",
            "Think about money!"
        ];
        
        const tipSprite = {
            x: x,
            y: y - 60,
            text: tips[Math.floor(Math.random() * tips.length)],
            life: 4000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 4000);
                this.y -= deltaTime / 40;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#4682B4';
                ctx.lineWidth = 2;
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(this.text, this.x, this.y);
                ctx.fillText(this.text, this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(tipSprite);
    }

    createMarineFeatures() {
        // Create coral reef structures
        const coralPositions = [
            { x: 100, y: 600, type: 'brain', size: 'large' },
            { x: 200, y: 650, type: 'staghorn', size: 'medium' },
            { x: 350, y: 580, type: 'fan', size: 'large' },
            { x: 500, y: 620, type: 'table', size: 'medium' },
            { x: 700, y: 590, type: 'brain', size: 'small' },
            { x: 850, y: 640, type: 'staghorn', size: 'large' },
            { x: 1000, y: 600, type: 'fan', size: 'medium' },
            { x: 1100, y: 580, type: 'table', size: 'small' }
        ];

        coralPositions.forEach((pos, index) => {
            const coral = {
                x: pos.x,
                y: pos.y,
                type: pos.type,
                size: pos.size,
                fishCount: Math.floor(Math.random() * 8) + 2,
                health: 100,
                
                onClick: () => {
                    this.onCoralClick(coral);
                },
                
                render: function(ctx) {
                    const radius = this.size === 'large' ? 40 : this.size === 'medium' ? 30 : 20;
                    const healthColor = this.health > 70 ? '#FF6347' : this.health > 40 ? '#FFA500' : '#8B4513';
                    
                    ctx.fillStyle = healthColor;
                    ctx.strokeStyle = '#654321';
                    ctx.lineWidth = 2;
                    
                    // Draw different coral types
                    switch (this.type) {
                        case 'brain':
                            ctx.beginPath();
                            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            break;
                        case 'staghorn':
                            ctx.fillRect(this.x - radius/4, this.y - radius, radius/2, radius * 2);
                            ctx.fillRect(this.x - radius, this.y - radius/2, radius * 2, radius/4);
                            break;
                        case 'fan':
                            ctx.beginPath();
                            ctx.arc(this.x, this.y, radius, Math.PI, 0);
                            ctx.fill();
                            ctx.stroke();
                            break;
                        case 'table':
                            ctx.fillRect(this.x - radius, this.y - radius/3, radius * 2, radius/2);
                            ctx.fillRect(this.x - radius/4, this.y - radius, radius/2, radius);
                            break;
                    }
                    
                    // Show fish count
                    ctx.fillStyle = '#FFD700';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🐠 ${this.fishCount}`, this.x, this.y + radius + 20);
                }
            };
            
            this.coral.push(coral);
            this.gameEngine.addSprite(coral);
        });

        // Create sea turtles for measurement problems
        const turtlePositions = [
            { x: 400, y: 500, name: 'Shelly', age: 'adult', length: 1.2 },
            { x: 600, y: 450, name: 'Crush', age: 'elder', length: 1.8 },
            { x: 300, y: 550, name: 'Squirt', age: 'young', length: 0.6 },
            { x: 800, y: 480, name: 'Dory', age: 'adult', length: 1.1 }
        ];

        turtlePositions.forEach((pos, index) => {
            const turtle = {
                x: pos.x,
                y: pos.y,
                name: pos.name,
                age: pos.age,
                length: pos.length, // meters
                type: 'sea_turtle',
                isMoving: false,
                
                onClick: () => {
                    this.onTurtleClick(turtle);
                },
                
                render: function(ctx) {
                    const size = this.length * 30; // Scale for display
                    
                    // Draw turtle shell
                    ctx.fillStyle = this.age === 'elder' ? '#556B2F' : this.age === 'young' ? '#9ACD32' : '#6B8E23';
                    ctx.strokeStyle = '#2F4F4F';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, size, size * 0.7, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw shell pattern
                    ctx.fillStyle = '#8FBC8F';
                    for (let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        const px = this.x + Math.cos(angle) * size * 0.3;
                        const py = this.y + Math.sin(angle) * size * 0.2;
                        ctx.beginPath();
                        ctx.arc(px, py, size * 0.1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Draw head and flippers
                    ctx.fillStyle = '#8FBC8F';
                    ctx.beginPath();
                    ctx.arc(this.x + size * 0.8, this.y, size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Show measurements
                    ctx.fillStyle = '#000080';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.name}: ${this.length}m`, this.x, this.y + size + 20);
                }
            };
            
            this.seaTurtles.push(turtle);
            this.gameEngine.addSprite(turtle);
        });

        // Create treasure chests with decimal values
        const treasurePositions = [
            { x: 150, y: 700, value: 12.50, currency: 'gold' },
            { x: 400, y: 720, value: 8.75, currency: 'silver' },
            { x: 650, y: 680, value: 25.25, currency: 'gold' },
            { x: 900, y: 710, value: 15.60, currency: 'pearls' },
            { x: 1050, y: 690, value: 6.90, currency: 'silver' }
        ];

        treasurePositions.forEach(pos => {
            const treasure = {
                x: pos.x,
                y: pos.y,
                value: pos.value,
                currency: pos.currency,
                type: 'treasure_chest',
                isRevealed: false,
                revealTime: 0,
                
                onClick: () => {
                    this.onTreasureClick(treasure);
                },
                
                update: function(deltaTime) {
                    if (this.revealTime > 0) {
                        this.revealTime -= deltaTime;
                        if (this.revealTime <= 0) {
                            this.isRevealed = false;
                        }
                    }
                },
                
                render: function(ctx) {
                    // Draw treasure chest
                    const chestColor = this.currency === 'gold' ? '#FFD700' : 
                                     this.currency === 'silver' ? '#C0C0C0' : '#FFB6C1';
                    
                    ctx.fillStyle = chestColor;
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.fillRect(this.x - 20, this.y - 15, 40, 30);
                    ctx.strokeRect(this.x - 20, this.y - 15, 40, 30);
                    
                    // Draw chest lid
                    ctx.beginPath();
                    ctx.arc(this.x, this.y - 15, 20, Math.PI, 0);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Show value if revealed
                    if (this.isRevealed) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '14px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText(`$${this.value}`, this.x, this.y + 40);
                        
                        // Add sparkle effect
                        ctx.fillStyle = '#FFFF00';
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.fillText('✨', this.x - 25, this.y - 20);
                        ctx.fillText('✨', this.x + 25, this.y - 20);
                    }
                }
            };
            
            this.treasure.push(treasure);
            this.gameEngine.addSprite(treasure);
        });
    }

    createOceanEffects() {
        // Create wave effects at surface
        for (let i = 0; i < 20; i++) {
            const wave = {
                x: i * 60,
                y: this.seaLevel,
                amplitude: Math.random() * 10 + 5,
                frequency: Math.random() * 0.5 + 0.3,
                phase: Math.random() * Math.PI * 2,
                
                update: function(deltaTime) {
                    this.phase += deltaTime / 1000;
                },
                
                render: function(ctx) {
                    ctx.strokeStyle = '#4169E1';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    const waveHeight = Math.sin(this.phase) * this.amplitude;
                    ctx.moveTo(this.x, this.y + waveHeight);
                    ctx.lineTo(this.x + 60, this.y - waveHeight);
                    ctx.stroke();
                }
            };
            
            this.waves.push(wave);
            this.gameEngine.addSprite(wave);
        }

        // Create bubble effects
        for (let i = 0; i < 15; i++) {
            const bubble = {
                x: Math.random() * 1200,
                y: Math.random() * 400 + 400,
                size: Math.random() * 8 + 3,
                speed: Math.random() * 30 + 20,
                opacity: Math.random() * 0.6 + 0.4,
                
                update: function(deltaTime) {
                    this.y -= this.speed * deltaTime / 1000;
                    this.x += Math.sin(this.y / 100) * 15 * deltaTime / 1000;
                    
                    if (this.y < 100) {
                        this.y = 800;
                        this.x = Math.random() * 1200;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    ctx.fillStyle = '#E0F6FF';
                    ctx.strokeStyle = '#87CEEB';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                }
            };
            
            this.bubbles.push(bubble);
            this.gameEngine.addSprite(bubble);
        }

        // Create kelp forest
        const kelpPositions = [
            { x: 80, y: 500 }, { x: 160, y: 520 }, { x: 240, y: 480 },
            { x: 1000, y: 500 }, { x: 1080, y: 520 }, { x: 1160, y: 480 }
        ];

        kelpPositions.forEach(pos => {
            const kelp = {
                x: pos.x,
                y: pos.y,
                height: Math.random() * 200 + 150,
                swayTime: Math.random() * 1000,
                
                update: function(deltaTime) {
                    this.swayTime += deltaTime;
                },
                
                render: function(ctx) {
                    const sway = Math.sin(this.swayTime / 1500) * 15;
                    
                    ctx.strokeStyle = '#228B22';
                    ctx.lineWidth = 8;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y + 100);
                    ctx.quadraticCurveTo(this.x + sway, this.y + 50, this.x + sway * 1.5, this.y - this.height);
                    ctx.stroke();
                    
                    // Draw kelp fronds
                    for (let i = 0; i < 5; i++) {
                        const frondY = this.y - (i * this.height / 5);
                        const frondSway = sway * (i / 5);
                        ctx.fillStyle = '#32CD32';
                        ctx.beginPath();
                        ctx.ellipse(this.x + frondSway, frondY, 12, 6, frondSway / 20, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            };
            
            this.kelp.push(kelp);
            this.gameEngine.addSprite(kelp);
        });
    }

    addInteractiveElements() {
        // Create measurement buoys
        this.createMeasurementBuoys();
        
        // Create decimal calculation stations
        this.createDecimalStations();
    }

    createMeasurementBuoys() {
        const buoyPositions = [
            { x: 200, y: 120, distance: 2.5, unit: 'km' },
            { x: 400, y: 100, distance: 1.8, unit: 'km' },
            { x: 600, y: 130, distance: 3.2, unit: 'km' },
            { x: 800, y: 110, distance: 0.9, unit: 'km' }
        ];

        buoyPositions.forEach(pos => {
            const buoy = {
                x: pos.x,
                y: pos.y,
                distance: pos.distance,
                unit: pos.unit,
                type: 'measurement_buoy',
                bobTime: Math.random() * 1000,
                
                onClick: () => {
                    this.onBuoyClick(buoy);
                },
                
                update: function(deltaTime) {
                    this.bobTime += deltaTime;
                },
                
                render: function(ctx) {
                    const bob = Math.sin(this.bobTime / 800) * 5;
                    
                    // Draw buoy
                    ctx.fillStyle = '#FF6347';
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y + bob, 15, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw measurement text
                    ctx.fillStyle = '#000080';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.distance} ${this.unit}`, this.x, this.y + bob + 35);
                }
            };
            
            this.buoys.push(buoy);
            this.gameEngine.addSprite(buoy);
        });
    }

    createDecimalStations() {
        // Create floating platforms with decimal problems
        const stations = [
            { x: 300, y: 350, operation: '2.5 + 1.3', answer: 3.8 },
            { x: 500, y: 320, operation: '4.7 - 1.2', answer: 3.5 },
            { x: 700, y: 370, operation: '3.2 × 2', answer: 6.4 },
            { x: 900, y: 340, operation: '8.4 ÷ 2', answer: 4.2 }
        ];

        stations.forEach(station => {
            const platform = {
                x: station.x,
                y: station.y,
                operation: station.operation,
                answer: station.answer,
                type: 'decimal_station',
                isSolved: false,
                
                onClick: () => {
                    this.onDecimalStationClick(platform);
                },
                
                render: function(ctx) {
                    // Draw floating platform
                    ctx.fillStyle = this.isSolved ? '#90EE90' : '#DEB887';
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.fillRect(this.x - 40, this.y - 15, 80, 30);
                    ctx.strokeRect(this.x - 40, this.y - 15, 80, 30);
                    
                    // Draw operation
                    ctx.fillStyle = '#000080';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.operation, this.x, this.y);
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '14px "Comic Sans MS", cursive';
                        ctx.fillText(`= ${this.answer}`, this.x, this.y + 25);
                    }
                }
            };
            
            this.gameEngine.addSprite(platform);
        });
    }

    onCoralClick(coral) {
        if (this.audioManager) {
            this.audioManager.playSFX('bubble-pop');
        }
        
        coral.health = Math.min(100, coral.health + 10);
        coral.fishCount = Math.min(coral.fishCount + 1, 15);
        
        // Create healing particles
        this.createHealingParticles(coral.x, coral.y);
    }

    onTurtleClick(turtle) {
        if (this.audioManager) {
            this.audioManager.playSFX('gentle-splash');
        }
        
        turtle.isMoving = !turtle.isMoving;
        this.showMeasurementInfo(turtle);
    }

    onTreasureClick(treasure) {
        if (this.audioManager) {
            this.audioManager.playSFX('treasure-open');
        }
        
        treasure.isRevealed = !treasure.isRevealed;
        treasure.revealTime = treasure.isRevealed ? 5000 : 0;
    }

    onBuoyClick(buoy) {
        if (this.audioManager) {
            this.audioManager.playSFX('bell-ring');
        }
        
        this.createDistanceMeasurement(buoy.x, buoy.y, buoy.distance);
    }

    onDecimalStationClick(platform) {
        if (this.audioManager) {
            this.audioManager.playSFX(platform.isSolved ? 'already-solved' : 'correct');
        }
        
        platform.isSolved = !platform.isSolved;
    }

    createHealingParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            const particle = {
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                life: 1500,
                
                update: function(deltaTime) {
                    this.life -= deltaTime;
                    this.y -= deltaTime / 20;
                    if (this.life <= 0) {
                        this.isDead = true;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.life / 1500;
                    ctx.fillStyle = '#00FF00';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('💚', this.x, this.y);
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(particle);
        }
    }

    showMeasurementInfo(turtle) {
        const measurementInfo = {
            x: turtle.x,
            y: turtle.y - 100,
            text: `Length: ${turtle.length}m\nWeight: ${(turtle.length * 45).toFixed(1)}kg`,
            life: 3000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 3000);
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.strokeStyle = '#4682B4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 60, this.y - 20, 120, 40, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#000080';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 5 + index * 15);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(measurementInfo);
    }

    createDistanceMeasurement(x, y, distance) {
        const measurement = {
            x: x,
            y: y - 50,
            distance: distance,
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
                
                // Draw measurement line
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.x - 50, this.y);
                ctx.lineTo(this.x + 50, this.y);
                ctx.stroke();
                
                // Draw distance text
                ctx.fillStyle = '#FFD700';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`${this.distance} km`, this.x, this.y - 10);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(measurement);
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
        if (this.currentProblem.type === 'decimals') {
            this.addDecimalVisuals();
        } else if (this.currentProblem.type === 'measurement') {
            this.addMeasurementVisuals();
        }
    }

    addDecimalVisuals() {
        // Create decimal visualization
        this.createDecimalRepresentation(this.currentProblem.operation, 500, 120);
    }

    addMeasurementVisuals() {
        // Create measurement visualization
        this.createMeasurementRepresentation(450, 100);
    }

    createDecimalRepresentation(operation, x, y) {
        const decimalVisual = {
            x: x,
            y: y,
            operation: operation,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw decimal workspace
                ctx.fillStyle = 'rgba(175, 238, 238, 0.8)';
                ctx.strokeStyle = '#4682B4';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 120, this.y - 50, 240, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw operation
                ctx.fillStyle = '#000080';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Decimal Math:', this.x, this.y - 20);
                ctx.fillText(this.operation, this.x, this.y + 10);
                
                // Draw helper grid
                ctx.strokeStyle = '#87CEEB';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - 40);
                ctx.lineTo(this.x, this.y + 40);
                ctx.stroke();
                
                ctx.fillStyle = '#4682B4';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Line up decimals!', this.x, this.y + 35);
            }
        };
        
        this.gameEngine.addSprite(decimalVisual);
    }

    createMeasurementRepresentation(x, y) {
        const measureVisual = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw measurement workspace
                ctx.fillStyle = 'rgba(255, 248, 220, 0.8)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 130, this.y - 50, 260, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw measurement tools
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('📏', this.x - 80, this.y - 10);
                ctx.fillText('⚖️', this.x, this.y - 10);
                ctx.fillText('📐', this.x + 80, this.y - 10);
                
                // Draw helper text
                ctx.fillStyle = '#000080';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Use measurement tools!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(measureVisual);
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`DolphinCove: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
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
        console.log(`Dolphin Cove: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
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
        
        // Make all dolphins swim
        this.dolphins.forEach(dolphin => {
            dolphin.isSwimming = true;
            dolphin.swimAnimationTime = 0;
            dolphin.oxygen = 100;
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around dolphins
        this.dolphins.forEach(dolphin => {
            this.gameEngine.createCelebrationParticles(dolphin.x, dolphin.y);
        });
        
        // Create ocean celebration
        this.createOceanCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createOceanCelebration() {
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
                ctx.fillStyle = '#4682B4';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('SPLASH SUCCESS!', this.x, this.y);
                ctx.fillText('SPLASH SUCCESS!', this.x, this.y);
                
                // Draw swimming dolphins
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🐬🌊🐬', this.x, this.y + 60);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebration);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with helpful dolphin
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
                ctx.fillStyle = 'rgba(175, 238, 238, 0.95)';
                ctx.strokeStyle = '#4682B4';
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
                ctx.fillStyle = '#000080';
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
            text: 'Dolphin Cove Complete!',
            subtext: 'You mastered decimals! The dolphins are celebrating!',
            life: 6000,
            opacity: 1,
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, 1200, 800);
                
                // Draw main text
                ctx.fillStyle = '#4682B4';
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
                
                // Draw celebration dolphins
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🐬💫🐬', this.x, this.y + 120);
                
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
        console.log('Dolphin Cove completed! Returning to habitat selection...');
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
        this.dolphins.forEach(dolphin => {
            if (dolphin.update) {
                dolphin.update(deltaTime);
            }
        });
        
        // Update waves
        this.waves.forEach(wave => {
            if (wave.update) {
                wave.update(deltaTime);
            }
        });
        
        // Update bubbles
        this.bubbles.forEach(bubble => {
            if (bubble.update) {
                bubble.update(deltaTime);
            }
        });
        
        // Update kelp
        this.kelp.forEach(kelp => {
            if (kelp.update) {
                kelp.update(deltaTime);
            }
        });
        
        // Update buoys
        this.buoys.forEach(buoy => {
            if (buoy.update) {
                buoy.update(deltaTime);
            }
        });
        
        // Update treasure
        this.treasure.forEach(treasure => {
            if (treasure.update) {
                treasure.update(deltaTime);
            }
        });
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 90000) { // 90 second timeout for decimals
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
        this.dolphins = [];
        this.seaTurtles = [];
        this.coral = [];
        this.treasure = [];
        this.kelp = [];
        this.buoys = [];
        this.waves = [];
        this.bubbles = [];
        this.fish = [];
        this.jellyfish = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DolphinCove;
}