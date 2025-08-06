// Owl Observatory Habitat for Times Table Animals
// Tenth habitat focusing on advanced multiplication and patterns

class OwlObservatory {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 16;
        this.nextProblemTimer = null;
        
        // Habitat elements
        this.owls = [];
        this.telescopes = [];
        this.constellations = [];
        this.planets = [];
        this.moons = [];
        this.comets = [];
        this.observatory = null;
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Night sky environment
        this.stars = [];
        this.meteors = [];
        this.galaxies = [];
        this.nebulae = [];
        this.timeOfNight = 'midnight';
        this.moonPhase = 'full';
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('owlObservatory');
        this.gameEngine.setBackground('owlObservatory');
        
        // Create the night sky environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createOwlFamily();
        this.createObservatoryFeatures();
        this.createNightSkyEffects();
        this.addInteractiveElements();
    }

    createOwlFamily() {
        // Create owl family with different specialties
        const owlFamily = [
            { x: 200, y: 350, name: 'Professor Hoot', type: 'great_horned', specialty: 'multiplication_tables', wisdom: 95 },
            { x: 300, y: 320, name: 'Dr. Screech', type: 'barn_owl', specialty: 'pattern_recognition', wisdom: 88 },
            { x: 150, y: 280, name: 'Little Pip', type: 'owlet', specialty: 'counting_stars', wisdom: 45 },
            { x: 600, y: 300, name: 'Minerva', type: 'snowy_owl', specialty: 'advanced_algebra', wisdom: 92 },
            { x: 700, y: 380, name: 'Archimedes', type: 'tawny_owl', specialty: 'geometric_patterns', wisdom: 85 },
            { x: 550, y: 420, name: 'Owlbert', type: 'screech_owl', specialty: 'number_sequences', wisdom: 78 },
            { x: 900, y: 290, name: 'Sage', type: 'great_horned', specialty: 'mathematical_proofs', wisdom: 98 },
            { x: 800, y: 360, name: 'Luna', type: 'barn_owl', specialty: 'celestial_calculations', wisdom: 90 },
            { x: 400, y: 250, name: 'Castor', type: 'long_eared', specialty: 'prime_numbers', wisdom: 82 },
            { x: 500, y: 330, name: 'Pollux', type: 'long_eared', specialty: 'factor_analysis', wisdom: 80 },
            { x: 750, y: 450, name: 'Twit', type: 'owlet', specialty: 'basic_patterns', wisdom: 38 },
            { x: 350, y: 390, name: 'Twoo', type: 'owlet', specialty: 'multiplication_facts', wisdom: 42 },
            { x: 650, y: 280, name: 'Athena', type: 'snowy_owl', specialty: 'advanced_patterns', wisdom: 94 },
            { x: 450, y: 480, name: 'Hedwig', type: 'snowy_owl', specialty: 'magic_squares', wisdom: 87 },
            { x: 850, y: 420, name: 'Errol', type: 'tawny_owl', specialty: 'fibonacci_sequences', wisdom: 75 },
            { x: 100, y: 400, name: 'Pigwidgeon', type: 'screech_owl', specialty: 'times_table_tricks', wisdom: 68 }
        ];

        owlFamily.forEach((member, index) => {
            const owl = this.gameEngine.createSprite('penguin', member.x, member.y); // Using penguin sprite as owl
            owl.name = member.name;
            owl.type = member.type;
            owl.specialty = member.specialty;
            owl.wisdom = member.wisdom;
            owl.id = `owl_${index}`;
            owl.isFlying = false;
            owl.flyCooldown = Math.random() * 12000 + 8000;
            owl.originalX = member.x;
            owl.originalY = member.y;
            owl.headRotation = 0;
            owl.eyeBlink = 0;
            owl.knowledgeShared = 0;
            
            // Type-based characteristics
            switch (member.type) {
                case 'great_horned':
                    owl.width = 70;
                    owl.height = 80;
                    owl.tintColor = '#8B4513';
                    owl.flightSpeed = 40;
                    break;
                case 'barn_owl':
                    owl.width = 60;
                    owl.height = 70;
                    owl.tintColor = '#F5DEB3';
                    owl.flightSpeed = 50;
                    break;
                case 'snowy_owl':
                    owl.width = 75;
                    owl.height = 85;
                    owl.tintColor = '#FFFAFA';
                    owl.flightSpeed = 35;
                    break;
                case 'tawny_owl':
                    owl.width = 55;
                    owl.height = 65;
                    owl.tintColor = '#D2691E';
                    owl.flightSpeed = 45;
                    break;
                case 'long_eared':
                    owl.width = 50;
                    owl.height = 75;
                    owl.tintColor = '#CD853F';
                    owl.flightSpeed = 48;
                    break;
                case 'screech_owl':
                    owl.width = 45;
                    owl.height = 55;
                    owl.tintColor = '#A0522D';
                    owl.flightSpeed = 55;
                    break;
                case 'owlet':
                    owl.width = 35;
                    owl.height = 40;
                    owl.tintColor = '#DEB887';
                    owl.flightSpeed = 30;
                    owl.flyCooldown *= 0.5; // Young owls are more active
                    break;
            }
            
            // Add owl behavior
            owl.update = (deltaTime) => {
                this.updateOwl(owl, deltaTime);
            };
            
            owl.onClick = () => {
                this.onOwlClick(owl);
            };
            
            this.owls.push(owl);
            this.gameEngine.addSprite(owl);
        });
    }

    updateOwl(owl, deltaTime) {
        // Handle flight animation
        owl.flyCooldown -= deltaTime;
        
        if (owl.flyCooldown <= 0 && !owl.isFlying) {
            owl.isFlying = true;
            owl.flyCooldown = Math.random() * 15000 + 10000;
            if (owl.type === 'owlet') owl.flyCooldown *= 0.5;
            
            owl.flyAnimationTime = 0;
            owl.flyDirection = Math.random() * Math.PI * 2;
            owl.flyDistance = Math.random() * 100 + 60;
        }
        
        if (owl.isFlying) {
            owl.flyAnimationTime += deltaTime;
            const flyProgress = owl.flyAnimationTime / 5000; // 5 second flight
            
            if (flyProgress <= 1) {
                // Silent owl flight motion
                const flyX = Math.sin(flyProgress * Math.PI) * owl.flyDistance * Math.cos(owl.flyDirection);
                const flyY = Math.sin(flyProgress * Math.PI) * owl.flyDistance * 0.4 * Math.sin(owl.flyDirection);
                
                owl.x = owl.originalX + flyX;
                owl.y = owl.originalY + flyY;
                
                // Add gentle wing flapping
                const wingFlap = Math.sin(flyProgress * Math.PI * 12) * 2;
                owl.y += wingFlap;
                
                // Keep owls in observatory bounds
                owl.x = Math.max(50, Math.min(1150, owl.x));
                owl.y = Math.max(200, Math.min(700, owl.y));
            } else {
                owl.isFlying = false;
                owl.x = owl.originalX;
                owl.y = owl.originalY;
            }
        }
        
        // Update head rotation (owls can rotate heads 270 degrees)
        owl.headRotation = Math.sin(Date.now() / 4000 + owl.id) * 0.7;
        
        // Update eye blinking
        if (Math.random() < 0.002) {
            owl.eyeBlink = 300; // Blink duration
        }
        if (owl.eyeBlink > 0) {
            owl.eyeBlink -= deltaTime;
        }
    }

    onOwlClick(owl) {
        if (this.audioManager) {
            this.audioManager.playSFX('owl-hoot');
        }
        
        // Make owl fly
        owl.isFlying = true;
        owl.flyAnimationTime = 0;
        
        // Show owl knowledge
        this.showOwlKnowledge(owl);
        
        // Specialty-based actions
        switch (owl.specialty) {
            case 'multiplication_tables':
                this.createMultiplicationTable(owl.x, owl.y);
                break;
            case 'pattern_recognition':
                this.createPatternSequence(owl.x, owl.y);
                break;
            case 'counting_stars':
                this.createStarCounting(owl.x, owl.y);
                break;
            case 'advanced_algebra':
                this.createAlgebraExample(owl.x, owl.y);
                break;
            case 'geometric_patterns':
                this.createGeometricPattern(owl.x, owl.y);
                break;
            case 'number_sequences':
                this.createNumberSequence(owl.x, owl.y);
                break;
            case 'mathematical_proofs':
                this.createMathProof(owl.x, owl.y);
                break;
            case 'celestial_calculations':
                this.createCelestialMath(owl.x, owl.y);
                break;
        }
        
        // Increase wisdom sharing
        owl.knowledgeShared = Math.min(100, owl.knowledgeShared + 10);
    }

    showOwlKnowledge(owl) {
        const knowledgeSprite = {
            x: owl.x + 90,
            y: owl.y - 120,
            text: `${owl.name}\n${owl.type}\n${owl.specialty}\n🧠 Wisdom: ${owl.wisdom}%\n📚 Shared: ${owl.knowledgeShared}%`,
            life: 5000,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 5000);
                this.y -= deltaTime / 100;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw knowledge bubble
                ctx.fillStyle = 'rgba(25, 25, 112, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 70, 160, 140, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '13px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 55 + index * 18);
                });
                
                // Draw owl silhouette
                ctx.fillStyle = '#FFD700';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillText('🦉', this.x, this.y + 50);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(knowledgeSprite);
    }

    createMultiplicationTable(x, y) {
        const table = {
            x: x,
            y: y - 60,
            life: 4000,
            tableNumber: Math.floor(Math.random() * 9) + 2, // 2-10 times table
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4000;
                
                // Draw table background
                ctx.fillStyle = 'rgba(25, 25, 112, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 60, this.y - 60, 120, 120, 10);
                ctx.fill();
                ctx.stroke();
                
                // Draw multiplication table
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '11px "Comic Sans MS", cursive';
                ctx.textAlign = 'left';
                
                for (let i = 1; i <= 5; i++) {
                    const result = this.tableNumber * i;
                    const text = `${this.tableNumber} × ${i} = ${result}`;
                    ctx.fillText(text, this.x - 50, this.y - 40 + (i * 15));
                }
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '13px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`${this.tableNumber}× Table`, this.x, this.y + 45);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(table);
    }

    createPatternSequence(x, y) {
        const patterns = [
            [2, 4, 8, 16, 32], // Powers of 2
            [1, 3, 9, 27, 81], // Powers of 3
            [5, 10, 20, 40, 80], // Multiply by 2, start with 5
            [3, 6, 12, 24, 48], // Multiply by 2, start with 3
            [1, 4, 16, 64, 256] // Powers of 4
        ];
        
        const sequence = {
            x: x,
            y: y - 40,
            life: 4500,
            pattern: patterns[Math.floor(Math.random() * patterns.length)],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4500;
                
                // Draw pattern background
                ctx.fillStyle = 'rgba(72, 61, 139, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 30, 200, 60, 12);
                ctx.fill();
                ctx.stroke();
                
                // Draw pattern sequence
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const patternText = this.pattern.join(', ') + ', ?';
                ctx.fillText(patternText, this.x, this.y - 5);
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Find the Pattern!', this.x, this.y + 20);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(sequence);
    }

    createStarCounting(x, y) {
        const starCount = {
            x: x,
            y: y - 50,
            life: 3500,
            stars: Math.floor(Math.random() * 20) + 5,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3500;
                
                // Draw star field
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 80, this.y - 40, 160, 80, 10);
                ctx.fill();
                ctx.stroke();
                
                // Draw stars
                ctx.fillStyle = '#FFFF00';
                ctx.font = '12px "Comic Sans MS", cursive';
                
                for (let i = 0; i < this.stars; i++) {
                    const angle = (i / this.stars) * Math.PI * 2;
                    const radius = 25 + (i % 3) * 10;
                    const starX = this.x + Math.cos(angle) * radius;
                    const starY = this.y + Math.sin(angle) * radius;
                    
                    if (starX > this.x - 75 && starX < this.x + 75 && 
                        starY > this.y - 35 && starY < this.y + 35) {
                        ctx.fillText('⭐', starX, starY);
                    }
                }
                
                // Show count
                ctx.fillStyle = '#FFD700';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`Count: ${this.stars} stars`, this.x, this.y + 50);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(starCount);
    }

    createAlgebraExample(x, y) {
        const equations = [
            'x × 4 = 20',
            '3 × y = 15',
            'z ÷ 2 = 8',
            'a + a = 12',
            'b × b = 25'
        ];
        
        const algebra = {
            x: x,
            y: y - 30,
            life: 4000,
            equation: equations[Math.floor(Math.random() * equations.length)],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4000;
                
                // Draw algebra background
                ctx.fillStyle = 'rgba(25, 25, 112, 0.8)';
                ctx.strokeStyle = '#9370DB';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 25, 140, 50, 12);
                ctx.fill();
                ctx.stroke();
                
                // Draw equation
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.equation, this.x, this.y);
                
                ctx.fillStyle = '#9370DB';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Solve for the variable!', this.x, this.y + 35);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(algebra);
    }

    createGeometricPattern(x, y) {
        const pattern = {
            x: x,
            y: y - 40,
            life: 4000,
            shapeCount: Math.floor(Math.random() * 3) + 3,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4000;
                
                // Draw pattern background
                ctx.fillStyle = 'rgba(72, 61, 139, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 90, this.y - 35, 180, 70, 10);
                ctx.fill();
                ctx.stroke();
                
                // Draw geometric shapes in pattern
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                
                for (let i = 0; i < this.shapeCount; i++) {
                    const shapeX = this.x - 60 + (i * 30);
                    const shapeY = this.y;
                    const size = 8 + (i * 2);
                    
                    if (i % 3 === 0) {
                        // Triangle
                        ctx.beginPath();
                        ctx.moveTo(shapeX, shapeY - size);
                        ctx.lineTo(shapeX - size, shapeY + size);
                        ctx.lineTo(shapeX + size, shapeY + size);
                        ctx.closePath();
                        ctx.stroke();
                    } else if (i % 3 === 1) {
                        // Square
                        ctx.strokeRect(shapeX - size, shapeY - size, size * 2, size * 2);
                    } else {
                        // Circle
                        ctx.beginPath();
                        ctx.arc(shapeX, shapeY, size, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Geometric Pattern', this.x, this.y + 45);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(pattern);
    }

    createNumberSequence(x, y) {
        const sequences = [
            { seq: [2, 4, 6, 8, 10], rule: '+2' },
            { seq: [5, 10, 15, 20, 25], rule: '+5' },
            { seq: [1, 2, 4, 8, 16], rule: '×2' },
            { seq: [100, 90, 80, 70, 60], rule: '-10' },
            { seq: [3, 6, 9, 12, 15], rule: '+3' }
        ];
        
        const sequence = {
            x: x,
            y: y - 35,
            life: 4200,
            data: sequences[Math.floor(Math.random() * sequences.length)],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4200;
                
                // Draw sequence background
                ctx.fillStyle = 'rgba(25, 25, 112, 0.8)';
                ctx.strokeStyle = '#32CD32';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 30, 200, 60, 12);
                ctx.fill();
                ctx.stroke();
                
                // Draw sequence
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.data.seq.join(', '), this.x, this.y - 5);
                
                ctx.fillStyle = '#32CD32';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText(`Rule: ${this.data.rule}`, this.x, this.y + 20);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(sequence);
    }

    createMathProof(x, y) {
        const proofs = [
            'If a = b and b = c, then a = c',
            '(a + b)² = a² + 2ab + b²',
            'a × 0 = 0 for any number a',
            'If x × y = 0, then x = 0 or y = 0'
        ];
        
        const proof = {
            x: x,
            y: y - 40,
            life: 5000,
            text: proofs[Math.floor(Math.random() * proofs.length)],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 5000;
                
                // Draw proof background
                ctx.fillStyle = 'rgba(72, 61, 139, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 120, this.y - 35, 240, 70, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw proof text
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '13px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                // Word wrap the proof
                const words = this.text.split(' ');
                let line = '';
                let y = this.y - 15;
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width > 220 && i > 0) {
                        ctx.fillText(line, this.x, y);
                        line = words[i] + ' ';
                        y += 16;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, this.x, y);
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '11px "Comic Sans MS", cursive';
                ctx.fillText('Mathematical Proof', this.x, this.y + 40);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(proof);
    }

    createCelestialMath(x, y) {
        const calculations = [
            'Moon orbit: 384,400 km',
            'Light speed: 299,792,458 m/s',
            'Earth diameter: 12,742 km',
            'Mars distance: 225M km',
            'Sun mass: 1.989 × 10³⁰ kg'
        ];
        
        const celestial = {
            x: x,
            y: y - 45,
            life: 4500,
            calculation: calculations[Math.floor(Math.random() * calculations.length)],
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 4500;
                
                // Draw celestial background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 110, this.y - 40, 220, 80, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw stars around the calculation
                ctx.fillStyle = '#FFFF00';
                ctx.font = '8px "Comic Sans MS", cursive';
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const starX = this.x + Math.cos(angle) * 90;
                    const starY = this.y + Math.sin(angle) * 30;
                    ctx.fillText('✦', starX, starY);
                }
                
                // Draw calculation
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.calculation, this.x, this.y);
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Celestial Mathematics', this.x, this.y + 25);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celestial);
    }

    createObservatoryFeatures() {
        // Create the main observatory building
        this.observatory = {
            x: 600,
            y: 600,
            width: 200,
            height: 150,
            domeRotation: 0,
            
            update: function(deltaTime) {
                this.domeRotation += deltaTime / 5000; // Slow rotation
            },
            
            onClick: () => {
                this.onObservatoryClick();
            },
            
            render: function(ctx) {
                // Draw observatory base
                ctx.fillStyle = '#696969';
                ctx.strokeStyle = '#2F4F4F';
                ctx.lineWidth = 3;
                ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
                ctx.strokeRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
                
                // Draw dome
                ctx.save();
                ctx.translate(this.x, this.y - this.height/2);
                ctx.rotate(this.domeRotation);
                
                ctx.fillStyle = '#4682B4';
                ctx.beginPath();
                ctx.arc(0, 0, this.width/2, Math.PI, 0);
                ctx.fill();
                ctx.stroke();
                
                // Draw dome opening
                ctx.fillStyle = '#000000';
                ctx.fillRect(-15, -this.width/2, 30, 20);
                
                ctx.restore();
                
                // Draw windows
                ctx.fillStyle = '#FFFF00';
                for (let i = 0; i < 4; i++) {
                    const windowX = this.x - 60 + (i * 40);
                    const windowY = this.y - 20;
                    ctx.fillRect(windowX, windowY, 20, 30);
                }
                
                // Draw entrance
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x - 15, this.y + this.height/2 - 40, 30, 40);
                
                // Add observatory label
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Owl Observatory', this.x, this.y + this.height/2 + 30);
            }
        };
        
        this.gameEngine.addSprite(this.observatory);

        // Create telescopes
        const telescopePositions = [
            { x: 150, y: 500, type: 'refracting', magnification: 50 },
            { x: 400, y: 480, type: 'reflecting', magnification: 100 },
            { x: 800, y: 510, type: 'radio', magnification: 200 },
            { x: 1050, y: 490, type: 'space', magnification: 500 }
        ];

        telescopePositions.forEach(pos => {
            const telescope = {
                x: pos.x,
                y: pos.y,
                type: pos.type,
                magnification: pos.magnification,
                angle: Math.random() * Math.PI / 4 - Math.PI / 8, // Random pointing angle
                
                onClick: () => {
                    this.onTelescopeClick(telescope);
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    
                    // Draw telescope tube
                    ctx.fillStyle = '#2F4F4F';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 2;
                    ctx.fillRect(-50, -8, 100, 16);
                    ctx.strokeRect(-50, -8, 100, 16);
                    
                    // Draw eyepiece
                    ctx.fillStyle = '#4682B4';
                    ctx.beginPath();
                    ctx.arc(-50, 0, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw objective lens
                    ctx.fillStyle = '#87CEEB';
                    ctx.beginPath();
                    ctx.arc(50, 0, 12, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    ctx.restore();
                    
                    // Draw telescope info
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '11px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.magnification}× ${this.type}`, this.x, this.y + 35);
                }
            };
            
            this.telescopes.push(telescope);
            this.gameEngine.addSprite(telescope);
        });

        // Create constellation patterns
        const constellationData = [
            { 
                name: 'Big Dipper', 
                stars: [
                    {x: 200, y: 150}, {x: 220, y: 140}, {x: 240, y: 145}, {x: 260, y: 155},
                    {x: 280, y: 160}, {x: 270, y: 180}, {x: 250, y: 190}
                ],
                pattern: 'multiplication'
            },
            { 
                name: 'Orion', 
                stars: [
                    {x: 500, y: 120}, {x: 520, y: 110}, {x: 480, y: 140}, {x: 510, y: 150},
                    {x: 490, y: 170}, {x: 530, y: 160}, {x: 505, y: 180}
                ],
                pattern: 'factors'
            },
            { 
                name: 'Cassiopeia', 
                stars: [
                    {x: 800, y: 130}, {x: 820, y: 120}, {x: 840, y: 135}, {x: 860, y: 125}, {x: 880, y: 140}
                ],
                pattern: 'sequence'
            }
        ];

        constellationData.forEach(data => {
            const constellation = {
                name: data.name,
                stars: data.stars,
                pattern: data.pattern,
                isRevealed: false,
                
                onClick: () => {
                    this.onConstellationClick(constellation);
                },
                
                render: function(ctx) {
                    // Draw stars
                    ctx.fillStyle = this.isRevealed ? '#FFFF00' : '#FFFFFF';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    
                    this.stars.forEach(star => {
                        ctx.fillText('⭐', star.x, star.y);
                    });
                    
                    // Draw constellation lines if revealed
                    if (this.isRevealed) {
                        ctx.strokeStyle = '#FFD700';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        
                        for (let i = 0; i < this.stars.length - 1; i++) {
                            const star1 = this.stars[i];
                            const star2 = this.stars[i + 1];
                            
                            if (i === 0) ctx.moveTo(star1.x, star1.y);
                            ctx.lineTo(star2.x, star2.y);
                        }
                        ctx.stroke();
                        
                        // Draw constellation name
                        const centerX = this.stars.reduce((sum, star) => sum + star.x, 0) / this.stars.length;
                        const centerY = this.stars.reduce((sum, star) => sum + star.y, 0) / this.stars.length;
                        
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '14px "Comic Sans MS", cursive';
                        ctx.fillText(this.name, centerX, centerY + 40);
                        ctx.fillText(`Pattern: ${this.pattern}`, centerX, centerY + 55);
                    }
                }
            };
            
            this.constellations.push(constellation);
            this.gameEngine.addSprite(constellation);
        });
    }

    createNightSkyEffects() {
        // Create starfield
        for (let i = 0; i < 100; i++) {
            const star = {
                x: Math.random() * 1200,
                y: Math.random() * 400 + 50,
                brightness: Math.random() * 0.8 + 0.2,
                twinkleTime: Math.random() * 3000,
                size: Math.random() * 2 + 1,
                
                update: function(deltaTime) {
                    this.twinkleTime += deltaTime;
                    this.brightness = 0.5 + Math.sin(this.twinkleTime / 1000) * 0.3;
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.brightness;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            };
            
            this.stars.push(star);
            this.gameEngine.addSprite(star);
        }

        // Create shooting stars/meteors
        for (let i = 0; i < 3; i++) {
            const meteor = {
                x: -50,
                y: Math.random() * 300 + 100,
                speed: Math.random() * 200 + 100,
                trail: [],
                trailLength: 20,
                life: Math.random() * 10000 + 5000,
                
                update: function(deltaTime) {
                    this.life -= deltaTime;
                    this.x += this.speed * deltaTime / 1000;
                    this.y += this.speed * 0.3 * deltaTime / 1000;
                    
                    // Add to trail
                    this.trail.push({x: this.x, y: this.y});
                    if (this.trail.length > this.trailLength) {
                        this.trail.shift();
                    }
                    
                    // Reset if off screen or life expired
                    if (this.x > 1300 || this.life <= 0) {
                        this.x = -50;
                        this.y = Math.random() * 300 + 100;
                        this.life = Math.random() * 10000 + 5000;
                        this.trail = [];
                    }
                },
                
                render: function(ctx) {
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2;
                    
                    // Draw trail
                    for (let j = 0; j < this.trail.length - 1; j++) {
                        const alpha = j / this.trail.length;
                        ctx.save();
                        ctx.globalAlpha = alpha;
                        ctx.beginPath();
                        ctx.moveTo(this.trail[j].x, this.trail[j].y);
                        ctx.lineTo(this.trail[j + 1].x, this.trail[j + 1].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                    
                    // Draw meteor head
                    ctx.fillStyle = '#FFFF00';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            this.meteors.push(meteor);
            this.gameEngine.addSprite(meteor);
        }

        // Create galaxies (background spiral patterns)
        for (let i = 0; i < 2; i++) {
            const galaxy = {
                x: Math.random() * 1200,
                y: Math.random() * 200 + 100,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: 0.0001 + Math.random() * 0.0002,
                size: Math.random() * 40 + 60,
                
                update: function(deltaTime) {
                    this.rotation += this.rotationSpeed * deltaTime;
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.globalAlpha = 0.3;
                    
                    // Draw spiral arms
                    ctx.strokeStyle = '#9370DB';
                    ctx.lineWidth = 2;
                    
                    for (let arm = 0; arm < 2; arm++) {
                        ctx.beginPath();
                        for (let t = 0; t < Math.PI * 4; t += 0.1) {
                            const r = t * 3;
                            const x = Math.cos(t + arm * Math.PI) * r;
                            const y = Math.sin(t + arm * Math.PI) * r;
                            
                            if (r < this.size) {
                                if (t === 0) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                        }
                        ctx.stroke();
                    }
                    
                    // Draw central bulge
                    ctx.fillStyle = '#FFD700';
                    ctx.globalAlpha = 0.4;
                    ctx.beginPath();
                    ctx.arc(0, 0, 8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            };
            
            this.galaxies.push(galaxy);
            this.gameEngine.addSprite(galaxy);
        }
    }

    addInteractiveElements() {
        // Create pattern recognition challenges
        this.createPatternChallenges();
        
        // Create multiplication mastery stations
        this.createMultiplicationStations();
    }

    createPatternChallenges() {
        const challenges = [
            { 
                x: 300, y: 720, 
                pattern: [2, 4, 8, 16, '?'],
                answer: 32,
                rule: 'multiply by 2'
            },
            { 
                x: 600, y: 740, 
                pattern: [1, 1, 2, 3, 5, '?'],
                answer: 8,
                rule: 'Fibonacci sequence'
            },
            { 
                x: 900, y: 730, 
                pattern: [1, 4, 9, 16, '?'],
                answer: 25,
                rule: 'perfect squares'
            }
        ];

        challenges.forEach(challenge => {
            const patternChallenge = {
                x: challenge.x,
                y: challenge.y,
                pattern: challenge.pattern,
                answer: challenge.answer,
                rule: challenge.rule,
                isSolved: false,
                
                onClick: () => {
                    this.onPatternChallengeClick(patternChallenge);
                },
                
                render: function(ctx) {
                    // Draw challenge platform
                    ctx.fillStyle = this.isSolved ? '#90EE90' : '#483D8B';
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 80, this.y - 30, 160, 60, 15);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw pattern
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.pattern.join(', '), this.x, this.y - 5);
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '14px "Comic Sans MS", cursive';
                        ctx.fillText(`Answer: ${this.answer}`, this.x, this.y + 15);
                        ctx.font = '10px "Comic Sans MS", cursive';
                        ctx.fillText(this.rule, this.x, this.y + 35);
                    } else {
                        ctx.fillStyle = '#CCCCCC';
                        ctx.font = '11px "Comic Sans MS", cursive';
                        ctx.fillText('Find the pattern!', this.x, this.y + 20);
                    }
                }
            };
            
            this.gameEngine.addSprite(patternChallenge);
        });
    }

    createMultiplicationStations() {
        const stations = [
            { x: 200, y: 650, table: 7, mastery: 0 },
            { x: 500, y: 670, table: 8, mastery: 0 },
            { x: 800, y: 660, table: 9, mastery: 0 },
            { x: 1100, y: 680, table: 12, mastery: 0 }
        ];

        stations.forEach(station => {
            const multiStation = {
                x: station.x,
                y: station.y,
                table: station.table,
                mastery: station.mastery,
                maxMastery: 10,
                
                onClick: () => {
                    this.onMultiplicationStationClick(multiStation);
                },
                
                render: function(ctx) {
                    // Draw station platform
                    const masteryPercent = this.mastery / this.maxMastery;
                    ctx.fillStyle = masteryPercent >= 1 ? '#32CD32' : 
                                   masteryPercent >= 0.7 ? '#FFD700' : '#FF6347';
                    ctx.strokeStyle = '#000080';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 50, this.y - 25, 100, 50, 12);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw times table
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.table}× Table`, this.x, this.y - 2);
                    
                    // Draw mastery progress
                    ctx.fillStyle = '#000080';
                    ctx.font = '11px "Comic Sans MS", cursive';
                    ctx.fillText(`${this.mastery}/${this.maxMastery}`, this.x, this.y + 15);
                    
                    // Draw progress bar
                    ctx.strokeStyle = '#000080';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(this.x - 40, this.y + 20, 80, 8);
                    
                    ctx.fillStyle = '#32CD32';
                    const progressWidth = 80 * masteryPercent;
                    ctx.fillRect(this.x - 40, this.y + 20, progressWidth, 8);
                }
            };
            
            this.gameEngine.addSprite(multiStation);
        });
    }

    onObservatoryClick() {
        if (this.audioManager) {
            this.audioManager.playSFX('telescope-focus');
        }
        
        this.showObservatoryInfo();
    }

    onTelescopeClick(telescope) {
        if (this.audioManager) {
            this.audioManager.playSFX('telescope-view');
        }
        
        this.showTelescopeView(telescope);
    }

    onConstellationClick(constellation) {
        if (this.audioManager) {
            this.audioManager.playSFX('constellation-reveal');
        }
        
        constellation.isRevealed = !constellation.isRevealed;
    }

    onPatternChallengeClick(challenge) {
        if (this.audioManager) {
            this.audioManager.playSFX(challenge.isSolved ? 'already-solved' : 'pattern-solve');
        }
        
        if (!challenge.isSolved) {
            this.showPatternSolution(challenge);
        }
    }

    onMultiplicationStationClick(station) {
        if (this.audioManager) {
            this.audioManager.playSFX('times-table-practice');
        }
        
        station.mastery = Math.min(station.maxMastery, station.mastery + 1);
        this.showMultiplicationPractice(station);
    }

    showObservatoryInfo() {
        const info = {
            x: 600,
            y: 450,
            text: 'Owl Observatory\nWhere mathematical wisdom\nmeets celestial wonder!\nStudy patterns in the stars!',
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
                
                ctx.fillStyle = 'rgba(25, 25, 112, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 120, this.y - 50, 240, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '13px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 35 + index * 16);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(info);
    }

    showTelescopeView(telescope) {
        const view = {
            x: telescope.x,
            y: telescope.y - 80,
            telescope: telescope,
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
                
                // Draw telescope view circle
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 50, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Draw viewed object based on telescope type
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                switch (this.telescope.type) {
                    case 'refracting':
                        ctx.fillText('🌙', this.x, this.y + 5);
                        break;
                    case 'reflecting':
                        ctx.fillText('🪐', this.x, this.y + 5);
                        break;
                    case 'radio':
                        ctx.fillText('📡', this.x, this.y + 5);
                        break;
                    case 'space':
                        ctx.fillText('🌌', this.x, this.y + 5);
                        break;
                }
                
                // Show magnification
                ctx.fillStyle = '#FFD700';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText(`${this.telescope.magnification}× zoom`, this.x, this.y + 70);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(view);
    }

    showPatternSolution(challenge) {
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
                
                ctx.fillStyle = 'rgba(72, 61, 139, 0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 100, this.y - 40, 200, 80, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`Pattern: ${this.challenge.rule}`, this.x, this.y - 15);
                ctx.fillText(`Answer: ${this.challenge.answer}`, this.x, this.y + 5);
                
                ctx.fillStyle = '#FFD700';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Pattern Solved!', this.x, this.y + 25);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(solution);
        challenge.isSolved = true;
    }

    showMultiplicationPractice(station) {
        const practice = {
            x: station.x,
            y: station.y - 60,
            station: station,
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
                
                ctx.fillStyle = 'rgba(25, 25, 112, 0.8)';
                ctx.strokeStyle = '#32CD32';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 35, 140, 70, 12);
                ctx.fill();
                ctx.stroke();
                
                // Show a random multiplication from the table
                const multiplier = Math.floor(Math.random() * 12) + 1;
                const result = this.station.table * multiplier;
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(`${this.station.table} × ${multiplier} = ${result}`, this.x, this.y - 5);
                
                ctx.fillStyle = '#32CD32';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.fillText('Practice Complete!', this.x, this.y + 20);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(practice);
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
        if (this.currentProblem.type === 'advanced_multiplication') {
            this.addAdvancedMultiplicationVisuals();
        } else if (this.currentProblem.type === 'patterns') {
            this.addPatternVisuals();
        }
    }

    addAdvancedMultiplicationVisuals() {
        // Create advanced multiplication visualization
        this.createAdvancedMultiplicationWorkspace(500, 120);
    }

    addPatternVisuals() {
        // Create pattern visualization
        this.createPatternWorkspace(450, 100);
    }

    createAdvancedMultiplicationWorkspace(x, y) {
        const workspace = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw workspace
                ctx.fillStyle = 'rgba(25, 25, 112, 0.8)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 140, this.y - 50, 280, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw multiplication symbols
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText('× ÷ ²', this.x, this.y - 10);
                
                // Draw helper text
                ctx.fillStyle = '#FFD700';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Advanced Multiplication!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(workspace);
    }

    createPatternWorkspace(x, y) {
        const workspace = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw workspace
                ctx.fillStyle = 'rgba(72, 61, 139, 0.8)';
                ctx.strokeStyle = '#9370DB';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 140, this.y - 50, 280, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw pattern symbols
                ctx.font = '28px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText('🔢 🔍 📊', this.x, this.y - 5);
                
                // Draw helper text
                ctx.fillStyle = '#9370DB';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Find the pattern!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(workspace);
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`OwlObservatory: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
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
        console.log(`Owl Observatory: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
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
        
        // Make all owls fly
        this.owls.forEach(owl => {
            owl.isFlying = true;
            owl.flyAnimationTime = 0;
            owl.knowledgeShared = Math.min(100, owl.knowledgeShared + 15);
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around owls
        this.owls.forEach(owl => {
            this.gameEngine.createCelebrationParticles(owl.x, owl.y);
        });
        
        // Create observatory celebration
        this.createObservatoryCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createObservatoryCelebration() {
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
                ctx.strokeText('WISE SUCCESS!', this.x, this.y);
                ctx.fillText('WISE SUCCESS!', this.x, this.y);
                
                // Draw wise owls
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🦉⭐🦉', this.x, this.y + 60);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebration);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with wise owl
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
                ctx.fillStyle = 'rgba(25, 25, 112, 0.95)';
                ctx.strokeStyle = '#FFD700';
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
            text: 'Owl Observatory Complete!',
            subtext: 'You mastered advanced multiplication and patterns! The owls are impressed!',
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
                
                // Draw celebration owls
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🦉🌟🦉', this.x, this.y + 120);
                
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
        console.log('Owl Observatory completed! Returning to habitat selection...');
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
        this.owls.forEach(owl => {
            if (owl.update) {
                owl.update(deltaTime);
            }
        });
        
        // Update stars
        this.stars.forEach(star => {
            if (star.update) {
                star.update(deltaTime);
            }
        });
        
        // Update meteors
        this.meteors.forEach(meteor => {
            if (meteor.update) {
                meteor.update(deltaTime);
            }
        });
        
        // Update galaxies
        this.galaxies.forEach(galaxy => {
            if (galaxy.update) {
                galaxy.update(deltaTime);
            }
        });
        
        // Update observatory
        if (this.observatory && this.observatory.update) {
            this.observatory.update(deltaTime);
        }
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 180000) { // 3 minute timeout for advanced problems
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
        this.owls = [];
        this.telescopes = [];
        this.constellations = [];
        this.planets = [];
        this.moons = [];
        this.comets = [];
        this.observatory = null;
        this.stars = [];
        this.meteors = [];
        this.galaxies = [];
        this.nebulae = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OwlObservatory;
}