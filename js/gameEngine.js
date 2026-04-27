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
        // Create stylized sprite assets using canvas paths.
        this.assets = {
            bunny: this.createBunnySprite(),
            penguin: this.createPenguinSprite(),
            elephant: this.createElephantSprite(),
            monkey: this.createMonkeySprite(),
            lion: this.createLionSprite(),
            dolphin: this.createDolphinSprite(),
            giraffe: this.createGiraffeSprite(),
            bear: this.createBearSprite(),
            owl: this.createOwlSprite(),
            dragon: this.createDragonSprite(),
            earthworm: this.createEarthwormSprite(),
            caterpillar: this.createCaterpillarSprite(),
            butterfly: this.createButterflySprite(),
            frog: this.createFrogSprite(),
            carrot: this.createCarrotSprite(),
            fish: this.createFishSprite(),
            peanut: this.createPeanutSprite(),
            banana: this.createBananaSprite(),
            background: this.createBackgroundSprite()
        };
    }

    createBunnySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 72;
        canvas.height = 72;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f3efe7';
        ctx.beginPath();
        ctx.ellipse(36, 46, 17, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f6f1ea';
        ctx.beginPath();
        ctx.ellipse(30, 15, 6, 13, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(42, 15, 6, 13, 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffd7e5';
        ctx.beginPath();
        ctx.ellipse(30, 15, 2.5, 8, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(42, 15, 2.5, 8, 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f3efe7';
        ctx.beginPath();
        ctx.arc(36, 28, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1f1f1f';
        ctx.beginPath();
        ctx.arc(31, 26, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(41, 26, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#eaa3b9';
        ctx.beginPath();
        ctx.arc(36, 31, 2.5, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createPenguinSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#1b2638';
        ctx.beginPath();
        ctx.ellipse(32, 44, 18, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f2f6fb';
        ctx.beginPath();
        ctx.ellipse(32, 48, 10, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1b2638';
        ctx.beginPath();
        ctx.arc(32, 22, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f6c451';
        ctx.beginPath();
        ctx.moveTo(32, 25);
        ctx.lineTo(26, 29);
        ctx.lineTo(38, 29);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(28, 20, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(36, 20, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f6c451';
        ctx.beginPath();
        ctx.ellipse(25, 69, 6, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(39, 69, 6, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createElephantSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 110;
        canvas.height = 86;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#7f8995';
        ctx.beginPath();
        ctx.ellipse(62, 48, 33, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(32, 34, 16, 14, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(48, 32, 13, 12, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(40, 40, 13, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(26, 42);
        ctx.quadraticCurveTo(12, 55, 20, 72);
        ctx.lineTo(30, 72);
        ctx.quadraticCurveTo(22, 59, 34, 47);
        ctx.closePath();
        ctx.fill();

        [43, 58, 72, 86].forEach((x) => {
            ctx.beginPath();
            ctx.roundRect(x, 64, 10, 18, 4);
            ctx.fill();
        });

        ctx.fillStyle = '#f4f7fb';
        ctx.beginPath();
        ctx.arc(36, 38, 2, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createMonkeySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 74;
        canvas.height = 86;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#7a4a2a';
        ctx.beginPath();
        ctx.ellipse(37, 50, 16, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#7a4a2a';
        ctx.beginPath();
        ctx.arc(37, 28, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d8b28a';
        ctx.beginPath();
        ctx.ellipse(37, 31, 8, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#7a4a2a';
        ctx.beginPath();
        ctx.ellipse(21, 30, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(53, 30, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(19, 46, 8, 20, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(47, 46, 8, 20, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(29, 66, 7, 14, 3);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(38, 66, 7, 14, 3);
        ctx.fill();

        ctx.strokeStyle = '#7a4a2a';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(55, 54);
        ctx.quadraticCurveTo(68, 38, 61, 24);
        ctx.stroke();

        return canvas;
    }

    createLionSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 78;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#c27f38';
        ctx.beginPath();
        ctx.arc(32, 30, 17, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d8a653';
        ctx.beginPath();
        ctx.arc(32, 30, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(55, 47, 26, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        [42, 53, 63, 74].forEach((x) => {
            ctx.beginPath();
            ctx.roundRect(x, 56, 7, 15, 3);
            ctx.fill();
        });

        ctx.strokeStyle = '#d8a653';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(78, 47);
        ctx.quadraticCurveTo(90, 40, 86, 27);
        ctx.stroke();

        ctx.fillStyle = '#d39a45';
        ctx.beginPath();
        ctx.arc(86, 27, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1f1f1f';
        ctx.beginPath();
        ctx.arc(28, 28, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(36, 28, 1.8, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }

    createDolphinSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 92;
        canvas.height = 58;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#8fb8da';
        ctx.beginPath();
        ctx.moveTo(10, 32);
        ctx.quadraticCurveTo(36, 12, 64, 24);
        ctx.quadraticCurveTo(74, 30, 82, 27);
        ctx.quadraticCurveTo(78, 34, 82, 42);
        ctx.quadraticCurveTo(72, 39, 62, 44);
        ctx.quadraticCurveTo(35, 53, 10, 34);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(48, 22);
        ctx.lineTo(58, 8);
        ctx.lineTo(66, 23);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(30, 38);
        ctx.lineTo(21, 48);
        ctx.lineTo(43, 43);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f4fbff';
        ctx.beginPath();
        ctx.ellipse(40, 34, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1c3147';
        ctx.beginPath();
        ctx.arc(25, 26, 2, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createGiraffeSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 74;
        canvas.height = 126;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#e0aa54';
        ctx.beginPath();
        ctx.ellipse(37, 86, 19, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(32, 25, 10, 54, 5);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(37, 18, 14, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        [22, 31, 43, 52].forEach((x) => {
            ctx.beginPath();
            ctx.roundRect(x, 102, 7, 20, 3);
            ctx.fill();
        });

        ctx.fillStyle = '#9a632b';
        [[28, 88], [45, 76], [34, 66], [40, 49], [33, 33], [25, 80]].forEach((spot) => {
            ctx.beginPath();
            ctx.ellipse(spot[0], spot[1], 4, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = '#1f1f1f';
        ctx.beginPath();
        ctx.arc(33, 17, 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(41, 17, 1.7, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createBearSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 88;
        canvas.height = 82;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#7a4a2a';
        ctx.beginPath();
        ctx.ellipse(44, 50, 25, 21, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(44, 27, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(34, 16, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(54, 16, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d5ab7d';
        ctx.beginPath();
        ctx.ellipse(44, 33, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1f1f1f';
        ctx.beginPath();
        ctx.arc(40, 26, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(48, 26, 1.8, 0, Math.PI * 2);
        ctx.fill();

        [30, 41, 52].forEach((x) => {
            ctx.fillStyle = '#7a4a2a';
            ctx.beginPath();
            ctx.roundRect(x, 63, 8, 15, 3);
            ctx.fill();
        });

        return canvas;
    }

    createOwlSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 82;
        canvas.height = 92;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#8a5d3a';
        ctx.beginPath();
        ctx.ellipse(41, 53, 21, 27, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(41, 30, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f4e7cd';
        ctx.beginPath();
        ctx.arc(33, 29, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(49, 29, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1f1f1f';
        ctx.beginPath();
        ctx.arc(33, 29, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(49, 29, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f4c34f';
        ctx.beginPath();
        ctx.moveTo(41, 36);
        ctx.lineTo(35, 41);
        ctx.lineTo(47, 41);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6b4328';
        ctx.beginPath();
        ctx.moveTo(25, 51);
        ctx.lineTo(16, 60);
        ctx.lineTo(28, 64);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(57, 51);
        ctx.lineTo(66, 60);
        ctx.lineTo(54, 64);
        ctx.closePath();
        ctx.fill();

        return canvas;
    }

    createDragonSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 118;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#5f6f7f';
        ctx.beginPath();
        ctx.moveTo(18, 56);
        ctx.quadraticCurveTo(42, 35, 73, 42);
        ctx.quadraticCurveTo(89, 45, 99, 59);
        ctx.quadraticCurveTo(81, 64, 70, 74);
        ctx.quadraticCurveTo(41, 81, 18, 58);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(62, 40);
        ctx.lineTo(52, 16);
        ctx.lineTo(73, 30);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(78, 43);
        ctx.lineTo(72, 20);
        ctx.lineTo(92, 34);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(21, 55);
        ctx.quadraticCurveTo(5, 47, 11, 35);
        ctx.quadraticCurveTo(18, 44, 28, 45);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a8a99';
        ctx.beginPath();
        ctx.ellipse(86, 56, 15, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f4cf66';
        ctx.beginPath();
        ctx.arc(90, 53, 2.2, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createEarthwormSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 28;
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = '#b56576';
        ctx.lineWidth = 9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(8, 18);
        ctx.bezierCurveTo(20, 8, 44, 26, 56, 14);
        ctx.stroke();

        return canvas;
    }

    createCaterpillarSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 70;
        canvas.height = 34;
        const ctx = canvas.getContext('2d');

        const colors = ['#7fbf49', '#74b141', '#6aa73a', '#5f9c34', '#558f2d'];
        colors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(14 + i * 11, 20, 8, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = '#1f1f1f';
        ctx.beginPath();
        ctx.arc(12, 18, 1.2, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createButterflySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 66;
        canvas.height = 56;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fd84a6';
        ctx.beginPath();
        ctx.ellipse(20, 18, 11, 14, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(46, 18, 11, 14, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f9b74e';
        ctx.beginPath();
        ctx.ellipse(18, 37, 10, 11, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(48, 37, 10, 11, -0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.roundRect(30, 14, 6, 27, 3);
        ctx.fill();

        return canvas;
    }

    createFrogSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 70;
        canvas.height = 58;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#66b34f';
        ctx.beginPath();
        ctx.ellipse(35, 35, 19, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(25, 22, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(45, 22, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f5f8f5';
        ctx.beginPath();
        ctx.arc(25, 22, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(45, 22, 3, 0, Math.PI * 2);
        ctx.fill();

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
            image: this.assets[type] || this.createFallbackSprite(type),
            visible: true,
            animationFrame: 0,
            animationSpeed: 0.1,
            velocity: { x: 0, y: 0 },
            tintColor: null, // Color tinting support
            
            update: function(deltaTime) {
                this.x += this.velocity.x * deltaTime / 1000;
                this.y += this.velocity.y * deltaTime / 1000;
                this.animationFrame += this.animationSpeed * deltaTime / 1000;
            },
            
            render: function(ctx) {
                if (this.visible && this.image) {
                    ctx.save();
                    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                    
                    // Draw the original sprite
                    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
                    
                    // Apply color tinting if specified
                    if (this.tintColor) {
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.fillStyle = this.tintColor;
                        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
                        ctx.globalCompositeOperation = 'source-over'; // Reset to default
                    }
                    
                    ctx.restore();
                }
            }
        };
        
        return sprite;
    }

    createFallbackSprite(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#9eb4c8';
        ctx.beginPath();
        ctx.arc(32, 32, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1f354a';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((type || '?').slice(0, 2).toUpperCase(), 32, 34);

        return canvas;
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