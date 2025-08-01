// Rainbow Reserve Habitat for Times Table Animals
// Twelfth and final habitat focusing on all concepts and challenge problems

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
        
        // Habitat elements
        this.unicorns = [];
        this.phoenixes = [];
        this.rainbowBridges = [];
        this.crystalPools = [];
        this.magicTrees = [];
        this.cloudCastles = [];
        this.starGates = [];
        this.wisdomStones = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Magical rainbow environment
        this.rainbowRays = [];
        this.magicParticles = [];
        this.floatingRunes = [];
        this.cosmicElements = [];
        this.currentRainbowPhase = 0;
        this.masteryChallenges = [];
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('rainbowReserve');
        this.gameEngine.setBackground('rainbowReserve');
        
        // Create the magical rainbow environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createMagicalCreatures();
        this.createReserveFeatures();
        this.createRainbowEffects();
        this.addMasteryChallenges();
    }

    createMagicalCreatures() {
        // Create unicorns representing different mathematical domains
        const unicornGuardians = [
            { x: 200, y: 350, name: 'Arithmia', domain: 'arithmetic', mastery: ['addition', 'subtraction', 'multiplication', 'division'], power: 95 },
            { x: 400, y: 300, name: 'Algebrina', domain: 'algebra', mastery: ['variables', 'equations', 'factoring', 'polynomials'], power: 98 },
            { x: 600, y: 380, name: 'Geometrica', domain: 'geometry', mastery: ['shapes', 'area', 'perimeter', 'angles'], power: 92 },
            { x: 800, y: 320, name: 'Fractaline', domain: 'fractions', mastery: ['proper', 'improper', 'mixed', 'decimals'], power: 90 },
            { x: 1000, y: 370, name: 'Exponenta', domain: 'powers', mastery: ['exponents', 'roots', 'logarithms', 'scientific'], power: 96 },
            { x: 300, y: 500, name: 'Patterna', domain: 'patterns', mastery: ['sequences', 'series', 'fibonacci', 'primes'], power: 88 },
            { x: 700, y: 480, name: 'Statistica', domain: 'statistics', mastery: ['mean', 'median', 'mode', 'probability'], power: 85 },
            { x: 500, y: 200, name: 'Calculon', domain: 'calculus', mastery: ['limits', 'derivatives', 'integrals', 'optimization'], power: 99 },
            { x: 150, y: 450, name: 'Logica', domain: 'logic', mastery: ['proofs', 'reasoning', 'sets', 'functions'], power: 94 },
            { x: 900, y: 520, name: 'Infinita', domain: 'infinity', mastery: ['limits', 'series', 'convergence', 'paradoxes'], power: 100 }
        ];

        unicornGuardians.forEach((guardian, index) => {
            const unicorn = this.gameEngine.createSprite('penguin', guardian.x, guardian.y);
            unicorn.name = guardian.name;
            unicorn.domain = guardian.domain;
            unicorn.mastery = guardian.mastery;
            unicorn.power = guardian.power;
            unicorn.id = `unicorn_${index}`;
            unicorn.isGalloping = false;
            unicorn.gallopCooldown = Math.random() * 20000 + 15000;
            unicorn.originalX = guardian.x;
            unicorn.originalY = guardian.y;
            unicorn.hornGlow = 0;
            unicorn.magicAura = 100;
            unicorn.wisdomShared = 0;
            unicorn.challengesCompleted = 0;
            
            // Domain-based characteristics
            unicorn.width = 90 + (guardian.power / 10);
            unicorn.height = 80 + (guardian.power / 15);
            unicorn.gallopSpeed = guardian.power / 2;
            
            // Domain-based colors (rainbow spectrum)
            const domainColors = {
                'arithmetic': '#FF0000',    // Red
                'algebra': '#FF8C00',       // Orange  
                'geometry': '#FFD700',      // Yellow
                'fractions': '#32CD32',     // Green
                'powers': '#4169E1',        // Blue
                'patterns': '#8A2BE2',      // Indigo
                'statistics': '#9400D3',    // Violet
                'calculus': '#FF1493',      // Deep Pink
                'logic': '#00CED1',         // Dark Turquoise
                'infinity': '#FFD700'       // Gold
            };
            unicorn.tintColor = domainColors[guardian.domain] || '#FFFFFF';
            
            // Add unicorn behavior
            unicorn.update = (deltaTime) => {
                this.updateUnicorn(unicorn, deltaTime);
            };
            
            unicorn.onClick = () => {
                this.onUnicornClick(unicorn);
            };
            
            this.unicorns.push(unicorn);
            this.gameEngine.addSprite(unicorn);
        });

        // Create phoenixes representing advanced concepts
        const phoenixMasters = [
            { x: 350, y: 150, name: 'Renewal', concept: 'problem_solving', cycles: 5, flame: 'wisdom' },
            { x: 650, y: 120, name: 'Rebirth', concept: 'critical_thinking', cycles: 7, flame: 'insight' },
            { x: 500, y: 100, name: 'Infinity', concept: 'mathematical_beauty', cycles: 10, flame: 'inspiration' },
            { x: 800, y: 130, name: 'Transcendence', concept: 'mastery', cycles: 12, flame: 'perfection' }
        ];

        phoenixMasters.forEach((master, index) => {
            const phoenix = this.gameEngine.createSprite('penguin', master.x, master.y);
            phoenix.name = master.name;
            phoenix.concept = master.concept;
            phoenix.cycles = master.cycles;
            phoenix.flame = master.flame;
            phoenix.id = `phoenix_${index}`;
            phoenix.isFlying = true; // Phoenixes are always airborne
            phoenix.flightTime = Math.random() * 5000;
            phoenix.originalX = master.x;
            phoenix.originalY = master.y;
            phoenix.rebirth_energy = 100;
            phoenix.inspiration_level = 0;
            
            phoenix.width = 100;
            phoenix.height = 90;
            phoenix.tintColor = ['#FF4500', '#FF6347', '#FFD700', '#FF1493'][index];
            
            phoenix.update = (deltaTime) => {
                this.updatePhoenix(phoenix, deltaTime);
            };
            
            phoenix.onClick = () => {
                this.onPhoenixClick(phoenix);
            };
            
            this.phoenixes.push(phoenix);
            this.gameEngine.addSprite(phoenix);
        });
    }

    updateUnicorn(unicorn, deltaTime) {
        // Handle galloping animation
        unicorn.gallopCooldown -= deltaTime;
        
        if (unicorn.gallopCooldown <= 0 && !unicorn.isGalloping) {
            unicorn.isGalloping = true;
            unicorn.gallopCooldown = Math.random() * 25000 + 20000;
            unicorn.gallopAnimationTime = 0;
            unicorn.gallopDirection = Math.random() * Math.PI * 2;
            unicorn.gallopDistance = Math.random() * 150 + 100;
        }
        
        if (unicorn.isGalloping) {
            unicorn.gallopAnimationTime += deltaTime;
            const gallopProgress = unicorn.gallopAnimationTime / 8000; // 8 second gallop
            
            if (gallopProgress <= 1) {
                // Majestic unicorn gallop motion
                const gallopX = Math.sin(gallopProgress * Math.PI) * unicorn.gallopDistance * Math.cos(unicorn.gallopDirection);
                const gallopY = Math.sin(gallopProgress * Math.PI) * unicorn.gallopDistance * 0.4 * Math.sin(unicorn.gallopDirection);
                
                unicorn.x = unicorn.originalX + gallopX;
                unicorn.y = unicorn.originalY + gallopY;
                
                // Add magical floating motion
                const magicFloat = Math.sin(gallopProgress * Math.PI * 15) * 4;
                unicorn.y += magicFloat;
                
                // Keep unicorns in reserve bounds
                unicorn.x = Math.max(unicorn.width/2, Math.min(1200 - unicorn.width/2, unicorn.x));
                unicorn.y = Math.max(150, Math.min(600, unicorn.y));
            } else {
                unicorn.isGalloping = false;
                unicorn.x = unicorn.originalX;
                unicorn.y = unicorn.originalY;
            }
        }
        
        // Update horn glow
        unicorn.hornGlow = Math.sin(Date.now() / 1500 + unicorn.id) * 0.5 + 0.5;
        
        // Magical aura regeneration
        unicorn.magicAura = Math.min(100, unicorn.magicAura + deltaTime / 150);
    }

    updatePhoenix(phoenix, deltaTime) {
        // Phoenix eternal flight
        phoenix.flightTime += deltaTime;
        
        // Circular flight pattern
        const radius = 80;
        const speed = 0.001;
        phoenix.x = phoenix.originalX + Math.cos(phoenix.flightTime * speed) * radius;
        phoenix.y = phoenix.originalY + Math.sin(phoenix.flightTime * speed) * radius;
        
        // Rebirth cycle
        phoenix.rebirth_energy = Math.max(10, phoenix.rebirth_energy - deltaTime / 200);
        if (phoenix.rebirth_energy <= 20) {
            // Rebirth event
            phoenix.rebirth_energy = 100;
            phoenix.inspiration_level = Math.min(100, phoenix.inspiration_level + 25);
            this.createRebirthEffect(phoenix.x, phoenix.y);
        }
    }

    onUnicornClick(unicorn) {
        if (this.audioManager) {
            this.audioManager.playSFX('unicorn-magic');
        }
        
        // Make unicorn gallop
        unicorn.isGalloping = true;
        unicorn.gallopAnimationTime = 0;
        
        // Show unicorn's mathematical domain knowledge
        this.showUnicornWisdom(unicorn);
        
        // Create magical horn beam
        this.createHornBeam(unicorn);
        
        // Domain-specific demonstrations
        this.demonstrateMathematicalConcept(unicorn.domain, unicorn.x, unicorn.y);
        
        // Increase wisdom sharing
        unicorn.wisdomShared = Math.min(100, unicorn.wisdomShared + 15);
        unicorn.magicAura = Math.max(20, unicorn.magicAura - 20);
    }

    onPhoenixClick(phoenix) {
        if (this.audioManager) {
            this.audioManager.playSFX('phoenix-song');
        }
        
        // Show phoenix inspiration
        this.showPhoenixWisdom(phoenix);
        
        // Create rebirth flames
        this.createRebirthFlames(phoenix.x, phoenix.y, phoenix.flame);
        
        // Inspire all nearby unicorns
        this.inspireNearbyUnicorns(phoenix);
        
        phoenix.inspiration_level = Math.min(100, phoenix.inspiration_level + 20);
    }

    showUnicornWisdom(unicorn) {
        const wisdomSprite = {
            x: unicorn.x + 110,
            y: unicorn.y - 160,
            text: `${unicorn.name}\n${unicorn.domain.toUpperCase()} Guardian\nMastery: ${unicorn.mastery.join(', ')}\n🦄 Power: ${unicorn.power}%\n✨ Aura: ${Math.floor(unicorn.magicAura)}%\n📚 Wisdom: ${unicorn.wisdomShared}%\n🏆 Challenges: ${unicorn.challengesCompleted}`,
            life: 7000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 7000);
                this.y -= deltaTime / 140;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw magical wisdom bubble
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 120);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.7, 'rgba(255, 182, 193, 0.8)');
                gradient.addColorStop(1, 'rgba(138, 43, 226, 0.7)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 100, 200, 200, 25);
                ctx.fill();
                ctx.stroke();
                
                // Add sparkle border
                ctx.strokeStyle = '#FF69B4';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.roundRect(this.x - 95, this.y - 95, 190, 190, 22);
                ctx.stroke();
                ctx.setLineDash([]);
                
                ctx.fillStyle = '#4B0082';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    if (index === 0) {
                        ctx.fillStyle = '#8B0000';
                        ctx.font = '16px "Comic Sans MS", cursive';
                    } else if (index === 1) {
                        ctx.fillStyle = '#4B0082';
                        ctx.font = '14px "Comic Sans MS", cursive';
                    } else if (line.includes('Mastery:')) {
                        ctx.fillStyle = '#008000';
                        ctx.font = '11px "Comic Sans MS", cursive';
                    } else {
                        ctx.fillStyle = '#000080';
                        ctx.font = '12px "Comic Sans MS", cursive';
                    }
                    ctx.fillText(line, this.x, this.y - 85 + index * 18);
                });
                
                // Draw unicorn silhouette
                ctx.fillStyle = '#FFD700';
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🦄', this.x, this.y + 80);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(wisdomSprite);
    }

    showPhoenixWisdom(phoenix) {
        const phoenixWisdom = {
            x: phoenix.x,
            y: phoenix.y + 80,
            text: `${phoenix.name}\n${phoenix.concept.replace('_', ' ').toUpperCase()}\nCycles: ${phoenix.cycles}\nFlame: ${phoenix.flame}\n🔥 Inspiration: ${phoenix.inspiration_level}%`,
            life: 5500,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 5500);
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw phoenix wisdom with flame effect
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 80);
                gradient.addColorStop(0, 'rgba(255, 69, 0, 0.9)');
                gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0.7)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#8B0000';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 60, 160, 120, 20);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    if (index === 0) {
                        ctx.fillStyle = '#8B0000';
                        ctx.font = '16px "Comic Sans MS", cursive';
                    } else {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = '13px "Comic Sans MS", cursive';
                    }
                    ctx.fillText(line, this.x, this.y - 45 + index * 18);
                });
                
                // Draw phoenix silhouette
                ctx.fillStyle = '#FF4500';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillText('🔥🕊️🔥', this.x, this.y + 40);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(phoenixWisdom);
    }

    createHornBeam(unicorn) {
        const beam = {
            x: unicorn.x,
            y: unicorn.y - 20,
            targetX: unicorn.x + (Math.random() - 0.5) * 200,
            targetY: unicorn.y - 100,
            life: 2500,
            domain: unicorn.domain,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2500;
                
                // Draw magical beam
                const gradient = ctx.createLinearGradient(this.x, this.y, this.targetX, this.targetY);
                gradient.addColorStop(0, '#FFD700');
                gradient.addColorStop(0.5, '#FF69B4');
                gradient.addColorStop(1, '#9370DB');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.targetX, this.targetY);
                ctx.stroke();
                
                // Add sparkle effects along beam
                for (let i = 0; i < 5; i++) {
                    const t = i / 4;
                    const sparkleX = this.x + (this.targetX - this.x) * t;
                    const sparkleY = this.y + (this.targetY - this.y) * t;
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('✨', sparkleX, sparkleY);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(beam);
    }

    createRebirthEffect(x, y) {
        const rebirth = {
            x: x,
            y: y,
            life: 3000,
            flames: [],
            
            init: function() {
                // Create flame particles
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    this.flames.push({
                        x: this.x,
                        y: this.y,
                        vx: Math.cos(angle) * 50,
                        vy: Math.sin(angle) * 50,
                        life: 2500
                    });
                }
            },
            
            update: function(deltaTime) {
                if (this.flames.length === 0) this.init();
                
                this.life -= deltaTime;
                
                this.flames.forEach(flame => {
                    flame.x += flame.vx * deltaTime / 1000;
                    flame.y += flame.vy * deltaTime / 1000;
                    flame.life -= deltaTime;
                    flame.vy += 20; // gravity
                });
                
                this.flames = this.flames.filter(f => f.life > 0);
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                
                // Draw rebirth flames
                this.flames.forEach(flame => {
                    ctx.save();
                    ctx.globalAlpha = flame.life / 2500;
                    ctx.fillStyle = '#FF4500';
                    ctx.font = '20px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('🔥', flame.x, flame.y);
                    ctx.restore();
                });
                
                // Draw rebirth text
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#FF4500';
                ctx.lineWidth = 2;
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('REBIRTH!', this.x, this.y);
                ctx.fillText('REBIRTH!', this.x, this.y);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(rebirth);
    }

    createRebirthFlames(x, y, flameType) {
        const flames = {
            x: x,
            y: y,
            flameType: flameType,
            life: 4000,
            intensity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.intensity = this.life / 4000;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.intensity;
                
                // Draw different flame types
                let flameColor = '#FF4500';
                let flameText = '';
                switch (this.flameType) {
                    case 'wisdom':
                        flameColor = '#9370DB';
                        flameText = 'Wisdom Burns Bright!';
                        break;
                    case 'insight':
                        flameColor = '#FFD700';
                        flameText = 'Insight Illuminates!';
                        break;
                    case 'inspiration':
                        flameColor = '#FF69B4';
                        flameText = 'Inspiration Ignites!';
                        break;
                    case 'perfection':
                        flameColor = '#FFFFFF';
                        flameText = 'Perfection Achieved!';
                        break;
                }
                
                // Draw flame aura
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 60);
                gradient.addColorStop(0, flameColor);
                gradient.addColorStop(1, 'rgba(255, 69, 0, 0.3)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 60, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw flame text
                ctx.fillStyle = flameColor;
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(flameText, this.x, this.y + 80);
                ctx.fillText(flameText, this.x, this.y + 80);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(flames);
    }

    demonstrateMathematicalConcept(domain, x, y) {
        const demonstrations = {
            'arithmetic': () => this.showArithmeticDemo(x, y),
            'algebra': () => this.showAlgebraDemo(x, y),
            'geometry': () => this.showGeometryDemo(x, y),
            'fractions': () => this.showFractionsDemo(x, y),
            'powers': () => this.showPowersDemo(x, y),
            'patterns': () => this.showPatternsDemo(x, y),
            'statistics': () => this.showStatisticsDemo(x, y),
            'calculus': () => this.showCalculusDemo(x, y),
            'logic': () => this.showLogicDemo(x, y),
            'infinity': () => this.showInfinityDemo(x, y)
        };
        
        if (demonstrations[domain]) {
            demonstrations[domain]();
        }
    }

    showArithmeticDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            examples: ['12 + 8 = 20', '15 - 7 = 8', '6 × 9 = 54', '56 ÷ 7 = 8'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.examples.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.strokeStyle = '#8B0000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('ARITHMETIC', this.x, this.y - 15);
                ctx.fillText(this.examples[this.current], this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showAlgebraDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            examples: ['2x + 5 = 13', 'x = 4', 'y² - 9 = 0', 'y = ±3'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.examples.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(255, 140, 0, 0.8)';
                ctx.strokeStyle = '#FF8C00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('ALGEBRA', this.x, this.y - 15);
                ctx.fillText(this.examples[this.current], this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showGeometryDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            shapes: ['△', '□', '○', '⬟'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.shapes.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#000000';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('GEOMETRY', this.x, this.y - 15);
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillText(this.shapes[this.current], this.x, this.y + 10);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showFractionsDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            fractions: ['1/2', '3/4', '2/3', '5/8'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.fractions.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(50, 205, 50, 0.8)';
                ctx.strokeStyle = '#228B22';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('FRACTIONS', this.x, this.y - 15);
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillText(this.fractions[this.current], this.x, this.y + 8);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showPowersDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            powers: ['2³ = 8', '5² = 25', '√16 = 4', '3⁴ = 81'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.powers.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(65, 105, 225, 0.8)';
                ctx.strokeStyle = '#4169E1';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('POWERS', this.x, this.y - 15);
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.powers[this.current], this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showPatternsDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            patterns: [
                { seq: [1, 3, 5, 7, 9], name: 'ODD' },
                { seq: [1, 1, 2, 3, 5], name: 'FIB' },
                { seq: [2, 4, 8, 16], name: 'POW2' },
                { seq: [1, 4, 9, 16], name: 'SQR' }
            ],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.patterns.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(138, 43, 226, 0.8)';
                ctx.strokeStyle = '#8A2BE2';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                const pattern = this.patterns[this.current];
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('PATTERNS', this.x, this.y - 18);
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText(pattern.seq.join(','), this.x, this.y - 2);
                ctx.fillText(pattern.name, this.x, this.y + 14);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showStatisticsDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            stats: ['Mean: 7.5', 'Median: 8', 'Mode: 9', 'Range: 6'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.stats.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(148, 0, 211, 0.8)';
                ctx.strokeStyle = '#9400D3';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('STATISTICS', this.x, this.y - 15);
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText(this.stats[this.current], this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showCalculusDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            concepts: ['dy/dx', '∫f(x)dx', 'lim→∞', 'd²y/dx²'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.concepts.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(255, 20, 147, 0.8)';
                ctx.strokeStyle = '#FF1493';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('CALCULUS', this.x, this.y - 15);
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText(this.concepts[this.current], this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showLogicDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            logic: ['P ∧ Q', 'P ∨ Q', '¬P', 'P → Q'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.logic.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                ctx.fillStyle = 'rgba(0, 206, 209, 0.8)';
                ctx.strokeStyle = '#00CED1';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#000000';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('LOGIC', this.x, this.y - 15);
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillText(this.logic[this.current], this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    showInfinityDemo(x, y) {
        const demo = {
            x: x, y: y - 80, life: 5000,
            infinity: ['∞', '∑∞', 'lim→∞', '∞!'],
            current: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.current = Math.floor((5000 - this.life) / 1250) % this.infinity.length;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 70);
                gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
                gradient.addColorStop(1, 'rgba(75, 0, 130, 0.8)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('INFINITY', this.x, this.y - 15);
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillText(this.infinity[this.current], this.x, this.y + 8);
                
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(demo);
    }

    inspireNearbyUnicorns(phoenix) {
        this.unicorns.forEach(unicorn => {
            const distance = Math.sqrt(Math.pow(unicorn.x - phoenix.x, 2) + Math.pow(unicorn.y - phoenix.y, 2));
            if (distance < 200) {
                unicorn.magicAura = Math.min(100, unicorn.magicAura + 25);
                unicorn.wisdomShared = Math.min(100, unicorn.wisdomShared + 10);
                this.createInspirationEffect(unicorn.x, unicorn.y);
            }
        });
    }

    createInspirationEffect(x, y) {
        const inspiration = {
            x: x, y: y - 50, life: 2000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.y -= deltaTime / 50;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                ctx.fillStyle = '#FFD700';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('✨ INSPIRED! ✨', this.x, this.y);
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(inspiration);
    }

    createReserveFeatures() {
        // Create rainbow bridges connecting mathematical concepts
        this.createRainbowBridges();
        
        // Create crystal pools of knowledge
        this.createCrystalPools();
        
        // Create magic trees bearing mathematical fruit
        this.createMagicTrees();
        
        // Create cloud castles in the sky
        this.createCloudCastles();
    }

    createRainbowBridges() {
        const bridges = [
            { start: {x: 100, y: 400}, end: {x: 300, y: 350}, connects: ['arithmetic', 'algebra'] },
            { start: {x: 300, y: 350}, end: {x: 500, y: 300}, connects: ['algebra', 'geometry'] },
            { start: {x: 500, y: 300}, end: {x: 700, y: 350}, connects: ['geometry', 'fractions'] },
            { start: {x: 700, y: 350}, end: {x: 900, y: 300}, connects: ['fractions', 'powers'] },
            { start: {x: 900, y: 300}, end: {x: 1100, y: 350}, connects: ['powers', 'patterns'] }
        ];

        bridges.forEach((bridgeData, index) => {
            const bridge = {
                start: bridgeData.start,
                end: bridgeData.end,
                connects: bridgeData.connects,
                rainbowTime: Math.random() * 2000,
                
                update: function(deltaTime) {
                    this.rainbowTime += deltaTime;
                },
                
                render: function(ctx) {
                    ctx.save();
                    
                    // Draw rainbow bridge
                    const colors = ['#FF0000', '#FF8C00', '#FFD700', '#32CD32', '#4169E1', '#8A2BE2', '#9400D3'];
                    
                    for (let i = 0; i < colors.length; i++) {
                        ctx.strokeStyle = colors[i];
                        ctx.lineWidth = 8 - i;
                        ctx.globalAlpha = 0.8;
                        
                        // Create arc bridge
                        const midX = (this.start.x + this.end.x) / 2;
                        const midY = Math.min(this.start.y, this.end.y) - 50;
                        
                        ctx.beginPath();
                        ctx.moveTo(this.start.x, this.start.y);
                        ctx.quadraticCurveTo(midX, midY, this.end.x, this.end.y);
                        ctx.stroke();
                    }
                    
                    // Add sparkles along bridge
                    const sparklePhase = Math.sin(this.rainbowTime / 1000);
                    if (sparklePhase > 0.5) {
                        for (let j = 0; j < 5; j++) {
                            const t = j / 4;
                            const sparkleX = this.start.x + (this.end.x - this.start.x) * t;
                            const sparkleY = this.start.y + (this.end.y - this.start.y) * t - 25;
                            
                            ctx.fillStyle = '#FFFFFF';
                            ctx.font = '12px "Comic Sans MS", cursive';
                            ctx.textAlign = 'center';
                            ctx.fillText('✨', sparkleX, sparkleY);
                        }
                    }
                    
                    ctx.restore();
                }
            };
            
            this.rainbowBridges.push(bridge);
            this.gameEngine.addSprite(bridge);
        });
    }

    createCrystalPools() {
        const pools = [
            { x: 250, y: 650, knowledge: 'Pure Mathematics', depth: 'infinite', clarity: 100 },
            { x: 550, y: 680, knowledge: 'Applied Mathematics', depth: 'practical', clarity: 95 },
            { x: 850, y: 640, knowledge: 'Mathematical Beauty', depth: 'aesthetic', clarity: 100 }
        ];

        pools.forEach(poolData => {
            const pool = {
                x: poolData.x,
                y: poolData.y,
                knowledge: poolData.knowledge,
                depth: poolData.depth,
                clarity: poolData.clarity,
                rippleTime: Math.random() * 3000,
                
                onClick: () => {
                    this.onCrystalPoolClick(pool);
                },
                
                update: function(deltaTime) {
                    this.rippleTime += deltaTime;
                },
                
                render: function(ctx) {
                    // Draw crystal pool
                    const ripple = Math.sin(this.rippleTime / 1500) * 5;
                    
                    ctx.fillStyle = 'rgba(0, 191, 255, 0.8)';
                    ctx.strokeStyle = '#4169E1';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 40 + ripple, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Inner reflection
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.beginPath();
                    ctx.arc(this.x - 10, this.y - 10, 15, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Knowledge label
                    ctx.fillStyle = '#000080';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.knowledge, this.x, this.y + 60);
                    ctx.fillText(`Clarity: ${this.clarity}%`, this.x, this.y + 75);
                }
            };
            
            this.crystalPools.push(pool);
            this.gameEngine.addSprite(pool);
        });
    }

    createMagicTrees() {
        const trees = [
            { x: 150, y: 550, fruit: 'knowledge_apples', variety: 'Wisdom Tree', magical_property: 'eternal_learning' },
            { x: 450, y: 580, fruit: 'understanding_pears', variety: 'Insight Tree', magical_property: 'clarity_boost' },
            { x: 750, y: 520, fruit: 'mastery_oranges', variety: 'Achievement Tree', magical_property: 'skill_enhancement' },
            { x: 1050, y: 560, fruit: 'inspiration_berries', variety: 'Creativity Tree', magical_property: 'idea_generation' }
        ];

        trees.forEach(treeData => {
            const tree = {
                x: treeData.x,
                y: treeData.y,
                fruit: treeData.fruit,
                variety: treeData.variety,
                magicalProperty: treeData.magical_property,
                fruitCount: Math.floor(Math.random() * 12) + 8,
                swayTime: Math.random() * 2000,
                
                onClick: () => {
                    this.onMagicTreeClick(tree);
                },
                
                update: function(deltaTime) {
                    this.swayTime += deltaTime;
                },
                
                render: function(ctx) {
                    const sway = Math.sin(this.swayTime / 2500) * 8;
                    
                    // Draw trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x - 10 + sway/2, this.y, 20, 100);
                    
                    // Draw magical canopy
                    const gradient = ctx.createRadialGradient(this.x, this.y - 50, 0, this.x, this.y - 50, 60);
                    gradient.addColorStop(0, '#32CD32');
                    gradient.addColorStop(0.7, '#228B22');
                    gradient.addColorStop(1, '#006400');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(this.x + sway, this.y - 50, 60, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw magical fruit
                    const fruitColors = {
                        'knowledge_apples': '#FF0000',
                        'understanding_pears': '#FFFF00',
                        'mastery_oranges': '#FFA500',
                        'inspiration_berries': '#9370DB'
                    };
                    
                    ctx.fillStyle = fruitColors[this.fruit] || '#FF69B4';
                    for (let i = 0; i < Math.min(this.fruitCount, 8); i++) {
                        const angle = (i / 8) * Math.PI * 2;
                        const fruitX = this.x + Math.cos(angle) * 30 + sway;
                        const fruitY = this.y - 50 + Math.sin(angle) * 20;
                        ctx.beginPath();
                        ctx.arc(fruitX, fruitY, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Add magical glow
                    ctx.fillStyle = '#FFD700';
                    ctx.font = '10px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('✨', this.x + sway, this.y - 90);
                    
                    // Tree label
                    ctx.fillStyle = '#654321';
                    ctx.font = '11px "Comic Sans MS", cursive';
                    ctx.fillText(this.variety, this.x, this.y + 120);
                    ctx.fillText(`🍎 ${this.fruitCount}`, this.x, this.y + 135);
                }
            };
            
            this.magicTrees.push(tree);
            this.gameEngine.addSprite(tree);
        });
    }

    createCloudCastles() {
        const castles = [
            { x: 300, y: 80, name: 'Castle of Theorems', residents: 'Mathematical Scholars', specialty: 'proof_development' },
            { x: 700, y: 60, name: 'Palace of Equations', residents: 'Algebra Masters', specialty: 'equation_solving' },
            { x: 1000, y: 90, name: 'Tower of Infinity', residents: 'Cosmic Mathematicians', specialty: 'transcendental_concepts' }
        ];

        castles.forEach(castleData => {
            const castle = {
                x: castleData.x,
                y: castleData.y,
                name: castleData.name,
                residents: castleData.residents,
                specialty: castleData.specialty,
                floatTime: Math.random() * 4000,
                
                onClick: () => {
                    this.onCloudCastleClick(castle);
                },
                
                update: function(deltaTime) {
                    this.floatTime += deltaTime;
                    this.y = castleData.y + Math.sin(this.floatTime / 3000) * 10;
                },
                
                render: function(ctx) {
                    // Draw cloud base
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.strokeStyle = '#E6E6FA';
                    ctx.lineWidth = 2;
                    
                    // Multiple cloud puffs
                    ctx.beginPath();
                    ctx.arc(this.x - 30, this.y + 20, 25, 0, Math.PI * 2);
                    ctx.arc(this.x, this.y + 20, 30, 0, Math.PI * 2);
                    ctx.arc(this.x + 30, this.y + 20, 25, 0, Math.PI * 2);
                    ctx.arc(this.x, this.y, 35, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw castle structure
                    ctx.fillStyle = '#D3D3D3';
                    ctx.strokeStyle = '#A9A9A9';
                    ctx.lineWidth = 2;
                    
                    // Main tower
                    ctx.fillRect(this.x - 15, this.y - 30, 30, 40);
                    ctx.strokeRect(this.x - 15, this.y - 30, 30, 40);
                    
                    // Side towers
                    ctx.fillRect(this.x - 35, this.y - 15, 20, 25);
                    ctx.strokeRect(this.x - 35, this.y - 15, 20, 25);
                    ctx.fillRect(this.x + 15, this.y - 15, 20, 25);
                    ctx.strokeRect(this.x + 15, this.y - 15, 20, 25);
                    
                    // Castle flags
                    ctx.fillStyle = '#FF69B4';
                    ctx.fillRect(this.x - 2, this.y - 45, 4, 15);
                    ctx.fillRect(this.x - 32, this.y - 25, 4, 10);
                    ctx.fillRect(this.x + 28, this.y - 25, 4, 10);
                    
                    // Castle name
                    ctx.fillStyle = '#4B0082';
                    ctx.font = '10px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.name, this.x, this.y + 50);
                }
            };
            
            this.cloudCastles.push(castle);
            this.gameEngine.addSprite(castle);
        });
    }

    createRainbowEffects() {
        // Create rainbow rays
        for (let i = 0; i < 7; i++) {
            const ray = {
                x: 600,
                y: 100,
                angle: (i / 7) * Math.PI * 0.8 + Math.PI * 0.1,
                color: ['#FF0000', '#FF8C00', '#FFD700', '#32CD32', '#4169E1', '#8A2BE2', '#9400D3'][i],
                length: 400 + Math.random() * 200,
                shimmerTime: Math.random() * 2000,
                
                update: function(deltaTime) {
                    this.shimmerTime += deltaTime;
                },
                
                render: function(ctx) {
                    const shimmer = 0.7 + Math.sin(this.shimmerTime / 1000) * 0.3;
                    
                    ctx.save();
                    ctx.globalAlpha = shimmer;
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 8;
                    
                    const endX = this.x + Math.cos(this.angle) * this.length;
                    const endY = this.y + Math.sin(this.angle) * this.length;
                    
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            };
            
            this.rainbowRays.push(ray);
            this.gameEngine.addSprite(ray);
        }

        // Create magical particles
        for (let i = 0; i < 30; i++) {
            const particle = {
                x: Math.random() * 1200,
                y: Math.random() * 800,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                color: ['#FF69B4', '#FFD700', '#9370DB', '#32CD32', '#FF4500'][Math.floor(Math.random() * 5)],
                life: Math.random() * 5000 + 3000,
                maxLife: 0,
                size: Math.random() * 6 + 2,
                
                init: function() {
                    this.maxLife = this.life;
                },
                
                update: function(deltaTime) {
                    if (this.maxLife === 0) this.init();
                    
                    this.life -= deltaTime;
                    this.x += this.vx * deltaTime / 1000;
                    this.y += this.vy * deltaTime / 1000;
                    
                    // Wrap around screen
                    if (this.x < 0) this.x = 1200;
                    if (this.x > 1200) this.x = 0;
                    if (this.y < 0) this.y = 800;
                    if (this.y > 800) this.y = 0;
                    
                    // Regenerate if life expires
                    if (this.life <= 0) {
                        this.life = Math.random() * 5000 + 3000;
                        this.x = Math.random() * 1200;
                        this.y = Math.random() * 800;
                        this.vx = (Math.random() - 0.5) * 20;
                        this.vy = (Math.random() - 0.5) * 20;
                        this.color = ['#FF69B4', '#FFD700', '#9370DB', '#32CD32', '#FF4500'][Math.floor(Math.random() * 5)];
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.life / this.maxLife;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            };
            
            this.magicParticles.push(particle);
            this.gameEngine.addSprite(particle);
        }
    }

    onCrystalPoolClick(pool) {
        if (this.audioManager) {
            this.audioManager.playSFX('crystal-chime');
        }
        
        this.showPoolWisdom(pool);
        this.createKnowledgeRipples(pool.x, pool.y);
    }

    onMagicTreeClick(tree) {
        if (this.audioManager) {
            this.audioManager.playSFX('magic-tree-harvest');
        }
        
        if (tree.fruitCount > 0) {
            tree.fruitCount--;
            this.harvestMagicalFruit(tree);
            this.createFruitBenefit(tree.x, tree.y, tree.fruit);
        }
    }

    onCloudCastleClick(castle) {
        if (this.audioManager) {
            this.audioManager.playSFX('castle-bells');
        }
        
        this.showCastleWisdom(castle);
        this.summonMathematicalSpirits(castle.x, castle.y);
    }

    showPoolWisdom(pool) {
        const wisdom = {
            x: pool.x,
            y: pool.y - 80,
            text: `${pool.knowledge}\nDepth: ${pool.depth}\nClarity: ${pool.clarity}%\n💎 Crystal Pool of Knowledge 💎`,
            life: 4000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 4000);
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 80);
                gradient.addColorStop(0, 'rgba(0, 191, 255, 0.9)');
                gradient.addColorStop(1, 'rgba(65, 105, 225, 0.7)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#000080';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 50, 160, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    if (line.includes('💎')) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '16px "Comic Sans MS", cursive';
                    } else if (index === 0) {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = '16px "Comic Sans MS", cursive';
                    } else {
                        ctx.fillStyle = '#E6E6FA';
                        ctx.font = '13px "Comic Sans MS", cursive';
                    }
                    ctx.fillText(line, this.x, this.y - 35 + index * 18);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(wisdom);
    }

    showCastleWisdom(castle) {
        const wisdom = {
            x: castle.x,
            y: castle.y + 80,
            text: `${castle.name}\nResidents: ${castle.residents}\nSpecialty: ${castle.specialty.replace('_', ' ')}\n🏰 Cloud Castle 🏰`,
            life: 5000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 5000);
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                const gradient = ctx.createLinearGradient(this.x, this.y - 50, this.x, this.y + 50);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                gradient.addColorStop(1, 'rgba(230, 230, 250, 0.9)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#4B0082';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 90, this.y - 50, 180, 100, 20);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#4B0082';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    if (line.includes('🏰')) {
                        ctx.fillStyle = '#8B0000';
                        ctx.font = '16px "Comic Sans MS", cursive';
                    } else if (index === 0) {
                        ctx.fillStyle = '#8B0000';
                        ctx.font = '16px "Comic Sans MS", cursive';
                    } else {
                        ctx.fillStyle = '#000080';
                        ctx.font = '13px "Comic Sans MS", cursive';
                    }
                    ctx.fillText(line, this.x, this.y - 35 + index * 18);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(wisdom);
    }

    createKnowledgeRipples(x, y) {
        for (let i = 0; i < 5; i++) {
            const ripple = {
                x: x,
                y: y,
                radius: 0,
                maxRadius: 80 + i * 20,
                life: 3000,
                delay: i * 500,
                
                update: function(deltaTime) {
                    if (this.delay > 0) {
                        this.delay -= deltaTime;
                        return;
                    }
                    
                    this.life -= deltaTime;
                    this.radius = this.maxRadius * (1 - this.life / 3000);
                    
                    if (this.life <= 0) this.isDead = true;
                },
                
                render: function(ctx) {
                    if (this.delay > 0) return;
                    
                    ctx.save();
                    ctx.globalAlpha = this.life / 3000;
                    ctx.strokeStyle = '#00BFFF';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(ripple);
        }
    }

    harvestMagicalFruit(tree) {
        const fruit = {
            x: tree.x,
            y: tree.y - 50,
            type: tree.fruit,
            life: 2000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.y -= deltaTime / 50;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 2000;
                
                const fruitEmojis = {
                    'knowledge_apples': '🍎',
                    'understanding_pears': '🍐',
                    'mastery_oranges': '🍊',
                    'inspiration_berries': '🫐'
                };
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(fruitEmojis[this.type] || '🍇', this.x, this.y);
                
                ctx.fillStyle = '#32CD32';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('✨ HARVESTED! ✨', this.x, this.y + 30);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(fruit);
    }

    createFruitBenefit(x, y, fruitType) {
        const benefits = {
            'knowledge_apples': 'Wisdom +15',
            'understanding_pears': 'Clarity +20',
            'mastery_oranges': 'Skill +25',
            'inspiration_berries': 'Creativity +30'
        };
        
        const benefit = {
            x: x,
            y: y - 80,
            text: benefits[fruitType] || 'Magic +10',
            life: 3000,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.y -= deltaTime / 40;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                ctx.fillStyle = '#FF69B4';
                ctx.strokeStyle = '#8B0000';
                ctx.lineWidth = 2;
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(this.text, this.x, this.y);
                ctx.fillText(this.text, this.x, this.y);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(benefit);
    }

    summonMathematicalSpirits(x, y) {
        const spirits = ['📐', '∑', '∞', '√', '∫', 'π', 'Φ', 'ε'];
        
        for (let i = 0; i < 6; i++) {
            const spirit = {
                x: x,
                y: y,
                symbol: spirits[Math.floor(Math.random() * spirits.length)],
                angle: (i / 6) * Math.PI * 2,
                radius: 0,
                maxRadius: 100,
                life: 4000,
                
                update: function(deltaTime) {
                    this.life -= deltaTime;
                    this.radius = Math.min(this.maxRadius, this.radius + deltaTime / 20);
                    this.angle += deltaTime / 2000;
                    
                    this.x = x + Math.cos(this.angle) * this.radius;
                    this.y = y + Math.sin(this.angle) * this.radius;
                    
                    if (this.life <= 0) this.isDead = true;
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.life / 4000;
                    ctx.fillStyle = '#9370DB';
                    ctx.font = '20px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.symbol, this.x, this.y);
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(spirit);
        }
    }

    addMasteryChallenges() {
        const challenges = [
            { name: 'Ultimate Calculator', difficulty: 'Legendary', reward: 'Mathematical Omniscience' },
            { name: 'Infinity Solver', difficulty: 'Transcendent', reward: 'Cosmic Understanding' },
            { name: 'Rainbow Bridge Builder', difficulty: 'Master', reward: 'Universal Knowledge' },
            { name: 'Phoenix Rebirth', difficulty: 'Epic', reward: 'Eternal Wisdom' },
            { name: 'Unicorn Harmony', difficulty: 'Mythical', reward: 'Perfect Balance' }
        ];
        
        challenges.forEach((challenge, index) => {
            const masteryChallenge = {
                x: 100 + index * 240,
                y: 750,
                name: challenge.name,
                difficulty: challenge.difficulty,
                reward: challenge.reward,
                progress: 0,
                unlocked: false,
                
                onClick: () => {
                    this.onMasteryChallengeClick(masteryChallenge);
                },
                
                render: function(ctx) {
                    // Draw challenge pedestal
                    const gradient = ctx.createLinearGradient(this.x, this.y - 30, this.x, this.y + 30);
                    gradient.addColorStop(0, '#FFD700');
                    gradient.addColorStop(1, '#8B7D6B');
                    
                    ctx.fillStyle = gradient;
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 40, this.y - 30, 80, 60, 10);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Challenge icon
                    ctx.fillStyle = this.unlocked ? '#32CD32' : '#696969';
                    ctx.font = '24px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('🏆', this.x, this.y - 5);
                    
                    // Progress bar
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(this.x - 35, this.y + 15, 70, 8);
                    ctx.fillStyle = this.unlocked ? '#00FF00' : '#FF4500';
                    ctx.fillRect(this.x - 35, this.y + 15, 70 * (this.progress / 100), 8);
                    
                    // Challenge name
                    ctx.fillStyle = '#000080';
                    ctx.font = '10px "Comic Sans MS", cursive';
                    ctx.fillText(this.name, this.x, this.y + 40);
                }
            };
            
            this.masteryChallenges.push(masteryChallenge);
            this.gameEngine.addSprite(masteryChallenge);
        });
    }

    onMasteryChallengeClick(challenge) {
        if (this.audioManager) {
            this.audioManager.playSFX('challenge-accept');
        }
        
        this.showChallengeDetails(challenge);
        
        if (!challenge.unlocked && this.problemsSolved >= this.totalProblems * 0.8) {
            challenge.unlocked = true;
            challenge.progress = 25;
            this.createChallengeUnlockEffect(challenge.x, challenge.y);
        }
    }

    showChallengeDetails(challenge) {
        const details = {
            x: challenge.x,
            y: challenge.y - 100,
            challenge: challenge,
            life: 6000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 6000);
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 100);
                gradient.addColorStop(0, 'rgba(255, 215, 0, 0.95)');
                gradient.addColorStop(1, 'rgba(255, 140, 0, 0.8)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 60, 200, 120, 20);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#8B0000';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.challenge.name, this.x, this.y - 35);
                
                ctx.fillStyle = '#000080';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText(`Difficulty: ${this.challenge.difficulty}`, this.x, this.y - 15);
                ctx.fillText(`Progress: ${this.challenge.progress}%`, this.x, this.y + 5);
                
                ctx.fillStyle = '#006400';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText(`Reward: ${this.challenge.reward}`, this.x, this.y + 25);
                
                ctx.fillStyle = this.challenge.unlocked ? '#32CD32' : '#FF4500';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText(this.challenge.unlocked ? '✅ UNLOCKED' : '🔒 LOCKED', this.x, this.y + 45);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(details);
    }

    createChallengeUnlockEffect(x, y) {
        const unlock = {
            x: x,
            y: y,
            life: 3000,
            particles: [],
            
            init: function() {
                for (let i = 0; i < 20; i++) {
                    this.particles.push({
                        x: this.x,
                        y: this.y,
                        vx: (Math.random() - 0.5) * 100,
                        vy: (Math.random() - 0.5) * 100,
                        life: 2500,
                        color: ['#FFD700', '#FF69B4', '#32CD32', '#FF4500', '#9370DB'][Math.floor(Math.random() * 5)]
                    });
                }
            },
            
            update: function(deltaTime) {
                if (this.particles.length === 0) this.init();
                
                this.life -= deltaTime;
                
                this.particles.forEach(particle => {
                    particle.x += particle.vx * deltaTime / 1000;
                    particle.y += particle.vy * deltaTime / 1000;
                    particle.life -= deltaTime;
                });
                
                this.particles = this.particles.filter(p => p.life > 0);
                
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                
                // Draw particles
                this.particles.forEach(particle => {
                    ctx.save();
                    ctx.globalAlpha = particle.life / 2500;
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
                
                // Draw unlock text
                ctx.globalAlpha = this.life / 3000;
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#8B0000';
                ctx.lineWidth = 2;
                ctx.font = '28px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('CHALLENGE UNLOCKED!', this.x, this.y);
                ctx.fillText('CHALLENGE UNLOCKED!', this.x, this.y);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(unlock);
    }

    startNextProblem() {
        if (this.problemsSolved >= this.totalProblems) {
            this.completeHabitat();
            return;
        }

        // Generate advanced challenge problem combining multiple concepts
        const problemTypes = [
            'mixed_operations_word_problem',
            'algebraic_equations',
            'geometric_calculations',
            'statistical_analysis',
            'exponential_functions',
            'complex_fractions',
            'pattern_recognition',
            'logical_reasoning',
            'measurement_conversions',
            'probability_calculations'
        ];
        
        const selectedType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        this.currentProblem = this.mathEngine.generateProblem(selectedType, this.problemsSolved + 1);
        
        this.problemStartTime = Date.now();
        this.hintActive = false;
        
        // Update problem display with enhanced visual effects
        this.updateProblemDisplay();
        
        // Create problem announcement
        this.createProblemAnnouncement();
        
        if (this.audioManager) {
            this.audioManager.playVoice(`rainbow-reserve-problem-${this.problemsSolved + 1}`);
        }
    }

    updateProblemDisplay() {
        const problemDisplay = document.getElementById('problem-display');
        if (!problemDisplay) return;

        problemDisplay.innerHTML = `
            <div class="rainbow-reserve-problem">
                <div class="problem-header">
                    <h2>🌈 Rainbow Reserve Challenge ${this.problemsSolved + 1}/${this.totalProblems} 🌈</h2>
                    <div class="mastery-level">Ultimate Mathematical Mastery</div>
                </div>
                <div class="problem-content">
                    <div class="problem-text">${this.currentProblem.question}</div>
                    ${this.currentProblem.visual ? `<div class="problem-visual">${this.currentProblem.visual}</div>` : ''}
                    ${this.currentProblem.choices ? this.createChoicesHTML() : this.createInputHTML()}
                </div>
                <div class="progress-indicator">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(this.problemsSolved / this.totalProblems) * 100}%"></div>
                    </div>
                    <div class="mastery-stats">
                        Domains Mastered: ${this.calculateMasteredDomains()}/10 |
                        Phoenix Inspiration: ${this.calculatePhoenixInspiration()}% |
                        Unicorn Harmony: ${this.calculateUnicornHarmony()}%
                    </div>
                </div>
            </div>
        `;
    }

    createChoicesHTML() {
        return `
            <div class="answer-choices rainbow-choices">
                ${this.currentProblem.choices.map((choice, index) =>
                    `<button class="choice-btn rainbow-choice" onclick="gameController.checkAnswer('${choice}')">${choice}</button>`
                ).join('')}
            </div>
        `;
    }

    createInputHTML() {
        return `
            <div class="answer-input rainbow-input">
                <input type="text" id="answer-input" placeholder="Enter your answer..." />
                <button onclick="gameController.checkAnswer(document.getElementById('answer-input').value)">Submit Answer</button>
            </div>
        `;
    }

    calculateMasteredDomains() {
        return this.unicorns.filter(unicorn => unicorn.wisdomShared >= 80).length;
    }

    calculatePhoenixInspiration() {
        const totalInspiration = this.phoenixes.reduce((sum, phoenix) => sum + phoenix.inspiration_level, 0);
        return Math.floor(totalInspiration / this.phoenixes.length);
    }

    calculateUnicornHarmony() {
        const totalHarmony = this.unicorns.reduce((sum, unicorn) => sum + unicorn.magicAura, 0);
        return Math.floor(totalHarmony / this.unicorns.length);
    }

    createProblemAnnouncement() {
        const announcement = {
            x: 600,
            y: 200,
            text: `Challenge ${this.problemsSolved + 1}: ${this.currentProblem.concept || 'Master Challenge'}`,
            life: 4000,
            scale: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.scale = Math.min(1, (4000 - this.life) / 1000);
                
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4000;
                ctx.translate(this.x, this.y);
                ctx.scale(this.scale, this.scale);
                
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
                gradient.addColorStop(0, '#FFD700');
                gradient.addColorStop(0.5, '#FF69B4');
                gradient.addColorStop(1, '#9370DB');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 3;
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText(this.text, 0, 0);
                ctx.fillText(this.text, 0, 0);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(announcement);
    }

    checkAnswer(userAnswer) {
        const isCorrect = this.mathEngine.checkAnswer(this.currentProblem, userAnswer);
        
        if (isCorrect) {
            this.onCorrectAnswer();
        } else {
            this.onIncorrectAnswer();
        }
    }

    onCorrectAnswer() {
        this.problemsSolved++;
        this.celebrationActive = true;
        
        // Celebrate with all creatures
        this.createMasteryDiamondCelebration();
        this.triggerRainbowReserveCelebration();
        
        // Update unicorn and phoenix stats
        this.enhanceCreatureAbilities();
        
        // Check for mastery challenge unlocks
        this.checkMasteryChallengeUnlocks();
        
        if (this.audioManager) {
            this.audioManager.playSFX('rainbow-reserve-correct');
            this.audioManager.playVoice('rainbow-reserve-celebration');
        }
        
        // Start next problem after celebration
        this.nextProblemTimer = setTimeout(() => {
            this.celebrationActive = false;
            this.startNextProblem();
        }, 4000);
    }

    onIncorrectAnswer() {
        this.createEncouragementEffect();
        this.provideAdvancedHint();
        
        if (this.audioManager) {
            this.audioManager.playSFX('rainbow-reserve-incorrect');
            this.audioManager.playVoice('rainbow-reserve-hint');
        }
    }

    createMasteryDiamondCelebration() {
        const diamond = {
            x: 600,
            y: 300,
            size: 0,
            maxSize: 100,
            life: 5000,
            rotation: 0,
            sparkles: [],
            
            init: function() {
                for (let i = 0; i < 16; i++) {
                    const angle = (i / 16) * Math.PI * 2;
                    this.sparkles.push({
                        x: this.x,
                        y: this.y,
                        targetX: this.x + Math.cos(angle) * 200,
                        targetY: this.y + Math.sin(angle) * 200,
                        progress: 0,
                        color: ['#FF0000', '#FF8C00', '#FFD700', '#32CD32', '#4169E1', '#8A2BE2', '#9400D3'][i % 7]
                    });
                }
            },
            
            update: function(deltaTime) {
                if (this.sparkles.length === 0) this.init();
                
                this.life -= deltaTime;
                this.size = Math.min(this.maxSize, this.size + deltaTime / 50);
                this.rotation += deltaTime / 1000;
                
                this.sparkles.forEach(sparkle => {
                    sparkle.progress = Math.min(1, sparkle.progress + deltaTime / 3000);
                    sparkle.x = this.x + (sparkle.targetX - this.x) * sparkle.progress;
                    sparkle.y = this.y + (sparkle.targetY - this.y) * sparkle.progress;
                });
                
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                // Draw diamond
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.3, '#FFD700');
                gradient.addColorStop(0.6, '#FF69B4');
                gradient.addColorStop(1, '#9370DB');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 4;
                
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size * 0.7, 0);
                ctx.lineTo(0, this.size);
                ctx.lineTo(-this.size * 0.7, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                ctx.restore();
                
                // Draw sparkles
                this.sparkles.forEach(sparkle => {
                    ctx.save();
                    ctx.globalAlpha = (this.life / 5000) * (1 - sparkle.progress);
                    ctx.fillStyle = sparkle.color;
                    ctx.font = '20px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('✨', sparkle.x, sparkle.y);
                    ctx.restore();
                });
                
                // Draw mastery text
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#8B0000';
                ctx.lineWidth = 2;
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('MASTERY!', this.x, this.y + 150);
                ctx.fillText('MASTERY!', this.x, this.y + 150);
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(diamond);
    }

    triggerRainbowReserveCelebration() {
        // Make all unicorns gallop in celebration
        this.unicorns.forEach(unicorn => {
            unicorn.isGalloping = true;
            unicorn.gallopAnimationTime = 0;
            unicorn.wisdomShared = Math.min(100, unicorn.wisdomShared + 5);
        });
        
        // Make all phoenixes perform rebirth
        this.phoenixes.forEach(phoenix => {
            phoenix.inspiration_level = Math.min(100, phoenix.inspiration_level + 10);
            this.createRebirthEffect(phoenix.x, phoenix.y);
        });
        
        // Activate rainbow effects
        this.currentRainbowPhase = (this.currentRainbowPhase + 1) % 7;
        this.enhanceRainbowEffects();
    }

    enhanceCreatureAbilities() {
        // Enhance unicorn abilities based on problem type
        const randomUnicorn = this.unicorns[Math.floor(Math.random() * this.unicorns.length)];
        randomUnicorn.challengesCompleted++;
        randomUnicorn.power = Math.min(100, randomUnicorn.power + 1);
        
        // Enhance phoenix abilities
        const randomPhoenix = this.phoenixes[Math.floor(Math.random() * this.phoenixes.length)];
        randomPhoenix.cycles++;
    }

    checkMasteryChallengeUnlocks() {
        this.masteryChallenges.forEach(challenge => {
            const requiredProgress = {
                'Ultimate Calculator': 0.6,
                'Infinity Solver': 0.7,
                'Rainbow Bridge Builder': 0.8,
                'Phoenix Rebirth': 0.9,
                'Unicorn Harmony': 1.0
            };
            
            const required = requiredProgress[challenge.name] || 0.8;
            const currentProgress = this.problemsSolved / this.totalProblems;
            
            if (currentProgress >= required && !challenge.unlocked) {
                challenge.unlocked = true;
                challenge.progress = Math.floor(currentProgress * 100);
                this.createChallengeUnlockEffect(challenge.x, challenge.y);
            }
        });
    }

    enhanceRainbowEffects() {
        // Create enhanced rainbow particles
        for (let i = 0; i < 10; i++) {
            const particle = {
                x: Math.random() * 1200,
                y: Math.random() * 800,
                vx: (Math.random() - 0.5) * 50,
                vy: (Math.random() - 0.5) * 50,
                color: ['#FF0000', '#FF8C00', '#FFD700', '#32CD32', '#4169E1', '#8A2BE2', '#9400D3'][this.currentRainbowPhase],
                life: 3000,
                size: Math.random() * 8 + 4,
                
                update: function(deltaTime) {
                    this.life -= deltaTime;
                    this.x += this.vx * deltaTime / 1000;
                    this.y += this.vy * deltaTime / 1000;
                    
                    if (this.x < 0 || this.x > 1200) this.vx *= -0.8;
                    if (this.y < 0 || this.y > 800) this.vy *= -0.8;
                    
                    if (this.life <= 0) this.isDead = true;
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.life / 3000;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(particle);
        }
    }

    createEncouragementEffect() {
        const encouragement = {
            x: 600,
            y: 400,
            messages: [
                "Mathematical mastery takes time! 🌟",
                "Every mistake is a step toward wisdom! 🦄",
                "The phoenixes believe in your potential! 🔥",
                "Rainbow knowledge flows through patience! 🌈",
                "Unlock the mysteries with persistence! 💎"
            ],
            currentMessage: 0,
            life: 4000,
            
            init: function() {
                this.currentMessage = Math.floor(Math.random() * this.messages.length);
            },
            
            update: function(deltaTime) {
                if (this.currentMessage === 0 && this.messages.length > 0) this.init();
                
                this.life -= deltaTime;
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4000;
                
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 200);
                gradient.addColorStop(0, 'rgba(255, 182, 193, 0.9)');
                gradient.addColorStop(1, 'rgba(221, 160, 221, 0.7)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#8B008B';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 200, this.y - 40, 400, 80, 25);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#4B0082';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.messages[this.currentMessage], this.x, this.y + 5);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(encouragement);
    }

    provideAdvancedHint() {
        if (this.hintActive) return;
        
        this.hintActive = true;
        const hint = this.mathEngine.getHint(this.currentProblem);
        
        const hintDisplay = {
            x: 600,
            y: 500,
            hint: hint,
            life: 6000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 6000);
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                const gradient = ctx.createLinearGradient(this.x, this.y - 50, this.x, this.y + 50);
                gradient.addColorStop(0, 'rgba(255, 255, 0, 0.9)');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0.8)');
                
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#FF8C00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 250, this.y - 50, 500, 100, 20);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#8B4513';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('🔮 Mystical Hint 🔮', this.x, this.y - 25);
                
                ctx.fillStyle = '#000080';
                ctx.font = '14px "Comic Sans MS", cursive';
                
                // Split hint into multiple lines if needed
                const words = this.hint.split(' ');
                let line = '';
                let lineY = this.y - 5;
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width > 450 && i > 0) {
                        ctx.fillText(line, this.x, lineY);
                        line = words[i] + ' ';
                        lineY += 18;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, this.x, lineY);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(hintDisplay);
    }

    completeHabitat() {
        this.isActive = false;
        
        // Create ultimate completion celebration
        this.createRainbowReserveCompletion();
        
        if (this.audioManager) {
            this.audioManager.playVoice('rainbow-reserve-complete');
            this.audioManager.playSFX('ultimate-victory');
        }
        
        // Unlock all mastery challenges
        this.masteryChallenges.forEach(challenge => {
            challenge.unlocked = true;
            challenge.progress = 100;
        });
        
        // Notify game controller
        setTimeout(() => {
            if (this.gameController) {
                this.gameController.onHabitatComplete('rainbowReserve', this.problemsSolved, this.totalProblems);
            }
        }, 6000);
    }

    createRainbowReserveCompletion() {
        const completion = {
            x: 600,
            y: 400,
            life: 8000,
            phase: 0,
            rainbowRings: [],
            
            init: function() {
                // Create expanding rainbow rings
                for (let i = 0; i < 10; i++) {
                    this.rainbowRings.push({
                        radius: 0,
                        maxRadius: 100 + i * 50,
                        color: ['#FF0000', '#FF8C00', '#FFD700', '#32CD32', '#4169E1', '#8A2BE2', '#9400D3', '#FF69B4', '#00FFFF', '#98FB98'][i],
                        delay: i * 200,
                        active: false
                    });
                }
            },
            
            update: function(deltaTime) {
                if (this.rainbowRings.length === 0) this.init();
                
                this.life -= deltaTime;
                this.phase += deltaTime;
                
                this.rainbowRings.forEach(ring => {
                    if (this.phase >= ring.delay && !ring.active) {
                        ring.active = true;
                    }
                    
                    if (ring.active) {
                        ring.radius = Math.min(ring.maxRadius, ring.radius + deltaTime / 20);
                    }
                });
                
                if (this.life <= 0) this.isDead = true;
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 8000;
                
                // Draw rainbow rings
                this.rainbowRings.forEach(ring => {
                    if (ring.active) {
                        ctx.strokeStyle = ring.color;
                        ctx.lineWidth = 6;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, ring.radius, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                });
                
                // Draw completion text
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#8B0000';
                ctx.lineWidth = 4;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('RAINBOW RESERVE', this.x, this.y - 50);
                ctx.fillText('RAINBOW RESERVE', this.x, this.y - 50);
                
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.strokeText('COMPLETED!', this.x, this.y);
                ctx.fillText('COMPLETED!', this.x, this.y);
                
                ctx.fillStyle = '#FF69B4';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillText('🌈 MATHEMATICAL MASTERY ACHIEVED! 🌈', this.x, this.y + 50);
                
                ctx.fillStyle = '#9370DB';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillText('All Domains Conquered • All Challenges Unlocked • Ultimate Wisdom Gained', this.x, this.y + 80);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(completion);
    }

    cleanup() {
        // Clear all timers
        if (this.nextProblemTimer) {
            clearTimeout(this.nextProblemTimer);
            this.nextProblemTimer = null;
        }
        
        // Remove all sprites
        [...this.unicorns, ...this.phoenixes, ...this.rainbowBridges, ...this.crystalPools,
         ...this.magicTrees, ...this.cloudCastles, ...this.rainbowRays, ...this.magicParticles,
         ...this.masteryChallenges].forEach(sprite => {
            if (sprite && this.gameEngine) {
                this.gameEngine.removeSprite(sprite);
            }
        });
        
        // Clear arrays
        this.unicorns = [];
        this.phoenixes = [];
        this.rainbowBridges = [];
        this.crystalPools = [];
        this.magicTrees = [];
        this.cloudCastles = [];
        this.rainbowRays = [];
        this.magicParticles = [];
        this.masteryChallenges = [];
        
        // Reset state
        this.isActive = false;
        this.currentProblem = null;
        this.celebrationActive = false;
        this.hintActive = false;
    }

    update(deltaTime) {
        // Rainbow Reserve continues to be magical even when not active
        if (!this.isActive) return;
        
        // Update current rainbow phase for effects
        this.currentRainbowPhase = (this.currentRainbowPhase + deltaTime / 10000) % 7;
    }
}
                