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

        // body
        ctx.fillStyle = '#f3efe7';
        ctx.beginPath();
        ctx.ellipse(36, 47, 17, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // ears (outer)
        ctx.fillStyle = '#f6f1ea';
        ctx.beginPath();
        ctx.ellipse(29, 14, 6, 13, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(43, 14, 6, 13, 0.15, 0, Math.PI * 2);
        ctx.fill();

        // ears (inner pink)
        ctx.fillStyle = '#ffd7e5';
        ctx.beginPath();
        ctx.ellipse(29, 14, 2.5, 8, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(43, 14, 2.5, 8, 0.15, 0, Math.PI * 2);
        ctx.fill();

        // head
        ctx.fillStyle = '#f3efe7';
        ctx.beginPath();
        ctx.arc(36, 29, 14, 0, Math.PI * 2);
        ctx.fill();

        // eyes (white)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(31, 26, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(41, 26, 3, 0, Math.PI * 2);
        ctx.fill();

        // pupils
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(31.5, 26.5, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(41.5, 26.5, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(32.3, 25.8, 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(42.3, 25.8, 0.6, 0, Math.PI * 2);
        ctx.fill();

        // nose
        ctx.fillStyle = '#e7829a';
        ctx.beginPath();
        ctx.ellipse(36, 32, 2.8, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // mouth
        ctx.strokeStyle = '#c4607a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(36, 34);
        ctx.quadraticCurveTo(33, 36.5, 31, 35);
        ctx.moveTo(36, 34);
        ctx.quadraticCurveTo(39, 36.5, 41, 35);
        ctx.stroke();

        // fluffy tail hint
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(36, 58, 5, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createPenguinSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');

        // body
        ctx.fillStyle = '#1b2638';
        ctx.beginPath();
        ctx.ellipse(32, 44, 18, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        // white belly
        ctx.fillStyle = '#f2f6fb';
        ctx.beginPath();
        ctx.ellipse(32, 48, 10, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // flippers
        ctx.fillStyle = '#1b2638';
        ctx.beginPath();
        ctx.ellipse(17, 46, 5, 13, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(47, 46, 5, 13, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // head
        ctx.fillStyle = '#1b2638';
        ctx.beginPath();
        ctx.arc(32, 22, 12, 0, Math.PI * 2);
        ctx.fill();

        // beak
        ctx.fillStyle = '#f6c451';
        ctx.beginPath();
        ctx.moveTo(32, 24);
        ctx.lineTo(26, 28);
        ctx.lineTo(38, 28);
        ctx.closePath();
        ctx.fill();

        // eyes (white circles)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(27, 19, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(37, 19, 3, 0, Math.PI * 2);
        ctx.fill();

        // pupils
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(27.4, 19.4, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(37.4, 19.4, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(28, 18.8, 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(38, 18.8, 0.6, 0, Math.PI * 2);
        ctx.fill();

        // feet
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

        // body
        ctx.beginPath();
        ctx.ellipse(62, 48, 33, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // ears
        ctx.beginPath();
        ctx.ellipse(32, 34, 16, 14, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(48, 32, 13, 12, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // head
        ctx.beginPath();
        ctx.ellipse(40, 40, 13, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // trunk
        ctx.beginPath();
        ctx.moveTo(28, 44);
        ctx.quadraticCurveTo(14, 57, 22, 74);
        ctx.quadraticCurveTo(25, 77, 28, 74);
        ctx.quadraticCurveTo(22, 60, 36, 49);
        ctx.closePath();
        ctx.fill();

        // legs
        [43, 57, 71, 85].forEach((x) => {
            ctx.beginPath();
            ctx.roundRect(x, 63, 10, 19, 4);
            ctx.fill();
        });

        // tusk
        ctx.fillStyle = '#f4edcb';
        ctx.beginPath();
        ctx.moveTo(28, 46);
        ctx.quadraticCurveTo(14, 52, 16, 60);
        ctx.quadraticCurveTo(18, 65, 22, 62);
        ctx.quadraticCurveTo(20, 57, 30, 50);
        ctx.closePath();
        ctx.fill();

        // ear inner (pink)
        ctx.fillStyle = '#b0a0a8';
        ctx.beginPath();
        ctx.ellipse(32, 35, 9, 8, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // eye white
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(35, 37, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // pupil
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(35.3, 37.2, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // highlight
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(35.8, 36.7, 0.5, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createMonkeySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 74;
        canvas.height = 86;
        const ctx = canvas.getContext('2d');

        // body
        ctx.fillStyle = '#7a4a2a';
        ctx.beginPath();
        ctx.ellipse(37, 50, 16, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // head
        ctx.beginPath();
        ctx.arc(37, 28, 13, 0, Math.PI * 2);
        ctx.fill();

        // muzzle
        ctx.fillStyle = '#d8b28a';
        ctx.beginPath();
        ctx.ellipse(37, 33, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // ears
        ctx.fillStyle = '#7a4a2a';
        ctx.beginPath();
        ctx.ellipse(21, 30, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(53, 30, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // inner ears
        ctx.fillStyle = '#d8b28a';
        ctx.beginPath();
        ctx.ellipse(21, 30, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(53, 30, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // arms & legs
        ctx.fillStyle = '#7a4a2a';
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

        // tail
        ctx.strokeStyle = '#7a4a2a';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(55, 54);
        ctx.quadraticCurveTo(68, 38, 61, 24);
        ctx.stroke();

        // eyes (white)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(32, 25, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(42, 25, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // pupils
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(32.3, 25.3, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(42.3, 25.3, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(33, 24.8, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(43, 24.8, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // nose dots
        ctx.fillStyle = '#5a2e10';
        ctx.beginPath();
        ctx.arc(35, 33, 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(39, 33, 1.1, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createLionSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 78;
        const ctx = canvas.getContext('2d');

        // mane
        ctx.fillStyle = '#c27f38';
        ctx.beginPath();
        ctx.arc(32, 30, 17, 0, Math.PI * 2);
        ctx.fill();

        // face
        ctx.fillStyle = '#d8a653';
        ctx.beginPath();
        ctx.arc(32, 30, 11, 0, Math.PI * 2);
        ctx.fill();

        // muzzle
        ctx.fillStyle = '#e8bb74';
        ctx.beginPath();
        ctx.ellipse(32, 34, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // body
        ctx.fillStyle = '#d8a653';
        ctx.beginPath();
        ctx.ellipse(55, 47, 26, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // legs
        [42, 53, 63, 74].forEach((x) => {
            ctx.beginPath();
            ctx.roundRect(x, 56, 7, 15, 3);
            ctx.fill();
        });

        // tail
        ctx.strokeStyle = '#c27f38';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(78, 47);
        ctx.quadraticCurveTo(90, 40, 86, 27);
        ctx.stroke();

        // tail tuft
        ctx.fillStyle = '#8b4c10';
        ctx.beginPath();
        ctx.arc(86, 27, 5, 0, Math.PI * 2);
        ctx.fill();

        // eyes (white)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(28, 28, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(36, 28, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // pupils
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(28.3, 28.3, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(36.3, 28.3, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(28.9, 27.8, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(36.9, 27.8, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // nose
        ctx.fillStyle = '#8b4c10';
        ctx.beginPath();
        ctx.arc(32, 33, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // whisker dots
        ctx.fillStyle = '#8b4c10';
        [27, 30, 34, 37].forEach(x => {
            ctx.beginPath();
            ctx.arc(x, 36, 0.7, 0, Math.PI * 2);
            ctx.fill();
        });

        return canvas;
    }

    createDolphinSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 92;
        canvas.height = 58;
        const ctx = canvas.getContext('2d');

        // body
        ctx.fillStyle = '#6aaed4';
        ctx.beginPath();
        ctx.moveTo(10, 32);
        ctx.quadraticCurveTo(36, 12, 64, 24);
        ctx.quadraticCurveTo(74, 30, 82, 27);
        ctx.quadraticCurveTo(78, 34, 82, 42);
        ctx.quadraticCurveTo(72, 39, 62, 44);
        ctx.quadraticCurveTo(35, 53, 10, 34);
        ctx.closePath();
        ctx.fill();

        // dorsal fin
        ctx.beginPath();
        ctx.moveTo(48, 22);
        ctx.lineTo(58, 7);
        ctx.lineTo(66, 22);
        ctx.closePath();
        ctx.fill();

        // tail flukes
        ctx.beginPath();
        ctx.moveTo(12, 33);
        ctx.quadraticCurveTo(4, 25, 8, 18);
        ctx.quadraticCurveTo(14, 26, 18, 32);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(12, 33);
        ctx.quadraticCurveTo(4, 40, 8, 48);
        ctx.quadraticCurveTo(14, 41, 18, 34);
        ctx.closePath();
        ctx.fill();

        // white belly
        ctx.fillStyle = '#e8f6ff';
        ctx.beginPath();
        ctx.ellipse(48, 34, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // snout highlight
        ctx.fillStyle = '#f4fbff';
        ctx.beginPath();
        ctx.ellipse(76, 29, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // eye white
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(68, 24, 3, 0, Math.PI * 2);
        ctx.fill();

        // pupil
        ctx.fillStyle = '#1c3147';
        ctx.beginPath();
        ctx.arc(68.3, 24.2, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // eye highlight
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(69, 23.7, 0.6, 0, Math.PI * 2);
        ctx.fill();

        // smile line
        ctx.strokeStyle = '#4a8aaf';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(72, 30);
        ctx.quadraticCurveTo(79, 33, 83, 31);
        ctx.stroke();

        return canvas;
    }

    createGiraffeSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 74;
        canvas.height = 126;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#e0aa54';

        // body
        ctx.beginPath();
        ctx.ellipse(37, 86, 19, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // neck
        ctx.beginPath();
        ctx.roundRect(32, 25, 10, 55, 5);
        ctx.fill();

        // head
        ctx.beginPath();
        ctx.ellipse(37, 18, 14, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // legs
        [22, 31, 43, 52].forEach((x) => {
            ctx.beginPath();
            ctx.roundRect(x, 102, 7, 20, 3);
            ctx.fill();
        });

        // ossicones (horns)
        ctx.fillStyle = '#c17a30';
        ctx.beginPath();
        ctx.roundRect(30, 6, 4, 11, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(40, 6, 4, 11, 2);
        ctx.fill();
        // ossicone tips
        ctx.fillStyle = '#3a2010';
        ctx.beginPath();
        ctx.arc(32, 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(42, 6, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // spots
        ctx.fillStyle = '#9a632b';
        [[28, 90], [45, 78], [34, 68], [40, 50], [33, 34], [24, 82], [46, 96], [30, 105]].forEach((spot) => {
            ctx.beginPath();
            ctx.ellipse(spot[0], spot[1], 4, 3.5, 0.4, 0, Math.PI * 2);
            ctx.fill();
        });

        // eye white
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(32, 16, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(42, 16, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // pupils
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(32.2, 16.2, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(42.2, 16.2, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(32.8, 15.8, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(42.8, 15.8, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // nostrils
        ctx.fillStyle = '#9a632b';
        ctx.beginPath();
        ctx.arc(34, 22, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(40, 22, 1, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createBearSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 88;
        canvas.height = 82;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#7a4a2a';

        // body
        ctx.beginPath();
        ctx.ellipse(44, 50, 25, 21, 0, 0, Math.PI * 2);
        ctx.fill();

        // head
        ctx.beginPath();
        ctx.arc(44, 27, 16, 0, Math.PI * 2);
        ctx.fill();

        // ears (outer)
        ctx.beginPath();
        ctx.arc(30, 14, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(58, 14, 7, 0, Math.PI * 2);
        ctx.fill();

        // inner ears
        ctx.fillStyle = '#d5a070';
        ctx.beginPath();
        ctx.arc(30, 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(58, 14, 4, 0, Math.PI * 2);
        ctx.fill();

        // muzzle
        ctx.fillStyle = '#d5ab7d';
        ctx.beginPath();
        ctx.ellipse(44, 33, 9, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // paws/legs
        ctx.fillStyle = '#7a4a2a';
        [28, 40, 52].forEach((x) => {
            ctx.beginPath();
            ctx.roundRect(x, 63, 8, 15, 3);
            ctx.fill();
        });

        // eye whites
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(39, 25, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(49, 25, 3, 0, Math.PI * 2);
        ctx.fill();

        // pupils
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(39.3, 25.3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(49.3, 25.3, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(40, 24.8, 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(50, 24.8, 0.6, 0, Math.PI * 2);
        ctx.fill();

        // nose
        ctx.fillStyle = '#3a1a0a';
        ctx.beginPath();
        ctx.ellipse(44, 31, 3.5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // mouth
        ctx.strokeStyle = '#5a2e10';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(44, 33.5);
        ctx.quadraticCurveTo(41, 36, 39, 35);
        ctx.moveTo(44, 33.5);
        ctx.quadraticCurveTo(47, 36, 49, 35);
        ctx.stroke();

        return canvas;
    }

    createOwlSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 82;
        canvas.height = 92;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#8a5d3a';

        // body
        ctx.beginPath();
        ctx.ellipse(41, 55, 21, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // head
        ctx.beginPath();
        ctx.arc(41, 30, 18, 0, Math.PI * 2);
        ctx.fill();

        // ear tufts
        ctx.beginPath();
        ctx.moveTo(27, 16);
        ctx.lineTo(24, 8);
        ctx.lineTo(32, 14);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(55, 16);
        ctx.lineTo(58, 8);
        ctx.lineTo(50, 14);
        ctx.closePath();
        ctx.fill();

        // wings
        ctx.fillStyle = '#6b4328';
        ctx.beginPath();
        ctx.moveTo(23, 49);
        ctx.lineTo(14, 60);
        ctx.lineTo(26, 66);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(59, 49);
        ctx.lineTo(68, 60);
        ctx.lineTo(56, 66);
        ctx.closePath();
        ctx.fill();

        // chest lighter feathers
        ctx.fillStyle = '#c49970';
        ctx.beginPath();
        ctx.ellipse(41, 58, 12, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // facial disc
        ctx.fillStyle = '#f0ddb8';
        ctx.beginPath();
        ctx.arc(33, 29, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(49, 29, 8, 0, Math.PI * 2);
        ctx.fill();

        // pupils (large owl eyes)
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(33, 29, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(49, 29, 4, 0, Math.PI * 2);
        ctx.fill();

        // orange iris rim
        ctx.strokeStyle = '#e8a830';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(33, 29, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(49, 29, 5, 0, Math.PI * 2);
        ctx.stroke();

        // eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(34.5, 27.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(50.5, 27.5, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // beak
        ctx.fillStyle = '#dfc060';
        ctx.beginPath();
        ctx.moveTo(41, 34);
        ctx.lineTo(37, 39);
        ctx.lineTo(45, 39);
        ctx.closePath();
        ctx.fill();

        // talons
        ctx.fillStyle = '#6b4328';
        ctx.beginPath();
        ctx.roundRect(30, 79, 5, 9, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(37, 79, 5, 9, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(44, 79, 5, 9, 2);
        ctx.fill();

        return canvas;
    }

    createDragonSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 118;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');

        // body
        ctx.fillStyle = '#4a7a5a';
        ctx.beginPath();
        ctx.moveTo(18, 56);
        ctx.quadraticCurveTo(42, 34, 73, 42);
        ctx.quadraticCurveTo(89, 46, 98, 58);
        ctx.quadraticCurveTo(82, 64, 72, 74);
        ctx.quadraticCurveTo(42, 82, 18, 58);
        ctx.closePath();
        ctx.fill();

        // wing (left)
        ctx.fillStyle = '#3a5a48';
        ctx.beginPath();
        ctx.moveTo(55, 42);
        ctx.lineTo(42, 14);
        ctx.lineTo(68, 30);
        ctx.closePath();
        ctx.fill();
        // wing membrane
        ctx.fillStyle = '#6aaa8a';
        ctx.beginPath();
        ctx.moveTo(55, 43);
        ctx.lineTo(44, 18);
        ctx.lineTo(66, 32);
        ctx.closePath();
        ctx.fill();

        // wing (right)
        ctx.fillStyle = '#3a5a48';
        ctx.beginPath();
        ctx.moveTo(72, 44);
        ctx.lineTo(68, 18);
        ctx.lineTo(88, 34);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#6aaa8a';
        ctx.beginPath();
        ctx.moveTo(72, 45);
        ctx.lineTo(70, 21);
        ctx.lineTo(86, 36);
        ctx.closePath();
        ctx.fill();

        // tail
        ctx.fillStyle = '#4a7a5a';
        ctx.beginPath();
        ctx.moveTo(22, 55);
        ctx.quadraticCurveTo(5, 46, 10, 34);
        ctx.quadraticCurveTo(16, 43, 27, 45);
        ctx.closePath();
        ctx.fill();

        // tail spikes
        ctx.fillStyle = '#2a5a3a';
        ctx.beginPath();
        ctx.moveTo(10, 34);
        ctx.lineTo(5, 26);
        ctx.lineTo(14, 30);
        ctx.closePath();
        ctx.fill();

        // head
        ctx.fillStyle = '#5a8a6a';
        ctx.beginPath();
        ctx.ellipse(90, 54, 16, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // snout
        ctx.fillStyle = '#4a7a5a';
        ctx.beginPath();
        ctx.ellipse(103, 56, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // nostril
        ctx.fillStyle = '#2a4a32';
        ctx.beginPath();
        ctx.arc(105, 54, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // back spines
        ctx.fillStyle = '#2a5a3a';
        [35, 45, 55, 65, 75].forEach((x) => {
            const y = 52 - (x < 55 ? x - 35 : 75 - x) * 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 3, y - 8);
            ctx.lineTo(x + 3, y - 8);
            ctx.closePath();
            ctx.fill();
        });

        // eye white
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(92, 50, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // slit pupil
        ctx.fillStyle = '#f4cf44';
        ctx.beginPath();
        ctx.arc(92, 50, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a2a1e';
        ctx.beginPath();
        ctx.ellipse(92, 50, 1, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // eye highlight
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(93, 49, 0.7, 0, Math.PI * 2);
        ctx.fill();

        // fire breath
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath();
        ctx.moveTo(108, 56);
        ctx.quadraticCurveTo(116, 52, 115, 58);
        ctx.quadraticCurveTo(116, 62, 110, 60);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffdf00';
        ctx.beginPath();
        ctx.moveTo(108, 57);
        ctx.quadraticCurveTo(113, 54, 112, 58);
        ctx.quadraticCurveTo(113, 61, 109, 59);
        ctx.closePath();
        ctx.fill();

        return canvas;
    }

    createEarthwormSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 68;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // body segments
        const segColors = ['#c56880', '#b85870', '#c56880', '#b85870', '#c56880', '#b85870'];
        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = segColors[i];
            const t = i / 5;
            const cx = 10 + i * 9;
            const cy = 16 + Math.sin(t * Math.PI * 1.5) * 5;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 8, 6, Math.sin(t * 2) * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        // head
        ctx.fillStyle = '#d87890';
        ctx.beginPath();
        ctx.ellipse(57, 13, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // eye
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(60, 11, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // eye highlight
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(60.6, 10.5, 0.5, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createCaterpillarSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 76;
        canvas.height = 42;
        const ctx = canvas.getContext('2d');

        // tiny legs
        ctx.strokeStyle = '#3a7a18';
        ctx.lineWidth = 1.5;
        for (let i = 1; i < 5; i++) {
            const x = 16 + i * 11;
            ctx.beginPath(); ctx.moveTo(x - 3, 26); ctx.lineTo(x - 7, 34); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + 3, 26); ctx.lineTo(x + 7, 34); ctx.stroke();
        }

        // body segments (draw on top of legs)
        const colors = ['#8fd459', '#80c44a', '#71b33b', '#64a42e', '#559522'];
        colors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(16 + i * 11, 22, 9, 0, Math.PI * 2);
            ctx.fill();
            // segment line
            if (i < 4) {
                ctx.strokeStyle = '#3a7a18';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(16 + i * 11, 22, 9, -0.4, 0.4);
                ctx.stroke();
            }
        });

        // head (first = rightmost)
        ctx.fillStyle = '#8fd459';
        ctx.beginPath();
        ctx.arc(16, 22, 10, 0, Math.PI * 2);
        ctx.fill();

        // antennae
        ctx.strokeStyle = '#3a7a18';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(12, 14); ctx.lineTo(8, 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, 14); ctx.lineTo(22, 5); ctx.stroke();
        ctx.fillStyle = '#ff6688';
        ctx.beginPath(); ctx.arc(8, 5.5, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(22, 4.5, 2, 0, Math.PI * 2); ctx.fill();

        // eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(12, 20, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(12.3, 20.3, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(13, 19.7, 0.6, 0, Math.PI * 2);
        ctx.fill();

        // smile
        ctx.strokeStyle = '#3a7a18';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(16, 23, 5, 0.2, Math.PI - 0.2);
        ctx.stroke();

        return canvas;
    }

    createButterflySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 72;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');

        // upper wings
        ctx.fillStyle = '#fd84a6';
        ctx.beginPath();
        ctx.ellipse(18, 18, 13, 15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(54, 18, 13, 15, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // lower wings
        ctx.fillStyle = '#f9a430';
        ctx.beginPath();
        ctx.ellipse(16, 38, 12, 12, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(56, 38, 12, 12, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // wing markings (upper)
        ctx.fillStyle = '#ff4d8a';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(16, 16, 6, 8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(56, 16, 6, 8, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // wing spots
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(12, 10, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 10, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath(); ctx.arc(22, 34, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(50, 34, 2, 0, Math.PI * 2); ctx.fill();

        // body
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.roundRect(32, 12, 8, 32, 4);
        ctx.fill();

        // head
        ctx.beginPath();
        ctx.arc(36, 10, 5, 0, Math.PI * 2);
        ctx.fill();

        // antennae
        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(33, 7); ctx.quadraticCurveTo(26, 2, 22, -2 + 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(39, 7); ctx.quadraticCurveTo(46, 2, 50, 4); ctx.stroke();
        ctx.fillStyle = '#fd84a6';
        ctx.beginPath(); ctx.arc(22, 4, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(50, 4, 2.5, 0, Math.PI * 2); ctx.fill();

        // eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(34, 9, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38, 9, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath(); ctx.arc(34.2, 9.2, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38.2, 9.2, 0.8, 0, Math.PI * 2); ctx.fill();

        return canvas;
    }

    createFrogSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 72;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#55aa3a';

        // back legs
        ctx.beginPath();
        ctx.ellipse(16, 46, 12, 6, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(56, 46, 12, 6, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // body
        ctx.beginPath();
        ctx.ellipse(36, 36, 20, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // belly lighter
        ctx.fillStyle = '#a8e080';
        ctx.beginPath();
        ctx.ellipse(36, 38, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // front feet
        ctx.fillStyle = '#55aa3a';
        ctx.beginPath();
        ctx.ellipse(18, 42, 7, 4, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(54, 42, 7, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // eye bumps
        ctx.beginPath();
        ctx.arc(25, 22, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(47, 22, 9, 0, Math.PI * 2);
        ctx.fill();

        // eye whites
        ctx.fillStyle = '#f5f8e8';
        ctx.beginPath();
        ctx.arc(25, 22, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(47, 22, 6, 0, Math.PI * 2);
        ctx.fill();

        // pupils (horizontal slit)
        ctx.fillStyle = '#1a2e10';
        ctx.beginPath();
        ctx.ellipse(25, 22, 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(47, 22, 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(26.5, 20.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(48.5, 20.5, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // smile
        ctx.strokeStyle = '#3a8a22';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(36, 33, 9, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // webbed toes hint
        ctx.fillStyle = '#3a8a22';
        [12, 16, 20, 52, 56, 60].forEach(x => {
            ctx.beginPath();
            ctx.arc(x, 50, 2, 0, Math.PI * 2);
            ctx.fill();
        });

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