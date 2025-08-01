// Giraffe Plains Habitat for Times Table Animals
// Ninth habitat focusing on measurement and geometry

class GiraffePlains {
    constructor(gameEngine, mathEngine, gameController = null) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.gameController = gameController;
        this.audioManager = null;
        this.isActive = false;
        this.currentProblem = null;
        this.problemsSolved = 0;
        this.totalProblems = 13;
        this.nextProblemTimer = null;
        
        // Habitat elements
        this.giraffes = [];
        this.zebras = [];
        this.elephants = [];
        this.lions = [];
        this.acaciaTrees = [];
        this.rocks = [];
        this.wateringHoles = [];
        
        // Animation states
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;
        
        // Savanna environment
        this.grassPatches = [];
        this.clouds = [];
        this.birds = [];
        this.butterflies = [];
        this.sunPosition = { x: 1000, y: 150 };
        this.timeOfDay = 'morning';
        
        this.init();
    }

    init() {
        // Set up the habitat
        this.mathEngine.setHabitat('giraffePlains');
        this.gameEngine.setBackground('giraffePlains');
        
        // Create the savanna environment
        this.createEnvironment();
        
        // Start with first problem
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createGiraffeHerd();
        this.createSavannaFeatures();
        this.createSavannaEffects();
        this.addInteractiveElements();
    }

    createGiraffeHerd() {
        // Create giraffe herd with different heights and characteristics
        const giraffeHerd = [
            { x: 200, y: 300, name: 'Stretch', height: 5.5, age: 'adult', pattern: 'large_spots' },
            { x: 300, y: 320, name: 'Tallulah', height: 5.2, age: 'adult', pattern: 'medium_spots' },
            { x: 150, y: 380, name: 'Little Neck', height: 2.8, age: 'young', pattern: 'small_spots' },
            { x: 600, y: 280, name: 'Geoffrey', height: 5.8, age: 'adult', pattern: 'large_spots' },
            { x: 700, y: 350, name: 'Gigi', height: 4.9, age: 'adult', pattern: 'medium_spots' },
            { x: 550, y: 400, name: 'Junior', height: 3.2, age: 'young', pattern: 'small_spots' },
            { x: 900, y: 290, name: 'Goliath', height: 6.1, age: 'elder', pattern: 'faded_spots' },
            { x: 800, y: 370, name: 'Grace', height: 5.0, age: 'adult', pattern: 'heart_spots' },
            { x: 400, y: 250, name: 'Gwendolyn', height: 5.4, age: 'adult', pattern: 'star_spots' },
            { x: 500, y: 330, name: 'Gatsby', height: 4.7, age: 'adult', pattern: 'circle_spots' },
            { x: 750, y: 420, name: 'Gemma', height: 3.5, age: 'young', pattern: 'tiny_spots' },
            { x: 350, y: 290, name: 'Gilbert', height: 5.9, age: 'elder', pattern: 'vintage_spots' },
            { x: 650, y: 380, name: 'Giselle', height: 5.1, age: 'adult', pattern: 'elegant_spots' }
        ];

        giraffeHerd.forEach((member, index) => {
            const giraffe = this.gameEngine.createSprite('penguin', member.x, member.y); // Using penguin sprite as giraffe
            giraffe.name = member.name;
            giraffe.height = member.height; // meters
            giraffe.age = member.age;
            giraffe.pattern = member.pattern;
            giraffe.id = `giraffe_${index}`;
            giraffe.isWalking = false;
            giraffe.walkCooldown = Math.random() * 8000 + 5000;
            giraffe.originalX = member.x;
            giraffe.originalY = member.y;
            giraffe.neckAngle = 0;
            giraffe.leafReach = member.height * 80; // Visual reach for leaves
            
            // Age-based characteristics
            switch (member.age) {
                case 'adult':
                    giraffe.width = 60;
                    giraffe.displayHeight = 120;
                    giraffe.tintColor = '#DAA520';
                    giraffe.speed = 25;
                    break;
                case 'young':
                    giraffe.width = 40;
                    giraffe.displayHeight = 80;
                    giraffe.tintColor = '#F4A460';
                    giraffe.speed = 35;
                    giraffe.walkCooldown *= 0.7; // Young giraffes move more
                    break;
                case 'elder':
                    giraffe.width = 70;
                    giraffe.displayHeight = 140;
                    giraffe.tintColor = '#CD853F';
                    giraffe.speed = 15;
                    giraffe.walkCooldown *= 1.5; // Elder giraffes move less
                    break;
            }
            
            // Add giraffe behavior
            giraffe.update = (deltaTime) => {
                this.updateGiraffe(giraffe, deltaTime);
            };
            
            giraffe.onClick = () => {
                this.onGiraffeClick(giraffe);
            };
            
            this.giraffes.push(giraffe);
            this.gameEngine.addSprite(giraffe);
        });
    }

    updateGiraffe(giraffe, deltaTime) {
        // Handle walking animation
        giraffe.walkCooldown -= deltaTime;
        
        if (giraffe.walkCooldown <= 0 && !giraffe.isWalking) {
            giraffe.isWalking = true;
            giraffe.walkCooldown = Math.random() * 10000 + 6000;
            if (giraffe.age === 'young') giraffe.walkCooldown *= 0.7;
            if (giraffe.age === 'elder') giraffe.walkCooldown *= 1.5;
            
            giraffe.walkAnimationTime = 0;
            giraffe.walkDirection = Math.random() * Math.PI * 2;
            giraffe.walkDistance = Math.random() * 80 + 50;
        }
        
        if (giraffe.isWalking) {
            giraffe.walkAnimationTime += deltaTime;
            const walkProgress = giraffe.walkAnimationTime / 4000; // 4 second walk
            
            if (walkProgress <= 1) {
                // Graceful giraffe walking motion
                const walkX = Math.sin(walkProgress * Math.PI) * giraffe.walkDistance * Math.cos(giraffe.walkDirection);
                const walkY = Math.sin(walkProgress * Math.PI) * giraffe.walkDistance * 0.3 * Math.sin(giraffe.walkDirection);
                
                giraffe.x = giraffe.originalX + walkX;
                giraffe.y = giraffe.originalY + walkY;
                
                // Add gentle swaying motion
                const swaying = Math.sin(walkProgress * Math.PI * 8) * 2;
                giraffe.x += swaying;
                
                // Keep giraffes in plains bounds
                giraffe.x = Math.max(50, Math.min(1150, giraffe.x));
                giraffe.y = Math.max(200, Math.min(650, giraffe.y));
            } else {
                giraffe.isWalking = false;
                giraffe.x = giraffe.originalX;
                giraffe.y = giraffe.originalY;
            }
        }
        
        // Update neck movement for feeding
        giraffe.neckAngle = Math.sin(Date.now() / 3000 + giraffe.id) * 0.2;
    }

    onGiraffeClick(giraffe) {
        if (this.audioManager) {
            this.audioManager.playSFX('giraffe-call');
        }
        
        // Make giraffe walk
        giraffe.isWalking = true;
        giraffe.walkAnimationTime = 0;
        
        // Show giraffe measurements
        this.showGiraffeMeasurements(giraffe);
        
        // Create feeding animation
        this.createFeedingAnimation(giraffe.x, giraffe.y - giraffe.displayHeight);
    }

    showGiraffeMeasurements(giraffe) {
        const measurementSprite = {
            x: giraffe.x + 80,
            y: giraffe.y - 150,
            text: `${giraffe.name}\nHeight: ${giraffe.height}m\nNeck: ${(giraffe.height * 0.4).toFixed(1)}m\nLegs: ${(giraffe.height * 0.35).toFixed(1)}m`,
            life: 4500,
            opacity: 1,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.opacity = Math.max(0, this.life / 4500);
                this.y -= deltaTime / 90;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw measurement bubble
                ctx.fillStyle = 'rgba(255, 248, 220, 0.9)';
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 60, 140, 120, 15);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#B8860B';
                ctx.font = '13px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 45 + index * 18);
                });
                
                // Draw measuring tape
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.x - 60, this.y + 40);
                ctx.lineTo(this.x + 60, this.y + 40);
                ctx.stroke();
                
                // Draw measurement marks
                for (let i = 0; i <= 4; i++) {
                    const markX = this.x - 60 + (i * 30);
                    ctx.beginPath();
                    ctx.moveTo(markX, this.y + 35);
                    ctx.lineTo(markX, this.y + 45);
                    ctx.stroke();
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(measurementSprite);
    }

    createFeedingAnimation(x, y) {
        const feeding = {
            x: x,
            y: y,
            life: 3000,
            leafCount: 0,
            
            update: function(deltaTime) {
                this.life -= deltaTime;
                this.leafCount = Math.floor((3000 - this.life) / 500);
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                
                // Draw acacia branch
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(this.x - 30, this.y);
                ctx.lineTo(this.x + 30, this.y - 10);
                ctx.stroke();
                
                // Draw leaves being eaten
                ctx.fillStyle = '#228B22';
                for (let i = 0; i < Math.min(this.leafCount, 6); i++) {
                    const leafX = this.x - 25 + (i * 10);
                    const leafY = this.y - 5 - Math.sin(i) * 8;
                    ctx.beginPath();
                    ctx.ellipse(leafX, leafY, 4, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Show satisfaction
                if (this.leafCount >= 3) {
                    ctx.fillStyle = '#32CD32';
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('😋', this.x, this.y + 30);
                }
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(feeding);
    }

    createSavannaFeatures() {
        // Create acacia trees with different heights
        const acaciaPositions = [
            { x: 100, y: 500, height: 8.5, canopy: 25, leaves: 120 },
            { x: 300, y: 450, height: 12.2, canopy: 35, leaves: 180 },
            { x: 500, y: 480, height: 9.8, canopy: 28, leaves: 150 },
            { x: 700, y: 460, height: 15.5, canopy: 42, leaves: 220 },
            { x: 900, y: 520, height: 7.3, canopy: 22, leaves: 100 },
            { x: 1100, y: 470, height: 11.7, canopy: 32, leaves: 170 },
            { x: 50, y: 600, height: 6.8, canopy: 20, leaves: 85 },
            { x: 1150, y: 580, height: 9.1, canopy: 26, leaves: 135 }
        ];

        acaciaPositions.forEach((pos, index) => {
            const tree = {
                x: pos.x,
                y: pos.y,
                height: pos.height, // meters
                canopy: pos.canopy, // radius
                leaves: pos.leaves,
                swayTime: Math.random() * 2000,
                
                onClick: () => {
                    this.onAcaciaClick(tree);
                },
                
                update: function(deltaTime) {
                    this.swayTime += deltaTime;
                },
                
                render: function(ctx) {
                    const sway = Math.sin(this.swayTime / 3000) * 3;
                    const trunkHeight = this.height * 8; // Scale for display
                    
                    // Draw trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(this.x - 6 + sway, this.y - trunkHeight, 12, trunkHeight);
                    
                    // Draw canopy
                    ctx.fillStyle = '#228B22';
                    ctx.beginPath();
                    ctx.arc(this.x + sway, this.y - trunkHeight, this.canopy, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw umbrella shape (typical acacia)
                    ctx.fillStyle = '#32CD32';
                    ctx.beginPath();
                    ctx.ellipse(this.x + sway, this.y - trunkHeight + 5, this.canopy * 1.2, this.canopy * 0.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Show tree measurements
                    ctx.fillStyle = '#B8860B';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.height}m tall`, this.x, this.y + 20);
                    ctx.fillText(`🍃 ${this.leaves}`, this.x, this.y + 35);
                }
            };
            
            this.acaciaTrees.push(tree);
            this.gameEngine.addSprite(tree);
        });

        // Create geometric rock formations
        const rockFormations = [
            { x: 200, y: 650, type: 'triangle', base: 40, height: 30, angle: 60 },
            { x: 400, y: 630, type: 'rectangle', width: 60, height: 35, area: 2100 },
            { x: 600, y: 680, type: 'circle', radius: 25, circumference: 157 },
            { x: 800, y: 640, type: 'pentagon', side: 20, perimeter: 100 },
            { x: 1000, y: 660, type: 'hexagon', side: 18, perimeter: 108 }
        ];

        rockFormations.forEach(rock => {
            const rockSprite = {
                x: rock.x,
                y: rock.y,
                type: rock.type,
                properties: rock,
                isRevealed: false,
                
                onClick: () => {
                    this.onRockClick(rockSprite);
                },
                
                render: function(ctx) {
                    ctx.fillStyle = '#A0522D';
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    
                    switch (this.type) {
                        case 'triangle':
                            ctx.beginPath();
                            ctx.moveTo(this.x, this.y - this.properties.height);
                            ctx.lineTo(this.x - this.properties.base/2, this.y);
                            ctx.lineTo(this.x + this.properties.base/2, this.y);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                            break;
                        case 'rectangle':
                            ctx.fillRect(this.x - this.properties.width/2, this.y - this.properties.height, 
                                       this.properties.width, this.properties.height);
                            ctx.strokeRect(this.x - this.properties.width/2, this.y - this.properties.height, 
                                         this.properties.width, this.properties.height);
                            break;
                        case 'circle':
                            ctx.beginPath();
                            ctx.arc(this.x, this.y, this.properties.radius, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            break;
                        case 'pentagon':
                            this.drawRegularPolygon(ctx, 5);
                            break;
                        case 'hexagon':
                            this.drawRegularPolygon(ctx, 6);
                            break;
                    }
                    
                    // Show properties if revealed
                    if (this.isRevealed) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '11px "Comic Sans MS", cursive';
                        ctx.textAlign = 'center';
                        
                        let infoText = '';
                        switch (this.type) {
                            case 'triangle':
                                infoText = `Base: ${this.properties.base}cm\nHeight: ${this.properties.height}cm\nAngle: ${this.properties.angle}°`;
                                break;
                            case 'rectangle':
                                infoText = `W: ${this.properties.width}cm\nH: ${this.properties.height}cm\nArea: ${this.properties.area}cm²`;
                                break;
                            case 'circle':
                                infoText = `r: ${this.properties.radius}cm\nC: ${this.properties.circumference}cm`;
                                break;
                            case 'pentagon':
                                infoText = `Side: ${this.properties.side}cm\nP: ${this.properties.perimeter}cm`;
                                break;
                            case 'hexagon':
                                infoText = `Side: ${this.properties.side}cm\nP: ${this.properties.perimeter}cm`;
                                break;
                        }
                        
                        const lines = infoText.split('\n');
                        lines.forEach((line, index) => {
                            ctx.fillText(line, this.x, this.y + 50 + index * 14);
                        });
                    }
                },
                
                drawRegularPolygon: function(ctx, sides) {
                    const radius = this.properties.side * sides / (2 * Math.PI);
                    ctx.beginPath();
                    for (let i = 0; i < sides; i++) {
                        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
                        const x = this.x + Math.cos(angle) * radius;
                        const y = this.y + Math.sin(angle) * radius;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            };
            
            this.rocks.push(rockSprite);
            this.gameEngine.addSprite(rockSprite);
        });

        // Create zebras with stripe patterns (for measurement practice)
        const zebraPositions = [
            { x: 250, y: 550, name: 'Zigzag', stripes: 45, length: 2.4 },
            { x: 450, y: 580, name: 'Zorro', stripes: 52, length: 2.6 },
            { x: 650, y: 520, name: 'Zelda', stripes: 38, length: 2.1 },
            { x: 850, y: 560, name: 'Zeus', stripes: 49, length: 2.5 }
        ];

        zebraPositions.forEach(pos => {
            const zebra = {
                x: pos.x,
                y: pos.y,
                name: pos.name,
                stripes: pos.stripes,
                length: pos.length, // meters
                type: 'zebra',
                
                onClick: () => {
                    this.onZebraClick(zebra);
                },
                
                render: function(ctx) {
                    const bodyWidth = this.length * 30; // Scale for display
                    
                    // Draw zebra body
                    ctx.fillStyle = '#FFFFFF';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 2;
                    ctx.fillRect(this.x - bodyWidth/2, this.y - 20, bodyWidth, 40);
                    ctx.strokeRect(this.x - bodyWidth/2, this.y - 20, bodyWidth, 40);
                    
                    // Draw stripes
                    ctx.fillStyle = '#000000';
                    const stripeWidth = bodyWidth / this.stripes;
                    for (let i = 0; i < this.stripes; i += 2) {
                        const stripeX = this.x - bodyWidth/2 + (i * stripeWidth);
                        ctx.fillRect(stripeX, this.y - 20, stripeWidth, 40);
                    }
                    
                    // Draw head
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(this.x + bodyWidth/2 + 15, this.y, 12, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw mane
                    ctx.fillStyle = '#000000';
                    for (let i = 0; i < 5; i++) {
                        const maneX = this.x + bodyWidth/2 + 10 + (i * 2);
                        ctx.fillRect(maneX, this.y - 15, 2, 8);
                    }
                    
                    // Show zebra info
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.name}`, this.x, this.y + 60);
                    ctx.fillText(`${this.stripes} stripes, ${this.length}m`, this.x, this.y + 75);
                }
            };
            
            this.zebras.push(zebra);
            this.gameEngine.addSprite(zebra);
        });
    }

    createSavannaEffects() {
        // Create grass patches
        for (let i = 0; i < 20; i++) {
            const grassPatch = {
                x: Math.random() * 1200,
                y: Math.random() * 200 + 500,
                size: Math.random() * 15 + 10,
                swayTime: Math.random() * 2000,
                
                update: function(deltaTime) {
                    this.swayTime += deltaTime;
                },
                
                render: function(ctx) {
                    const sway = Math.sin(this.swayTime / 1500) * 2;
                    
                    ctx.fillStyle = '#9ACD32';
                    for (let j = 0; j < 8; j++) {
                        const grassX = this.x + (j * 3) - 12 + sway;
                        const grassHeight = this.size + Math.sin(j) * 5;
                        ctx.fillRect(grassX, this.y, 2, -grassHeight);
                    }
                }
            };
            
            this.grassPatches.push(grassPatch);
            this.gameEngine.addSprite(grassPatch);
        }

        // Create savanna clouds
        for (let i = 0; i < 6; i++) {
            const cloud = {
                x: Math.random() * 1400 - 100,
                y: Math.random() * 100 + 50,
                size: Math.random() * 30 + 40,
                speed: Math.random() * 10 + 5,
                opacity: Math.random() * 0.4 + 0.6,
                
                update: function(deltaTime) {
                    this.x += this.speed * deltaTime / 1000;
                    if (this.x > 1300) {
                        this.x = -100;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    ctx.fillStyle = '#FFFFFF';
                    
                    // Draw fluffy cloud
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.arc(this.x + this.size * 0.6, this.y, this.size * 0.8, 0, Math.PI * 2);
                    ctx.arc(this.x - this.size * 0.6, this.y, this.size * 0.8, 0, Math.PI * 2);
                    ctx.arc(this.x, this.y - this.size * 0.4, this.size * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            };
            
            this.clouds.push(cloud);
            this.gameEngine.addSprite(cloud);
        }

        // Create birds flying in formation
        for (let i = 0; i < 8; i++) {
            const bird = {
                x: Math.random() * 1200,
                y: Math.random() * 200 + 100,
                flightTime: Math.random() * 3000,
                flightPattern: i % 2 === 0 ? 'V' : 'line',
                position: i,
                
                update: function(deltaTime) {
                    this.flightTime += deltaTime;
                    
                    // Formation flying
                    if (this.flightPattern === 'V') {
                        const formationX = Math.sin(this.flightTime / 2000) * 20;
                        const formationY = Math.abs(Math.sin(this.flightTime / 2000)) * 10;
                        this.x += (deltaTime / 1000) * 30;
                        this.y += formationY * (this.position % 2 === 0 ? 1 : -1);
                    } else {
                        this.x += (deltaTime / 1000) * 25;
                        this.y += Math.sin(this.flightTime / 1000) * 5;
                    }
                    
                    if (this.x > 1300) {
                        this.x = -50;
                        this.y = Math.random() * 200 + 100;
                    }
                },
                
                render: function(ctx) {
                    ctx.fillStyle = '#000000';
                    ctx.font = '12px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    
                    // Simple bird representation
                    const wingFlap = Math.sin(this.flightTime / 200) > 0 ? '🕊️' : '🦅';
                    ctx.fillText(wingFlap, this.x, this.y);
                }
            };
            
            this.birds.push(bird);
            this.gameEngine.addSprite(bird);
        }

        // Create butterflies for geometric patterns
        for (let i = 0; i < 5; i++) {
            const butterfly = {
                x: Math.random() * 1200,
                y: Math.random() * 300 + 200,
                flutterTime: Math.random() * 1000,
                patternType: ['circle', 'figure8', 'square', 'triangle'][Math.floor(Math.random() * 4)],
                centerX: 0,
                centerY: 0,
                
                update: function(deltaTime) {
                    this.flutterTime += deltaTime;
                    
                    // Set pattern center if not set
                    if (this.centerX === 0) {
                        this.centerX = this.x;
                        this.centerY = this.y;
                    }
                    
                    // Geometric flight patterns
                    const t = this.flutterTime / 3000;
                    switch (this.patternType) {
                        case 'circle':
                            this.x = this.centerX + Math.cos(t * Math.PI * 2) * 40;
                            this.y = this.centerY + Math.sin(t * Math.PI * 2) * 40;
                            break;
                        case 'figure8':
                            this.x = this.centerX + Math.sin(t * Math.PI * 2) * 40;
                            this.y = this.centerY + Math.sin(t * Math.PI * 4) * 20;
                            break;
                        case 'square':
                            const squareT = (t * 4) % 4;
                            if (squareT < 1) {
                                this.x = this.centerX - 30 + (squareT * 60);
                                this.y = this.centerY - 30;
                            } else if (squareT < 2) {
                                this.x = this.centerX + 30;
                                this.y = this.centerY - 30 + ((squareT - 1) * 60);
                            } else if (squareT < 3) {
                                this.x = this.centerX + 30 - ((squareT - 2) * 60);
                                this.y = this.centerY + 30;
                            } else {
                                this.x = this.centerX - 30;
                                this.y = this.centerY + 30 - ((squareT - 3) * 60);
                            }
                            break;
                        case 'triangle':
                            const triT = (t * 3) % 3;
                            if (triT < 1) {
                                this.x = this.centerX - 30 + (triT * 60);
                                this.y = this.centerY + 30;
                            } else if (triT < 2) {
                                this.x = this.centerX + 30 - ((triT - 1) * 30);
                                this.y = this.centerY + 30 - ((triT - 1) * 60);
                            } else {
                                this.x = this.centerX - ((triT - 2) * 30);
                                this.y = this.centerY - 30 + ((triT - 2) * 60);
                            }
                            break;
                    }
                },
                
                render: function(ctx) {
                    ctx.fillStyle = ['#FF69B4', '#FFD700', '#32CD32', '#FF6347'][Math.floor(this.flutterTime / 1000) % 4];
                    ctx.font = '16px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText('🦋', this.x, this.y);
                }
            };
            
            this.butterflies.push(butterfly);
            this.gameEngine.addSprite(butterfly);
        }
    }

    addInteractiveElements() {
        // Create measurement challenges
        this.createMeasurementChallenges();
        
        // Create geometry puzzles
        this.createGeometryPuzzles();
    }

    createMeasurementChallenges() {
        const challenges = [
            { 
                x: 300, y: 150, 
                type: 'distance',
                question: "How far between these trees?",
                answer: 25,
                unit: 'meters'
            },
            { 
                x: 600, y: 120, 
                type: 'area',
                question: "What's the area of this field?",
                answer: 150,
                unit: 'square meters'
            },
            { 
                x: 900, y: 140, 
                type: 'perimeter',
                question: "Perimeter of zebra enclosure?",
                answer: 48,
                unit: 'meters'
            }
        ];

        challenges.forEach(challenge => {
            const challengeStation = {
                x: challenge.x,
                y: challenge.y,
                question: challenge.question,
                answer: challenge.answer,
                unit: challenge.unit,
                type: challenge.type,
                isSolved: false,
                
                onClick: () => {
                    this.onMeasurementChallengeClick(challengeStation);
                },
                
                render: function(ctx) {
                    // Draw challenge platform
                    ctx.fillStyle = this.isSolved ? '#90EE90' : '#DEB887';
                    ctx.strokeStyle = '#DAA520';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 70, this.y - 25, 140, 50, 12);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw challenge icon
                    ctx.font = '20px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    const icon = this.type === 'distance' ? '📏' : this.type === 'area' ? '⬜' : '🔲';
                    ctx.fillText(icon, this.x, this.y - 5);
                    
                    // Draw text
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '10px "Comic Sans MS", cursive';
                    ctx.fillText('Measurement', this.x, this.y + 15);
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '12px "Comic Sans MS", cursive';
                        ctx.fillText(`${this.answer} ${this.unit}`, this.x, this.y + 30);
                    }
                }
            };
            
            this.gameEngine.addSprite(challengeStation);
        });
    }

    createGeometryPuzzles() {
        const puzzles = [
            { x: 200, y: 700, shape: 'triangle', sides: 3, angles: [60, 60, 60] },
            { x: 500, y: 720, shape: 'square', sides: 4, angles: [90, 90, 90, 90] },
            { x: 800, y: 710, shape: 'pentagon', sides: 5, angles: [108, 108, 108, 108, 108] }
        ];

        puzzles.forEach(puzzle => {
            const geometryPuzzle = {
                x: puzzle.x,
                y: puzzle.y,
                shape: puzzle.shape,
                sides: puzzle.sides,
                angles: puzzle.angles,
                currentAngle: 0,
                isSolved: false,
                
                onClick: () => {
                    this.onGeometryPuzzleClick(geometryPuzzle);
                },
                
                render: function(ctx) {
                    // Draw puzzle platform
                    ctx.fillStyle = this.isSolved ? '#90EE90' : '#FFB6C1';
                    ctx.strokeStyle = '#DAA520';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(this.x - 60, this.y - 30, 120, 60, 15);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw shape
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    const radius = 20;
                    
                    switch (this.shape) {
                        case 'triangle':
                            ctx.beginPath();
                            for (let i = 0; i < 3; i++) {
                                const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
                                const x = this.x + Math.cos(angle) * radius;
                                const y = this.y + Math.sin(angle) * radius;
                                if (i === 0) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                            ctx.closePath();
                            ctx.stroke();
                            break;
                        case 'square':
                            ctx.strokeRect(this.x - radius, this.y - radius, radius * 2, radius * 2);
                            break;
                        case 'pentagon':
                            ctx.beginPath();
                            for (let i = 0; i < 5; i++) {
                                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                                const x = this.x + Math.cos(angle) * radius;
                                const y = this.y + Math.sin(angle) * radius;
                                if (i === 0) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                            ctx.closePath();
                            ctx.stroke();
                            break;
                    }
                    
                    // Show current angle
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '11px "Comic Sans MS", cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.sides} sides`, this.x, this.y + 50);
                    
                    if (this.isSolved) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '10px "Comic Sans MS", cursive';
                        ctx.fillText(`${this.angles[0]}° each`, this.x, this.y + 65);
                    }
                }
            };
            
            this.gameEngine.addSprite(geometryPuzzle);
        });
    }

    onAcaciaClick(tree) {
        if (this.audioManager) {
            this.audioManager.playSFX('leaf-rustle');
        }
        
        if (tree.leaves > 0) {
            tree.leaves = Math.max(0, tree.leaves - 5);
            this.createLeafFallAnimation(tree.x, tree.y - tree.height * 8);
        }
        
        this.showTreeMeasurements(tree);
    }

    onRockClick(rock) {
        if (this.audioManager) {
            this.audioManager.playSFX('stone-tap');
        }
        
        rock.isRevealed = !rock.isRevealed;
    }

    onZebraClick(zebra) {
        if (this.audioManager) {
            this.audioManager.playSFX('zebra-neigh');
        }
        
        this.showZebraPatterns(zebra);
    }

    onMeasurementChallengeClick(station) {
        if (this.audioManager) {
            this.audioManager.playSFX(station.isSolved ? 'already-solved' : 'measurement-reveal');
        }
        
        if (!station.isSolved) {
            this.showMeasurementDialog(station);
        }
    }

    onGeometryPuzzleClick(puzzle) {
        if (this.audioManager) {
            this.audioManager.playSFX('geometry-click');
        }
        
        if (!puzzle.isSolved) {
            puzzle.currentAngle = (puzzle.currentAngle + 1) % puzzle.angles.length;
            if (puzzle.currentAngle === 0) {
                puzzle.isSolved = true;
            }
        }
    }

    createLeafFallAnimation(x, y) {
        for (let i = 0; i < 3; i++) {
            const leaf = {
                x: x + (Math.random() - 0.5) * 60,
                y: y,
                life: 2000,
                velocity: 0,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                
                update: function(deltaTime) {
                    this.life -= deltaTime;
                    this.velocity += deltaTime / 150; // gravity
                    this.y += this.velocity;
                    this.rotation += this.rotationSpeed * deltaTime;
                    this.x += Math.sin(this.y / 50) * 0.5;
                    
                    if (this.life <= 0) {
                        this.isDead = true;
                    }
                },
                
                render: function(ctx) {
                    ctx.save();
                    ctx.globalAlpha = this.life / 2000;
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.fillStyle = '#228B22';
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            };
            
            this.gameEngine.addSprite(leaf);
        }
    }

    showTreeMeasurements(tree) {
        const measurements = {
            x: tree.x,
            y: tree.y - tree.height * 8 - 80,
            text: `Tree Height: ${tree.height}m\nCanopy: ${tree.canopy * 2}m wide\nLeaves: ${tree.leaves}`,
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
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.strokeStyle = '#228B22';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 30, 140, 60, 10);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#006400';
                ctx.font = '12px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 15 + index * 15);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(measurements);
    }

    showZebraPatterns(zebra) {
        const patterns = {
            x: zebra.x,
            y: zebra.y - 80,
            text: `${zebra.name}\nStripes: ${zebra.stripes}\nLength: ${zebra.length}m\nPattern: Regular`,
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
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(this.x - 70, this.y - 40, 140, 80, 12);
                ctx.fill();
                ctx.stroke();
                
                // Draw mini stripe pattern
                for (let i = 0; i < 6; i++) {
                    if (i % 2 === 0) {
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(this.x - 60 + (i * 20), this.y - 30, 20, 10);
                    }
                }
                
                ctx.fillStyle = '#000000';
                ctx.font = '11px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                
                const lines = this.text.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, this.x, this.y - 10 + index * 14);
                });
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(patterns);
    }

    showMeasurementDialog(station) {
        const dialog = {
            x: 600,
            y: 250,
            question: station.question,
            answer: station.answer,
            unit: station.unit,
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
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 200, this.y - 80, 400, 160, 20);
                ctx.fill();
                ctx.stroke();
                
                // Draw question
                ctx.fillStyle = '#B8860B';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText(this.question, this.x, this.y - 30);
                
                // Show answer
                ctx.fillStyle = '#FFD700';
                ctx.font = '24px "Comic Sans MS", cursive';
                ctx.fillText(`${this.answer} ${this.unit}`, this.x, this.y + 20);
                
                // Draw measurement illustration
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x - 100, this.y + 50);
                ctx.lineTo(this.x + 100, this.y + 50);
                ctx.stroke();
                
                // Draw measurement marks
                for (let i = 0; i <= 4; i++) {
                    const markX = this.x - 100 + (i * 50);
                    ctx.beginPath();
                    ctx.moveTo(markX, this.y + 45);
                    ctx.lineTo(markX, this.y + 55);
                    ctx.stroke();
                }
                
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
        if (this.currentProblem.type === 'measurement') {
            this.addMeasurementVisuals();
        } else if (this.currentProblem.type === 'geometry') {
            this.addGeometryVisuals();
        }
    }

    addMeasurementVisuals() {
        // Create measurement visualization
        this.createMeasurementWorkspace(500, 120);
    }

    addGeometryVisuals() {
        // Create geometry visualization
        this.createGeometryWorkspace(450, 100);
    }

    createMeasurementWorkspace(x, y) {
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
                
                // Draw measurement tools
                ctx.font = '32px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('📏', this.x - 80, this.y - 10);
                ctx.fillText('📐', this.x, this.y - 10);
                ctx.fillText('⚖️', this.x + 80, this.y - 10);
                
                // Draw helper text
                ctx.fillStyle = '#B8860B';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.fillText('Measure carefully!', this.x, this.y + 25);
            }
        };
        
        this.gameEngine.addSprite(workspace);
    }

    createGeometryWorkspace(x, y) {
        const workspace = {
            x: x,
            y: y,
            isProblemVisual: true,
            
            render: function(ctx) {
                // Draw workspace
                ctx.fillStyle = 'rgba(230, 230, 250, 0.8)';
                ctx.strokeStyle = '#9370DB';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 140, this.y - 50, 280, 100, 15);
                ctx.fill();
                ctx.stroke();
                
                // Draw geometric shapes
                ctx.strokeStyle = '#4B0082';
                ctx.lineWidth = 2;
                
                // Triangle
                ctx.beginPath();
                ctx.moveTo(this.x - 100, this.y + 10);
                ctx.lineTo(this.x - 80, this.y - 20);
                ctx.lineTo(this.x - 60, this.y + 10);
                ctx.closePath();
                ctx.stroke();
                
                // Square
                ctx.strokeRect(this.x - 15, this.y - 15, 30, 30);
                
                // Circle
                ctx.beginPath();
                ctx.arc(this.x + 80, this.y, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                // Draw helper text
                ctx.fillStyle = '#4B0082';
                ctx.font = '14px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Think about shapes!', this.x, this.y + 35);
            }
        };
        
        this.gameEngine.addSprite(workspace);
    }

    clearProblemVisuals() {
        // Remove all sprites marked as problem visuals
        this.gameEngine.sprites = this.gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        console.log(`GiraffePlains: Checking answer ${userAnswer} against ${this.currentProblem.answer}`);
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
        console.log(`Giraffe Plains: Problem solved! Progress: ${this.problemsSolved}/${this.totalProblems}`);
        
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
        
        // Make all giraffes walk
        this.giraffes.forEach(giraffe => {
            giraffe.isWalking = true;
            giraffe.walkAnimationTime = 0;
        });
        
        // Add celebration particles
        this.gameEngine.createCelebrationParticles(600, 400);
        
        // Add particles around giraffes
        this.giraffes.forEach(giraffe => {
            this.gameEngine.createCelebrationParticles(giraffe.x, giraffe.y - giraffe.displayHeight);
        });
        
        // Create savanna celebration
        this.createSavannaCelebration();
        
        // Stop celebration after 3 seconds
        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    createSavannaCelebration() {
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
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('TALL SUCCESS!', this.x, this.y);
                ctx.fillText('TALL SUCCESS!', this.x, this.y);
                
                // Draw happy giraffes
                ctx.font = '36px "Comic Sans MS", cursive';
                ctx.fillText('🦒📏🦒', this.x, this.y + 60);
                
                ctx.restore();
            }
        };
        
        this.gameEngine.addSprite(celebration);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        
        // Create hint bubble with helpful giraffe
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
                ctx.fillStyle = 'rgba(255, 248, 220, 0.95)';
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
                ctx.fillStyle = '#B8860B';
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
            text: 'Giraffe Plains Complete!',
            subtext: 'You mastered measurement and geometry! The giraffes salute you!',
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
                
                // Draw celebration giraffes
                ctx.font = '48px "Comic Sans MS", cursive';
                ctx.fillText('🦒📐🦒', this.x, this.y + 120);
                
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
        console.log('Giraffe Plains completed! Returning to habitat selection...');
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
        this.giraffes.forEach(giraffe => {
            if (giraffe.update) {
                giraffe.update(deltaTime);
            }
        });
        
        // Update grass patches
        this.grassPatches.forEach(grass => {
            if (grass.update) {
                grass.update(deltaTime);
            }
        });
        
        // Update clouds
        this.clouds.forEach(cloud => {
            if (cloud.update) {
                cloud.update(deltaTime);
            }
        });
        
        // Update birds
        this.birds.forEach(bird => {
            if (bird.update) {
                bird.update(deltaTime);
            }
        });
        
        // Update butterflies
        this.butterflies.forEach(butterfly => {
            if (butterfly.update) {
                butterfly.update(deltaTime);
            }
        });
        
        // Update acacia trees
        this.acaciaTrees.forEach(tree => {
            if (tree.update) {
                tree.update(deltaTime);
            }
        });
        
        // Check for problem timeout
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 150000) { // 2.5 minute timeout for measurement/geometry
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
        this.giraffes = [];
        this.zebras = [];
        this.elephants = [];
        this.lions = [];
        this.acaciaTrees = [];
        this.rocks = [];
        this.wateringHoles = [];
        this.grassPatches = [];
        this.clouds = [];
        this.birds = [];
        this.butterflies = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GiraffePlains;
}
            