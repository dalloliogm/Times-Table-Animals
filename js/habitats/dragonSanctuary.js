// Dragon Sanctuary Habitat for Times Table Animals
// Eleventh habitat focusing on exponentials and advanced equations

class DragonSanctuary {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 20;
        this.nextProblemTimer = null;
        
        // Habitat elements
        this.dragons = [];
        this.dragonEggs = [];
        this.treasureHoards = [];
        this.crystals = [];
        this.volcanoes = [];
        this.castles = [];
        this.magicPortals = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Magical environment
        this.flames = [];
        this.sparkles = [];
        this.magicOrbs = [];
        this.ancientRunes = [];
        this.timeOfMagic = 'twilight';
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('dragonSanctuary');
        this.gameEngine.setBackground('dragonSanctuary');
        
        // Create the magical environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createDragonFamilies();
        this.createSanctuaryFeatures();
        this.createMagicalEffects();
        this.addInteractiveElements();
    }

    createDragonFamilies() {
        // Create dragon families with different elemental powers and mathematical specialties
        const dragonFamilies = [
            { x: 200, y: 300, name: 'Pyrion', element: 'fire', specialty: 'exponentials', power: 98, age: 'ancient' },
            { x: 350, y: 280, name: 'Glacius', element: 'ice', specialty: 'square_roots', power: 85, age: 'adult' },
            { x: 150, y: 400, name: 'Sparkle', element: 'fire', specialty: 'powers_of_two', power: 45, age: 'young' },
            { x: 600, y: 250, name: 'Zephyra', element: 'wind', specialty: 'algebra_mastery', power: 92, age: 'ancient' },
            { x: 750, y: 320, name: 'Terran', element: 'earth', specialty: 'factorization', power: 88, age: 'adult' },
            { x: 550, y: 450, name: 'Tsunami', element: 'water', specialty: 'logarithms', power: 90, age: 'adult' },
            { x: 900, y: 280, name: 'Voltaic', element: 'lightning', specialty: 'exponential_growth', power: 95, age: 'ancient' },
            { x: 800, y: 420, name: 'Shadowmere', element: 'shadow', specialty: 'advanced_equations', power: 87, age: 'adult' },
            { x: 400, y: 200, name: 'Lumina', element: 'light', specialty: 'mathematical_proofs', power: 93, age: 'ancient' },
            { x: 500, y: 350, name: 'Chronos', element: 'time', specialty: 'sequence_analysis', power: 89, age: 'adult' },
            { x: 250, y: 500, name: 'Ember', element: 'fire', specialty: 'basic_powers', power: 52, age: 'young' },
            { x: 700, y: 480, name: 'Frost', element: 'ice', specialty: 'inverse_operations', power: 48, age: 'young' },
            { x: 100, y: 250, name: 'Sage', element: 'wisdom', specialty: 'all_mathematics', power: 99, age: 'elder' },
            { x: 1000, y: 350, name: 'Nova', element: 'star', specialty: 'cosmic_equations', power: 94, age: 'ancient' },
            { x: 450, y: 550, name: 'Mystic', element: 'magic', specialty: 'pattern_equations', power: 86, age: 'adult' },
            { x: 650, y: 200, name: 'Crimson', element: 'fire', specialty: 'power_calculations', power: 91, age: 'adult' },
            { x: 850, y: 520, name: 'Azure', element: 'water', specialty: 'fluid_dynamics', power: 83, age: 'adult' },
            { x: 300, y: 600, name: 'Pebble', element: 'earth', specialty: 'counting_powers', power: 38, age: 'hatchling' },
            { x: 1100, y: 400, name: 'Tempest', element: 'storm', specialty: 'exponential_decay', power: 88, age: 'adult' },
            { x: 50, y: 450, name: 'Ancient One', element: 'cosmic', specialty: 'infinite_series', power: 100, age: 'primordial' }
        ];

        dragonFamilies.forEach((member, index) => {
            const dragon = this.gameEngine.createSprite('penguin', member.x, member.y); // Using penguin sprite as dragon
            dragon.name = member.name;
            dragon.element = member.element;
            dragon.specialty = member.specialty;
            dragon.power = member.power;
            dragon.age = member.age;
            dragon.id = `dragon_${index}`;
            dragon.isFlying = false;
            dragon.flyCooldown = Math.random() * 15000 + 10000;
            dragon.originalX = member.x;
            dragon.originalY = member.y;
            dragon.breathCooldown = Math.random() * 8000 + 5000;
            dragon.magicalEnergy = member.power;
            dragon.wisdomShared = 0;
            
            // Age-based characteristics
            switch (member.age) {
                case 'hatchling':
                    dragon.width = 30;
                    dragon.height = 25;
                    dragon.flightSpeed = 60;
                    dragon.breathPower = 20;
                    break;
                case 'young':
                    dragon.width = 50;
                    dragon.height = 45;
                    dragon.flightSpeed = 70;
                    dragon.breathPower = 40;
                    dragon.flyCooldown *= 0.6;
                    break;
                case 'adult':
                    dragon.width = 80;
                    dragon.height = 70;
                    dragon.flightSpeed = 50;
                    dragon.breathPower = 70;
                    break;
                case 'ancient':
                    dragon.width = 110;
                    dragon.height = 95;
                    dragon.flightSpeed = 40;
                    dragon.breathPower = 90;
                    dragon.flyCooldown *= 1.5;
                    break;
                case 'elder':
                    dragon.width = 130;
                    dragon.height = 110;
                    dragon.flightSpeed = 30;
                    dragon.breathPower = 95;
                    dragon.flyCooldown *= 2.0;
                    break;
                case 'primordial':
                    dragon.width = 150;
                    dragon.height = 130;
                    dragon.flightSpeed = 25;
                    dragon.breathPower = 100;
                    dragon.flyCooldown *= 3.0;
                    break;
            }
            
            // Element-based colors
            switch (member.element) {
                case 'fire':
                    dragon.tintColor = '#FF4500';
                    break;
                case 'ice':
                    dragon.tintColor = '#87CEEB';
                    break;
                case 'wind':
                    dragon.tintColor = '#E6E6FA';
                    break;
                case 'earth':
                    dragon.tintColor = '#8B4513';
                    break;
                case 'water':
                    dragon.tintColor = '#4682B4';
                    break;
                case 'lightning':
                    dragon.tintColor = '#FFD700';
                    break;
                case 'shadow':
                    dragon.tintColor = '#2F4F4F';
                    break;
                case 'light':
                    dragon.tintColor = '#FFFAF0';
                    break;
                case 'time':
                    dragon.tintColor = '#9370DB';
                    break;
                case 'wisdom':
                    dragon.tintColor = '#DAA520';
                    break;
                case 'star':
                    dragon.tintColor = '#FFB6C1';
                    break;
                case 'magic':
                    dragon.tintColor = '#FF69B4';
                    break;
                case 'storm':
                    dragon.tintColor = '#696969';
                    break;
                case 'cosmic':
                    dragon.tintColor = '#4B0082';
                    break;
            }
            
            // Add dragon behavior
            dragon.update = (deltaTime) => {
                this.updateDragon(dragon, deltaTime);
            };
            
            dragon.onClick = () => {
                this.onDragonClick(dragon);
            };
            
            this.dragons.push(dragon);
            this.gameEngine.addSprite(dragon);
        });
    }

    updateDragon(dragon, deltaTime) {
        // Handle flight animation
        dragon.flyCooldown -= deltaTime;
        
        if (dragon.flyCooldown <= 0 && !dragon.isFlying) {
            dragon.isFlying = true;
            dragon.flyCooldown = Math.random() * 18000 + 12000;
            if (dragon.age === 'young' || dragon.age === 'hatchling') dragon.flyCooldown *= 0.6;
            if (dragon.age === 'ancient' || dragon.age === 'elder' || dragon.age === 'primordial') dragon.flyCooldown *= 1.8;
            
            dragon.flyAnimationTime = 0;
            dragon.flyDirection = Math.random() * Math.PI * 2;
            dragon.flyDistance = Math.random() * 120 + 80;
        }
        
        if (dragon.isFlying) {
            dragon.flyAnimationTime += deltaTime;
            const flyProgress = dragon.flyAnimationTime / 6000; // 6 second flight
            
            if (flyProgress <= 1) {
                // Majestic dragon flight motion
                const flyX = Math.sin(flyProgress * Math.PI) * dragon.flyDistance * Math.cos(dragon.flyDirection);
                const flyY = Math.sin(flyProgress * Math.PI) * dragon.flyDistance * 0.5 * Math.sin(dragon.flyDirection);
                
                dragon.x = dragon.originalX + flyX;
                dragon.y = dragon.originalY + flyY;
                
                // Add wing flapping motion
                const wingFlap = Math.sin(flyProgress * Math.PI * 10) * 3;
                dragon.y += wingFlap;
                
                // Keep dragons in sanctuary bounds
                dragon.x = Math.max(dragon.width/2, Math.min(1200 - dragon.width/2, dragon.x));
                dragon.y = Math.max(150, Math.min(700, dragon.y));
            } else {
                dragon.isFlying = false;
                dragon.x = dragon.originalX;
                dragon.y = dragon.originalY;
            }
        }
        
        // Handle breath weapon cooldown
        dragon.breathCooldown -= deltaTime;
        
        // Magical energy regeneration
        dragon.magicalEnergy = Math.min(dragon.power, dragon.magicalEnergy + deltaTime / 100);
    }

    onDragonClick(dragon) {
        if (this.audioManager) {
            this.audioManager.playSFX('dragon-roar');
        }
        
        // Make dragon fly
        dragon.isFlying = true;
        dragon.flyAnimationTime = 0;
        
        // Show dragon power and knowledge
        this.showDragonKnowledge(dragon);
        
        // Use breath weapon if available
        if (dragon.breathCooldown <= 0) {
            this.createBreathWeapon(dragon);
            dragon.breathCooldown = Math.random() * 8000 + 5000;
        }
        
        // Specialty-based mathematical demonstrations
        switch (dragon.specialty) {
            case 'exponentials':
                this.createExponentialDemo(dragon.x, dragon.y);
                break;
            case 'square_roots':
                this.createSquareRootDemo(dragon.x, dragon.y);
                break;
            case 'powers_of_two':
                this.createPowersOfTwoDemo(dragon.x, dragon.y);
                break;
            case 'algebra_mastery':
                this.createAlgebraDemo(dragon.x, dragon.y);
                break;
            case 'factorization':
                this.createFactorizationDemo(dragon.x, dragon.y);
                break;
            case 'logarithms':
                this.createLogarithmDemo(dragon.x, dragon.y);
                break;
            case 'exponential_growth':
                this.createGrowthDemo(dragon.x, dragon.y);
                break;
            case 'advanced_equations':
                this.createAdvancedEquationDemo(dragon.x, dragon.y);
                break;
            case 'mathematical_proofs':
                this.createProofDemo(dragon.x, dragon.y);
                break;
            case 'sequence_analysis':
                this.createSequenceDemo(dragon.x, dragon.y);
                break;
        }
        
        // Increase wisdom sharing
        dragon.wisdomShared = Math.min(100, dragon.wisdomShared + 12);
        dragon.magicalEnergy = Math.max(20, dragon.magicalEnergy - 15);
    }

    showDragonKnowledge(dragon) {
        const knowledgeSprite = {
            x: dragon.x + 100,
            y: dragon.y - 150,
            text: `${dragon.name}\n${dragon.element.toUpperCase()} Dragon\n${dragon.specialty}\nAge: ${dragon.age}\n🔥 Power: ${dragon.power}%\n🧠 Wisdom: ${dragon.wisdomShared}%\n✨ Energy: ${Math.floor(dragon.magicalEnergy)}%`,
            life: 6000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 6000);
                this.y -= deltaTime / 120;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw magical knowledge bubble
                ctx.fillStyle = 'rgba(75, 0, 130, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 90, this.y - 90, 180, 180, 20);
                ctx.fill();
                ctx.stroke();
                
                // Add magical border effect
                ctx.strokeStyle = '#FF69B4';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.roundRect(this.x - 85, this.y - 85, 170, 170, 18);
                ctx.stroke();
                ctx.setLineDash([]);
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    if (index === 0) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '16px "Comic Sans MS", cursive';
                    } else if (index === 1) {
                        ctx.fillStyle = '#FF69B4';
                        ctx.font = '13px "Comic Sans MS", cursive';
                    } else {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = '12px "Comic Sans MS", cursive';
                    }
                    ctx.fillText(line, this.x, this.y - 75 + index * 20);
                });
                
                // Draw dragon silhouette
                ctx.fillStyle = '#FFD700';
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.fillText('🐉', this.x, this.y + 70);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(knowledgeSprite);
    }

    createBreathWeapon(dragon) {
        const breath = {
            x: dragon.x,
            y: dragon.y,
            element: dragon.element,
            power: dragon.breathPower,
            life: 3000,
            particles: [],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                
                // Create breath particles
                if (this.life > 2000) {
                    for (let i = 0; i < 3; i++) {
                        const particle = {
                            x: this.x + (Math.random() - 0.5) * 20,
                            y: this.y + (Math.random() - 0.5) * 20,
                            vx: (Math.random() - 0.5) * 100,
                            vy: (Math.random() - 0.5) * 100,
                            life: 1000,
                            element: this.element
                        };
                        this.particles.push(particle);
                    }
                }
                
                // Update particles
                this.particles.forEach(particle => {
                    particle.x += particle.vx * deltaTime / 1000;
                    particle.y += particle.vy * deltaTime / 1000;
                    particle.life -= deltaTime;
                });
                
                // Remove dead particles
                this.particles = this.particles.filter(p => p.life > 0);
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                
                // Draw breath particles
                this.particles.forEach(particle => {
                    ctx.save();
                    ctx.globalAlpha = particle.life / 1000;
                    
                    let color = '#FF4500'; // Default fire
                    switch (particle.element) {
                        case 'fire': color = '#FF4500'; break;
                        case 'ice': color = '#87CEEB'; break;
                        case 'wind': color = '#E6E6FA'; break;
                        case 'earth': color = '#8B4513'; break;
                        case 'water': color = '#4682B4'; break;
                        case 'lightning': color = '#FFD700'; break;
                        case 'shadow': color = '#2F4F4F'; break;
                        case 'light': color = '#FFFAF0'; break;
                        case 'time': color = '#9370DB'; break;
                        case 'wisdom': color = '#DAA520'; break;
                        case 'star': color = '#FFB6C1'; break;
                        case 'magic': color = '#FF69B4'; break;
                        case 'storm': color = '#696969'; break;
                        case 'cosmic': color = '#4B0082'; break;
                    }
                    
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add element-specific effects
                    if (particle.element === 'lightning') {
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(particle.x - 10, particle.y);
                        ctx.lineTo(particle.x + 10, particle.y);
                        ctx.moveTo(particle.x, particle.y - 10);
                        ctx.lineTo(particle.x, particle.y + 10);
                        ctx.stroke();
                    }
                    
                    ctx.restore();
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(breath);
    }

    createExponentialDemo(x, y) {
        const demo = {
            x: x,
            y: y - 80,
            life: 5000,
            examples: ['2¹ = 2', '2² = 4', '2³ = 8', '2⁴ = 16', '2⁵ = 32'],
            currentExample: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentExample = Math.floor((5000 - this.life) / 1000) % this.examples.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(255, 69, 0, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 50, 160, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw exponential growth visualization
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Exponentials!', this.x, this.y - 25);
                
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.fillText(this.examples[this.currentExample], this.x, this.y);
                
                // Draw growth bars
                for (let i = 0; i <= this.currentExample; i++) {
                    const barHeight = Math.pow(2, i + 1) * 2;
                    const barX = this.x - 60 + (i * 25);
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(barX, this.y + 15, 20, Math.min(barHeight, 25));
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createSquareRootDemo(x, y) {
        const demo = {
            x: x,
            y: y - 70,
            life: 4500,
            examples: ['√4 = 2', '√9 = 3', '√16 = 4', '√25 = 5', '√36 = 6'],
            currentExample: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentExample = Math.floor((4500 - this.life) / 900) % this.examples.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4500;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(135, 206, 235, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 40, 140, 80, 12);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Square Roots!', this.x, this.y - 15);
                
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.examples[this.currentExample], this.x, this.y + 10);
                
                // Draw square visualization
                const num = (this.currentExample + 2);
                const squareSize = num * 4;
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x - squareSize/2, this.y + 15, squareSize, squareSize);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createPowersOfTwoDemo(x, y) {
        const demo = {
            x: x,
            y: y - 60,
            life: 4000,
            sequence: [1, 2, 4, 8, 16, 32, 64, 128],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4000;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(255, 69, 0, 0.7)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 35, 200, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Powers of 2:', this.x, this.y - 15);
                
                // Show sequence
                const visibleCount = Math.min(6, Math.floor((4000 - this.life) / 500) + 1);
                const sequenceText = this.sequence.slice(0, visibleCount).join(', ');
                ctx.fillText(sequenceText, this.x, this.y + 5);
                
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Each × 2!', this.x, this.y + 25);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createAlgebraDemo(x, y) {
        const demo = {
            x: x,
            y: y - 70,
            life: 4800,
            equations: ['x + 5 = 12', 'x = 7', '2y = 14', 'y = 7', '3z - 6 = 15', 'z = 7'],
            currentStep: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentStep = Math.floor((4800 - this.life) / 800) % this.equations.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4800;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(230, 230, 250, 0.8)';
                ctx.strokeStyle = '#9370DB';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 45, 160, 90, 12);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#4B0082';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Algebra Mastery!', this.x, this.y - 25);
                
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.equations[this.currentStep], this.x, this.y);
                
                if (this.currentStep % 2 === 1) {
                    ctx.fillStyle = '#FFD700';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.fillText('✓ Solved!', this.x, this.y + 25);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createFactorizationDemo(x, y) {
        const demo = {
            x: x,
            y: y - 60,
            life: 4200,
            examples: [
                { num: 12, factors: [1, 2, 3, 4, 6, 12] },
                { num: 18, factors: [1, 2, 3, 6, 9, 18] },
                { num: 24, factors: [1, 2, 3, 4, 6, 8, 12, 24] }
            ],
            currentExample: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentExample = Math.floor((4200 - this.life) / 1400) % this.examples.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4200;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 90, this.y - 40, 180, 80, 10);
                ctx.fill();
                ctx.stroke();
                
                const example = this.examples[this.currentExample];
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`Factors of ${example.num}:`, this.x, this.y - 15);
                
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText(example.factors.join(', '), this.x, this.y + 5);
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('All divide evenly!', this.x, this.y + 25);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createLogarithmDemo(x, y) {
        const demo = {
            x: x,
            y: y - 75,
            life: 5200,
            examples: ['log₂(8) = 3', 'log₂(16) = 4', 'log₁₀(100) = 2', 'log₁₀(1000) = 3'],
            currentExample: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentExample = Math.floor((5200 - this.life) / 1300) % this.examples.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5200;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(70, 130, 180, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 50, 200, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Logarithms!', this.x, this.y - 25);
                
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.examples[this.currentExample], this.x, this.y);
                
                ctx.fillStyle = '#87CEEB';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Inverse of exponentials!', this.x, this.y + 25);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createGrowthDemo(x, y) {
        const demo = {
            x: x,
            y: y - 70,
            life: 4600,
            growthSteps: [1, 2, 4, 8, 16, 32, 64],
            currentStep: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentStep = Math.floor((4600 - this.life) / 650) % this.growthSteps.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4600;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
                ctx.strokeStyle = '#FF4500';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 85, this.y - 45, 170, 90, 12);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#8B0000';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Exponential Growth!', this.x, this.y - 25);
                
                // Draw growth chart
                for (let i = 0; i <= this.currentStep; i++) {
                    const barHeight = Math.log2(this.growthSteps[i] + 1) * 8;
                    const barX = this.x - 60 + (i * 18);
                    ctx.fillStyle = '#FF4500';
                    ctx.fillRect(barX, this.y + 15 - barHeight, 15, barHeight);
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '10px "Comic Sans MS", cursive';
                    ctx.fillText(this.growthSteps[i], barX + 7, this.y + 30);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createAdvancedEquationDemo(x, y) {
        const demo = {
            x: x,
            y: y - 80,
            life: 5500,
            equations: [
                'x² + 5x + 6 = 0',
                '(x + 2)(x + 3) = 0',
                'x = -2 or x = -3',
                'y = 2x² - 4x + 1',
                'vertex at x = 1'
            ],
            currentEquation: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentEquation = Math.floor((5500 - this.life) / 1100) % this.equations.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5500;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(47, 79, 79, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 110, this.y - 55, 220, 110, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Advanced Equations!', this.x, this.y - 35);
                
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.equations[this.currentEquation], this.x, this.y - 5);
                
                if (this.currentEquation >= 2) {
                    ctx.fillStyle = '#32CD32';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.fillText('Solution found!', this.x, this.y + 25);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createProofDemo(x, y) {
        const demo = {
            x: x,
            y: y - 90,
            life: 6000,
            proofSteps: [
                'Theorem: a² - b² = (a+b)(a-b)',
                'Proof: Expand (a+b)(a-b)',
                '= a² - ab + ba - b²',
                '= a² - ab + ab - b²',
                '= a² - b² ✓'
            ],
            currentStep: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentStep = Math.floor((6000 - this.life) / 1200) % this.proofSteps.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 6000;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(255, 250, 240, 0.9)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 130, this.y - 65, 260, 130, 18);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#B8860B';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Mathematical Proof!', this.x, this.y - 45);
                
                // Show proof steps up to current
                for (let i = 0; i <= this.currentStep; i++) {
                    ctx.fillStyle = i === this.currentStep ? '#FF4500' : '#8B4513';
                    ctx.font = '13px "Comic Sans MS", cursive';
                    ctx.fillText(this.proofSteps[i], this.x, this.y - 25 + (i * 18));
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createSequenceDemo(x, y) {
        const demo = {
            x: x,
            y: y - 65,
            life: 4800,
            sequences: [
                { name: 'Fibonacci', seq: [1, 1, 2, 3, 5, 8, 13] },
                { name: 'Primes', seq: [2, 3, 5, 7, 11, 13, 17] },
                { name: 'Squares', seq: [1, 4, 9, 16, 25, 36] }
            ],
            currentSequence: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.currentSequence = Math.floor((4800 - this.life) / 1600) % this.sequences.length;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4800;
                
                // Draw demo background
                ctx.fillStyle = 'rgba(147, 112, 219, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 45, 200, 90, 12);
                ctx.fill();
                ctx.stroke();
                
                const sequence = this.sequences[this.currentSequence];
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`${sequence.name} Sequence:`, this.x, this.y - 20);
                
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText(sequence.seq.join(', '), this.x, this.y + 5);
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Find the pattern!', this.x, this.y + 25);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(demo);
    }

    createSanctuaryFeatures() {
        // Create magical crystals with mathematical properties
        const crystalPositions = [
            { x: 150, y: 600, type: 'power_crystal', value: 2, operation: 'exponent' },
            { x: 350, y: 650, type: 'root_crystal', value: 4, operation: 'square_root' },
            { x: 550, y: 620, type: 'factorial_crystal', value: 5, operation: 'factorial' },
            { x: 750, y: 680, type: 'fibonacci_crystal', value: 8, operation: 'fibonacci' },
            { x: 950, y: 640, type: 'prime_crystal', value: 7, operation: 'prime_check' },
            { x: 1150, y: 670, type: 'log_crystal', value: 16, operation: 'logarithm' }
        ];

        crystalPositions.forEach(pos => {
            const crystal = {
                x: pos.x,
                y: pos.y,
                type: pos.type,
                value: pos.value,
                operation: pos.operation,
                glowTime: Math.random() * 2000,
                energy: 100,
                
                onClick: () => {
                    this.onCrystalClick(crystal);
                },
                
                update: function(deltaTime) {
                    this.glowTime += deltaTime;
                },
                
                render: function(ctx) {
                    const glow = 0.7 + Math.sin(this.glowTime / 1000) * 0.3;
                    
                    ctx.save();
                    ctx.globalAlpha = glow;
                    
                    // Crystal colors based on type
                    let color = '#9370DB'; // Default purple
                    switch (this.type) {
                        case 'power_crystal': color = '#FF4500'; break;
                        case 'root_crystal': color = '#32CD32'; break;
                        case 'factorial_crystal': color = '#FFD700'; break;
                        case 'fibonacci_crystal': color = '#FF69B4'; break;
                        case 'prime_crystal': color = '#4169E1'; break;
                        case 'log_crystal': color = '#20B2AA'; break;
                    }
                    
                    // Draw crystal
                    ctx.fillStyle = color;
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y - 25);
                    ctx.lineTo(this.x - 15, this.y - 5);
                    ctx.lineTo(this.x - 10, this.y + 15);
                    ctx.lineTo(this.x + 10, this.y + 15);
                    ctx.lineTo(this.x + 15, this.y - 5);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw crystal value
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.value.toString(), this.x, this.y + 5);
                    
                    // Draw operation label
                    ctx.fillStyle = color;
                    ctx.font = '10px "Comic Sans MS", cursive';
                    ctx.fillText(this.operation.replace('_', ' '), this.x, this.y + 35);
                    
                    ctx.restore();
                }
            };
            
            this.crystals.push(crystal);
            this.gameEngine.addSprite(crystal);
        });

        // Create treasure hoards with exponential values
        const treasurePositions = [
            { x: 200, y: 500, value: 64, formula: '2⁶' },
            { x: 500, y: 520, value: 125, formula: '5³' },
            { x: 800, y: 480, value: 243, formula: '3⁵' },
            { x: 1000, y: 510, value: 729, formula: '9³' }
        ];

        treasurePositions.forEach(pos => {
            const treasure = {
                x: pos.x,
                y: pos.y,
                value: pos.value,
                formula: pos.formula,
                isRevealed: false,
                sparkleTime: Math.random() * 1000,
                
                onClick: () => {
                    this.onTreasureClick(treasure);
                },
                
                update: function(deltaTime) {
                    this.sparkleTime += deltaTime;
                },
                
                render: function(ctx) {
                    // Draw treasure chest
                    ctx.fillStyle = '#DAA520';
                    ctx.strokeStyle = '#8B7D3A';
                    ctx.lineWidth = 2;
                    
                    // Chest body
                    ctx.fillRect(this.x - 25, this.y - 15, 50, 30);
                    ctx.strokeRect(this.x - 25, this.y - 15, 50, 30);
                    
                    // Chest lid
                    ctx.beginPath();
                    ctx.arc(this.x, this.y - 15, 25, Math.PI, 0);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Add sparkles
                    const sparkle = Math.sin(this.sparkleTime / 300);
                    if (sparkle > 0.5) {
                        ctx.fillStyle = '#FFFF00';
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText('✨', this.x - 20, this.y - 25);
                        ctx.fillText('✨', this.x + 20, this.y - 25);
                    }
                    
                    // Show value if revealed
                    if (this.isRevealed) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '16px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText(this.formula, this.x, this.y + 40);
                        ctx.fillText(`= ${this.value}`, this.x, this.y + 55);
                    }
                }
            };
            
            this.treasureHoards.push(treasure);
            this.gameEngine.addSprite(treasure);
        });

        // Create volcanic forges for mathematical operations
        const volcanoPositions = [
            { x: 300, y: 750, name: 'Exponential Forge', specialty: 'powers' },
            { x: 700, y: 770, name: 'Equation Crucible', specialty: 'equations' },
            { x: 1100, y: 740, name: 'Pattern Foundry', specialty: 'sequences' }
        ];

        volcanoPositions.forEach(pos => {
            const volcano = {
                x: pos.x,
                y: pos.y,
                name: pos.name,
                specialty: pos.specialty,
                heat: 100,
                eruptionTime: Math.random() * 5000,
                
                onClick: () => {
                    this.onVolcanoClick(volcano);
                },
                
                update: function(deltaTime) {
                    this.eruptionTime += deltaTime;
                },
                
                render: function(ctx) {
                    // Draw volcano base
                    ctx.fillStyle = '#8B4513';
                    ctx.strokeStyle = '#654321';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(this.x - 40, this.y);
                    ctx.lineTo(this.x - 15, this.y - 40);
                    ctx.lineTo(this.x + 15, this.y - 40);
                    ctx.lineTo(this.x + 40, this.y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw crater
                    ctx.fillStyle = '#FF4500';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y - 40, 15, 5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw lava eruption occasionally
                    if (Math.sin(this.eruptionTime / 2000) > 0.8) {
                        ctx.fillStyle = '#FF6347';
                        ctx.font = '16px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        for (let i = 0; i < 5; i++) {
                            const lavaX = this.x + (Math.random() - 0.5) * 30;
                            const lavaY = this.y - 40 - Math.random() * 30;
                            ctx.fillText('🔥', lavaX, lavaY);
                        }
                    }
                    
                    // Draw name
                    ctx.fillStyle = '#FFD700';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.name, this.x, this.y + 20);
                }
            };
            
            this.volcanoes.push(volcano);
            this.gameEngine.addSprite(volcano);
        });
    }

    createMagicalEffects() {
        // Create floating magical flames
        for (let i = 0; i < 15; i++) {
            const flame = {
                x: Math.random() * 1200,
                y: Math.random() * 400 + 200,
                intensity: Math.random() * 0.5 + 0.5,
                flickerTime: Math.random() * 2000,
                floatSpeed: Math.random() * 20 + 10,
                
                update: function(deltaTime) {
                    this.flickerTime += deltaTime;
                    this.y -= this.floatSpeed * deltaTime / 1000;
                    this.x += Math.sin(this.flickerTime / 1000) * 15 * deltaTime / 1000;
                    
                    if (this.y < 150) {
                        this.y = 650;
                        this.x = Math.random() * 1200;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.intensity;
                    
                    const flicker = 0.8 + Math.sin(this.flickerTime / 200) * 0.2;
                    ctx.globalAlpha *= flicker;
                    
                    ctx.fillStyle = '#FF4500';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('🔥', this.x, this.y);
                    
                    ctx.restore();
                }
            };
            
            this.flames.push(flame);
            this.gameEngine.addSprite(flame);
        }

        // Create magical sparkles
        for (let i = 0; i < 20; i++) {
            const sparkle = {
                x: Math.random() * 1200,
                y: Math.random() * 600 + 100,
                life: Math.random() * 3000 + 2000,
                maxLife: 0,
                twinkleTime: Math.random() * 1500,
                driftX: (Math.random() - 0.5) * 30,
                driftY: (Math.random() - 0.5) * 30,
                
                init: function() {
                    this.maxLife = this.life;
                },
                
                update: function(deltaTime) {
                    if (this.maxLife === 0) this.init();
                    
                    this.life -= deltaTime;
                    this.twinkleTime += deltaTime;
                    this.x += this.driftX * deltaTime / 1000;
                    this.y += this.driftY * deltaTime / 1000;
                    
                    if (this.life <= 0) {
                        this.life = Math.random() * 3000 + 2000;
                        this.maxLife = this.life;
                        this.x = Math.random() * 1200;
                        this.y = Math.random() * 600 + 100;
                        this.driftX = (Math.random() - 0.5) * 30;
                        this.driftY = (Math.random() - 0.5) * 30;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.life / this.maxLife;
                    
                    const twinkle = Math.sin(this.twinkleTime / 300);
                    if (twinkle > 0.3) {
                        ctx.fillStyle = ['#FFD700', '#FF69B4', '#9370DB', '#32CD32'][Math.floor(this.twinkleTime / 500) % 4];
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        ctx.fillText('✨', this.x, this.y);
                    }
                    
                    ctx.restore();
                }
            };
            
            this.sparkles.push(sparkle);
            this.gameEngine.addSprite(sparkle);
        }

        // Create magical orbs with mathematical symbols
        for (let i = 0; i < 8; i++) {
            const orb = {
                x: Math.random() * 1200,
                y: Math.random() * 400 + 150,
                symbol: ['∞', '∑', '∏', '∫', '∂', 'π', 'φ', 'Ω'][i],
                orbitalTime: Math.random() * 4000,
                orbitalRadius: Math.random() * 50 + 30,
                orbitalSpeed: Math.random() * 0.002 + 0.001,
                centerX: 0,
                centerY: 0,
                
                init: function() {
                    this.centerX = this.x;
                    this.centerY = this.y;
                },
                
                update: function(deltaTime) {
                    if (this.centerX === 0) this.init();
                    
                    this.orbitalTime += deltaTime;
                    const angle = this.orbitalTime * this.orbitalSpeed;
                    this.x = this.centerX + Math.cos(angle) * this.orbitalRadius;
                    this.y = this.centerY + Math.sin(angle) * this.orbitalRadius;
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = 0.7;
                    
                    // Draw orb
                    ctx.fillStyle = 'rgba(138, 43, 226, 0.6)';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw mathematical symbol
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.symbol, this.x, this.y + 5);
                    
                    ctx.restore();
                }
            };
            
            this.magicOrbs.push(orb);
            this.gameEngine.addSprite(orb);
        }
    }

    addInteractiveElements() {
        // Create exponential challenges
        this.createExponentialChallenges();
        
        // Create equation solving stations
        this.createEquationStations();
    }

    createExponentialChallenges() {
        const challenges = [
            { 
                x: 300, y: 150, 
                base: 2,
                exponent: 6,
                answer: 64,
                type: 'power'
            },
            { 
                x: 600, y: 120, 
                base: 3,
                exponent: 4,
                answer: 81,
                type: 'power'
            },
            { 
                x: 900, y: 140, 
                base: 100,
                root: 2,
                answer: 10,
                type: 'root'
            }
        ];

        challenges.forEach(challenge => {
            const expChallenge = {
                x: challenge.x,
                y: challenge.y,
                challenge: challenge,
                isSolved: false,
                glowTime: 0,
                
                onClick: () => {
                    this.onExponentialChallengeClick(expChallenge);
                },
                
                update: function(deltaTime) {
                    this.glowTime += deltaTime;
                },
                
                render: function(ctx) {
                    const glow = 0.8 + Math.sin(this.glowTime / 1000) * 0.2;
                    
                    ctx.save();
                    ctx.globalAlpha = glow;
                    
                    // Draw challenge platform
                    ctx.fillStyle = this.isSolved ? '#32CD32' : '#4B0082';
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 70, this.y - 30, 140, 60, 15);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw challenge text
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    
                    if (this.challenge.type === 'power') {
                        ctx.fillText(`${this.challenge.base}^${this.challenge.exponent}`, this.x, this.y - 5);
                    } else {
                        ctx.fillText(`√${this.challenge.base}`, this.x, this.y - 5);
                    }
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '14px "Comic Sans MS", cursive';
                        ctx.fillText(`= ${this.challenge.answer}`, this.x, this.y + 15);
                    }
                    
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(expChallenge);
        });
    }

    createEquationStations() {
        const stations = [
            { x: 400, y: 700, equation: 'x² = 16', answer: '±4', difficulty: 'intermediate' },
            { x: 700, y: 720, equation: '2^x = 32', answer: '5', difficulty: 'advanced' },
            { x: 1000, y: 710, equation: 'log₂(x) = 3', answer: '8', difficulty: 'expert' }
        ];

        stations.forEach(station => {
            const eqStation = {
                x: station.x,
                y: station.y,
                equation: station.equation,
                answer: station.answer,
                difficulty: station.difficulty,
                isSolved: false,
                powerLevel: 0,
                
                onClick: () => {
                    this.onEquationStationClick(eqStation);
                },
                
                render: function(ctx) {
                    // Draw station platform
                    let color = '#8B0000'; // Expert
                    if (this.difficulty === 'intermediate') color = '#FF8C00';
                    if (this.difficulty === 'advanced') color = '#4B0082';
                    
                    ctx.fillStyle = this.isSolved ? '#32CD32' : color;
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 60, this.y - 25, 120, 50, 12);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw equation
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '14px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.equation, this.x, this.y - 5);
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.fillText(`x = ${this.answer}`, this.x, this.y + 15);
                    }
                    
                    // Show difficulty
                    ctx.fillStyle = '#CCCCCC';
                    ctx.font = '10px "Comic Sans MS", cursive';
                    ctx.fillText(this.difficulty, this.x, this.y + 35);
                }
            };
            
            this.gameEngine.addSprite(eqStation);
        });
    }

    onCrystalClick(crystal) {
        if (this.audioManager) {
            this.audioManager.playSFX('crystal-chime');
        }
        
        crystal.energy = Math.max(20, crystal.energy - 15);
        this.showCrystalPower(crystal);
    }

    onTreasureClick(treasure) {
        if (this.audioManager) {
            this.audioManager.playSFX('treasure-reveal');
        }
        
        treasure.isRevealed = !treasure.isRevealed;
    }

    onVolcanoClick(volcano) {
        if (this.audioManager) {
            this.audioManager.playSFX('volcano-rumble');
        }
        
        this.showVolcanoForge(volcano);
    }

    onExponentialChallengeClick(challenge) {
        if (this.audioManager) {
            this.audioManager.playSFX(challenge.isSolved ? 'already-solved' : 'power-solve');
        }
        
        if (!challenge.isSolved) {
            this.showExponentialSolution(challenge);
        }
    }

    onEquationStationClick(station) {
        if (this.audioManager) {
            this.audioManager.playSFX('equation-solve');
        }
        
        station.powerLevel = Math.min(100, station.powerLevel + 20);
        if (station.powerLevel >= 100) {
            station.isSolved = true;
        }
        this.showEquationSolution(station);
    }

    showCrystalPower(crystal) {
        const power = {
            x: crystal.x,
            y: crystal.y - 60,
            crystal: crystal,
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
                
                ctx.fillStyle = 'rgba(147, 112, 219, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 50, this.y - 30, 100, 60, 10);
                ctx.fill();
                ctx.stroke();
                
                let result = '';
                switch (this.crystal.operation) {
                    case 'exponent':
                        result = `${this.crystal.value}² = ${this.crystal.value * this.crystal.value}`;
                        break;
                    case 'square_root':
                        result = `√${this.crystal.value} = ${Math.sqrt(this.crystal.value)}`;
                        break;
                    case 'factorial':
                        let fact = 1;
                        for (let i = 1; i <= this.crystal.value; i++) fact *= i;
                        result = `${this.crystal.value}! = ${fact}`;
                        break;
                }
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(result, this.x, this.y);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(power);
    }

    showVolcanoForge(volcano) {
        const forge = {
            x: volcano.x,
            y: volcano.y - 100,
            volcano: volcano,
            life: 4000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 4000);
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                ctx.fillStyle = 'rgba(255, 69, 0, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 40, 160, 80, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.volcano.name, this.x, this.y - 15);
                ctx.fillText(`Forging ${this.volcano.specialty}!`, this.x, this.y + 5);
                
                // Draw forge flames
                ctx.fillStyle = '#FF4500';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillText('🔥🔥🔥', this.x, this.y + 25);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(forge);
    }

    showExponentialSolution(challenge) {
        const solution = {
            x: challenge.x,
            y: challenge.y - 80,
            challenge: challenge,
            life: 4500,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 4500);
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                ctx.fillStyle = 'rgba(75, 0, 130, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 40, 160, 80, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                if (this.challenge.challenge.type === 'power') {
                    ctx.fillText(`${this.challenge.challenge.base}^${this.challenge.challenge.exponent}`, this.x, this.y - 15);
                    ctx.fillText(`= ${this.challenge.challenge.answer}`, this.x, this.y + 5);
                } else {
                    ctx.fillText(`√${this.challenge.challenge.base}`, this.x, this.y - 15);
                    ctx.fillText(`= ${this.challenge.challenge.answer}`, this.x, this.y + 5);
                }
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Power Solved!', this.x, this.y + 25);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(solution);
        challenge.isSolved = true;
    }

    showEquationSolution(station) {
        const solution = {
            x: station.x,
            y: station.y - 70,
            station: station,
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
                
                let color = 'rgba(139, 0, 0, 0.9)'; // Expert
                if (this.station.difficulty === 'intermediate') color = 'rgba(255, 140, 0, 0.9)';
                if (this.station.difficulty === 'advanced') color = 'rgba(75, 0, 130, 0.9)';
                
                ctx.fillStyle = color;
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 12);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.station.equation, this.x, this.y - 10);
                ctx.fillText(`x = ${this.station.answer}`, this.x, this.y + 10);
                
                // Show power progress
                ctx.fillStyle = '#32CD32';
                ctx.fillRect(this.x - 50, this.y + 20, (this.station.powerLevel / 100) * 100, 5);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 1;
                ctx.strokeRect(this.x - 50, this.y + 20, 100, 5);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(solution);
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
        if (this.currentProblem.type === 'exponentials') {
            this.addExponentialVisuals();
        } else if (this.currentProblem.type === 'advanced_equations') {
            this.addAdvancedEquationVisuals();
        }
    }

    addExponentialVisuals() {
        // Create exponential visualization
        this.createExponentialWorkspace(500, 120);
    }

    addAdvancedEquationVisuals() {
        // Create advanced equation visualization
        this.createAdvancedEquationWorkspace(450, 100);
    }

    createExponentialWorkspace(x, y) {
        const workspace = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw workspace
                ctx.fillStyle = 'rgba(75, 0, 130, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 140, this.y - 50, 280, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw exponential symbols
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText('2^x √x x!', this.x, this.y - 10);
                
                // Draw helper text
                ctx.fillStyle = '#FFD700';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Dragon Power Math!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(workspace);
    }

    createAdvancedEquationWorkspace(x, y) {
        const workspace = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw workspace
                ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 140, this.y - 50, 280, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw equation symbols
                ctx.font = '28px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText('x² + y = z³', this.x, this.y - 5);
                
                // Draw helper text
                ctx.fillStyle = '#FFD700';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Ancient Dragon Equations!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(workspace);
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`DragonSanctuary: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
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
        console.log(`Dragon Sanctuary: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
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
        
        // Make all dragons fly
        this.dragons.forEach(dragon => {
            dragon.isFlying = true;
            dragon.flyAnimationTime = 0;
            dragon.wisdomShared = Math.min(100, dragon.wisdomShared + 20);
            dragon.magicalEnergy = Math.min(dragon.power, dragon.magicalEnergy + 25);
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around dragons
        this.dragons.forEach(dragon => {
            this.gameEngine.createCelebrationParticles(dragon.x, dragon.y);
        });
        
        // Create dragon sanctuary celebration
        this.createSanctuaryCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createSanctuaryCelebration() {
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
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('DRAGON MASTERY!', this.x, this.y);
                ctx.fillText('DRAGON MASTERY!', this.x, this.y);
                
                // Draw celebrating dragons
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🐉🔥🐉', this.x, this.y + 60);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebration);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with ancient dragon
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
                ctx.fillStyle = 'rgba(75, 0, 130, 0.95)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 150, this.y - 50, 300, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw magical border
                ctx.strokeStyle = '#FF69B4';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.roundRect(this.x - 145, this.y - 45, 290, 90, 12);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Draw bubble tail
                ctx.fillStyle = 'rgba(75, 0, 130, 0.95)';
                ctx.beginPath();
                ctx.moveTo(this.x - 40, this.y + 50);
                ctx.lineTo(this.x - 30, this.y + 70);
                ctx.lineTo(this.x - 20, this.y + 50);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Draw text with word wrap
                ctx.fillStyle = '#FFFFFF';
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
            text: 'Dragon Sanctuary Complete!',
            subtext: 'You mastered exponentials and advanced equations! The dragons honor you!',
            life: 6000,
            opacity: 1,
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, 1200, 800);
                
                // Draw main text
                ctx.fillStyle = '#FFD700';
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
                
                // Draw celebration dragons
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🐉👑🐉', this.x, this.y + 120);
                
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
        console.log('Dragon Sanctuary completed! Returning to habitat selection...');
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
        this.dragons.forEach(dragon => {
            if (dragon.update) {
                dragon.update(deltaTime);
            }
        });
        
        // Update flames
        this.flames.forEach(flame => {
            if (flame.update) {
                flame.update(deltaTime);
            }
        });
        
        // Update sparkles
        this.sparkles.forEach(sparkle => {
            if (sparkle.update) {
                sparkle.update(deltaTime);
            }
        });
        
        // Update magic orbs
        this.magicOrbs.forEach(orb => {
            if (orb.update) {
                orb.update(deltaTime);
            }
        });
        
        // Update crystals
        this.crystals.forEach(crystal => {
            if (crystal.update) {
                crystal.update(deltaTime);
            }
        });
        
        // Update treasure hoards
        this.treasureHoards.forEach(treasure => {
            if (treasure.update) {
                treasure.update(deltaTime);
            }
        });
        
        // Update volcanoes
        this.volcanoes.forEach(volcano => {
            if (volcano.update) {
                volcano.update(deltaTime);
            }
        });
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 240000) { // 4 minute timeout for advanced problems
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
        this.dragons = [];
        this.dragonEggs = [];
        this.treasureHoards = [];
        this.crystals = [];
        this.volcanoes = [];
        this.castles = [];
        this.magicPortals = [];
        this.flames = [];
        this.sparkles = [];
        this.magicOrbs = [];
        this.ancientRunes = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DragonSanctuary;
}