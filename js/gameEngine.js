// Game Engine for Times Table Animals
// Handles canvas rendering, animations, and game loop

class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isPaused = false;
        this.gameTime = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
        this.fps = 60;
        this.targetFrameTime = 1000 / this.fps;
        
        // Game objects
        this.sprites = [];
        this.particles = [];
        this.animations = [];
        
        // Input handling
        this.mouse = { x: 0, y: 0, pressed: false };
        this.keys = {};
        
        // Scene management
        this.currentScene = null;
        this.backgroundImage = null;
        this.cameraX = 0;
        this.cameraY = 0;
        
        this.init();
    }

    init() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Game canvas not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.setupEventListeners();
        this.preloadAssets();
    }

    setupCanvas() {
        // Set canvas size
        this.canvas.width = 1200;
        this.canvas.height = 800;
        
        // Set up rendering context
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // Set default styles
        this.ctx.font = '16px "Comic Sans MS", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.pressed = true;
            this.onMouseDown(this.mouse.x, this.mouse.y);
        });

        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.pressed = false;
            this.onMouseUp(this.mouse.x, this.mouse.y);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.onMouseMove(this.mouse.x, this.mouse.y);
        });

        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.onKeyDown(e.key);
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            this.onKeyUp(e.key);
        });

        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    preloadAssets() {
        // Create simple sprite assets using canvas
        this.assets = {
            bunny: this.createBunnySprite(),
            penguin: this.createPenguinSprite(),
            elephant: this.createElephantSprite(),
            monkey: this.createMonkeySprite(),
            lion: this.createLionSprite(),
            carrot: this.createCarrotSprite(),
            fish: this.createFishSprite(),
            peanut: this.createPeanutSprite(),
            banana: this.createBananaSprite(),
            background: this.createBackgroundSprite()
        };
    }

    createBunnySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');
        
        // Draw bunny body
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(15, 30, 30, 25);
        
        // Draw bunny head
        ctx.beginPath();
        ctx.arc(30, 20, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ears
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(22, 5, 4, 12);
        ctx.fillRect(34, 5, 4, 12);
        
        // Draw eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(26, 18, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(34, 18, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw nose
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(30, 22, 1, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }

    createPenguinSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 70;
        const ctx = canvas.getContext('2d');
        
        // Draw penguin body
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 20, 30, 40);
        
        // Draw belly
        ctx.fillStyle = '#FFF';
        ctx.fillRect(15, 25, 20, 30);
        
        // Draw head
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(25, 15, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(20, 15, 10, 3);
        
        // Draw eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(22, 12, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(28, 12, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw feet
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(15, 55, 8, 10);
        ctx.fillRect(27, 55, 8, 10);
        
        return canvas;
    }

    createElephantSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        // Draw elephant body
        ctx.fillStyle = '#808080';
        ctx.fillRect(20, 30, 60, 40);
        
        // Draw head
        ctx.beginPath();
        ctx.arc(30, 25, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw trunk
        ctx.fillRect(15, 25, 20, 8);
        ctx.fillRect(10, 30, 15, 8);
        
        // Draw ears
        ctx.beginPath();
        ctx.arc(20, 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(40, 20, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw legs
        ctx.fillRect(25, 65, 8, 15);
        ctx.fillRect(35, 65, 8, 15);
        ctx.fillRect(55, 65, 8, 15);
        ctx.fillRect(65, 65, 8, 15);
        
        return canvas;
    }

    createMonkeySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        // Draw monkey body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(20, 40, 20, 30);
        
        // Draw head
        ctx.beginPath();
        ctx.arc(30, 25, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw face
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(30, 25, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw arms
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(10, 45, 15, 6);
        ctx.fillRect(35, 45, 15, 6);
        
        // Draw legs
        ctx.fillRect(22, 65, 6, 15);
        ctx.fillRect(32, 65, 6, 15);
        
        // Draw tail
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(40, 50);
        ctx.quadraticCurveTo(50, 40, 45, 30);
        ctx.stroke();
        
        return canvas;
    }

    createLionSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 70;
        const ctx = canvas.getContext('2d');
        
        // Draw lion body
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(15, 35, 50, 25);
        
        // Draw mane
        ctx.fillStyle = '#CD853F';
        ctx.beginPath();
        ctx.arc(30, 25, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw head
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.arc(30, 25, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw legs
        ctx.fillRect(20, 55, 6, 12);
        ctx.fillRect(30, 55, 6, 12);
        ctx.fillRect(40, 55, 6, 12);
        ctx.fillRect(50, 55, 6, 12);
        
        // Draw tail
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(65, 45);
        ctx.lineTo(75, 40);
        ctx.stroke();
        
        return canvas;
    }

    createCarrotSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        
        // Draw carrot
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(10, 35);
        ctx.lineTo(5, 15);
        ctx.lineTo(15, 15);
        ctx.closePath();
        ctx.fill();
        
        // Draw carrot top
        ctx.fillStyle = '#228B22';
        ctx.fillRect(8, 10, 4, 8);
        ctx.fillRect(6, 8, 8, 4);
        
        return canvas;
    }

    createFishSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        
        // Draw fish body
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.ellipse(15, 10, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tail
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.moveTo(25, 10);
        ctx.lineTo(30, 5);
        ctx.lineTo(30, 15);
        ctx.closePath();
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(12, 8, 2, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }

    createPeanutSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 25;
        canvas.height = 15;
        const ctx = canvas.getContext('2d');
        
        // Draw peanut
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.ellipse(12, 7, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw peanut texture
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(12, 7, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        return canvas;
    }

    createBananaSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        
        // Draw banana
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.ellipse(15, 10, 12, 6, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw banana tip
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(25, 8, 2, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }

    createBackgroundSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 800);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 800);
        
        return canvas;
    }

    startGame() {
        this.isPaused = false;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    pauseGame() {
        this.isPaused = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resumeGame() {
        this.isPaused = false;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime = performance.now()) {
        if (this.isPaused) return;
        
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.gameTime += this.deltaTime;
        
        // Update game state
        this.update(this.deltaTime);
        
        // Render frame
        this.render();
        
        // Schedule next frame
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Update sprites
        this.sprites.forEach(sprite => {
            if (sprite.update) {
                sprite.update(deltaTime);
            }
        });
        
        // Update particles
        this.particles.forEach((particle, index) => {
            if (particle.update) {
                particle.update(deltaTime);
                if (particle.isDead) {
                    this.particles.splice(index, 1);
                }
            }
        });
        
        // Update animations
        this.animations.forEach((animation, index) => {
            if (animation.update) {
                animation.update(deltaTime);
                if (animation.isComplete) {
                    this.animations.splice(index, 1);
                }
            }
        });
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        if (this.backgroundImage) {
            this.ctx.drawImage(this.backgroundImage, 0, 0);
        } else {
            this.ctx.drawImage(this.assets.background, 0, 0);
        }
        
        // Draw sprites
        this.sprites.forEach(sprite => {
            if (sprite.render) {
                sprite.render(this.ctx);
            }
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            if (particle.render) {
                particle.render(this.ctx);
            }
        });
        
        // Draw animations
        this.animations.forEach(animation => {
            if (animation.render) {
                animation.render(this.ctx);
            }
        });
    }

    addSprite(sprite) {
        this.sprites.push(sprite);
    }

    removeSprite(sprite) {
        const index = this.sprites.indexOf(sprite);
        if (index > -1) {
            this.sprites.splice(index, 1);
        }
    }

    addParticle(particle) {
        this.particles.push(particle);
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    createSprite(type, x, y) {
        const sprite = {
            type: type,
            x: x,
            y: y,
            width: 60,
            height: 60,
            image: this.assets[type],
            visible: true,
            animationFrame: 0,
            animationSpeed: 0.1,
            velocity: { x: 0, y: 0 },
            
            update: function(deltaTime) {
                this.x += this.velocity.x * deltaTime / 1000;
                this.y += this.velocity.y * deltaTime / 1000;
                this.animationFrame += this.animationSpeed * deltaTime / 1000;
            },
            
            render: function(ctx) {
                if (this.visible && this.image) {
                    ctx.save();
                    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
                    ctx.restore();
                }
            }
        };
        
        return sprite;
    }

    createParticle(x, y, color = '#FFD700') {
        const particle = {
            x: x,
            y: y,
            velocity: {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200
            },
            life: 1.0,
            maxLife: 1.0,
            color: color,
            size: Math.random() * 5 + 2,
            isDead: false,
            
            update: function(deltaTime) {
                this.x += this.velocity.x * deltaTime / 1000;
                this.y += this.velocity.y * deltaTime / 1000;
                this.life -= deltaTime / 1000;
                
                if (this.life <= 0) {
                    this.isDead = true;
                }
            },
            
            render: function(ctx) {
                const alpha = this.life / this.maxLife;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        };
        
        return particle;
    }

    createCelebrationParticles(x, y) {
        const colors = ['#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF6347'];
        for (let i = 0; i < 10; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const particle = this.createParticle(x, y, color);
            this.addParticle(particle);
        }
    }

    // Event handlers
    onMouseDown(x, y) {
        // Check for sprite clicks
        this.sprites.forEach(sprite => {
            if (this.isPointInSprite(x, y, sprite)) {
                if (sprite.onClick) {
                    sprite.onClick();
                }
            }
        });
    }

    onMouseUp(x, y) {
        // Handle mouse up events
    }

    onMouseMove(x, y) {
        // Handle mouse move events
    }

    onKeyDown(key) {
        // Handle key press events
    }

    onKeyUp(key) {
        // Handle key release events
    }

    isPointInSprite(x, y, sprite) {
        return x >= sprite.x && x <= sprite.x + sprite.width &&
               y >= sprite.y && y <= sprite.y + sprite.height;
    }

    setBackground(habitatName) {
        // Set background based on habitat
        const backgrounds = {
            bunnyMeadow: '#98FB98',
            penguinArctic: '#B0E0E6',
            elephantSavanna: '#F4A460',
            monkeyJungle: '#228B22',
            lionPride: '#DAA520'
        };
        
        const bgColor = backgrounds[habitatName] || '#87CEEB';
        
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 800);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, '#87CEEB');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 800);
        
        this.backgroundImage = canvas;
    }

    clearSprites() {
        this.sprites = [];
    }

    clearParticles() {
        this.particles = [];
    }

    clearAnimations() {
        this.animations = [];
    }

    destroy() {
        this.pauseGame();
        this.clearSprites();
        this.clearParticles();
        this.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}