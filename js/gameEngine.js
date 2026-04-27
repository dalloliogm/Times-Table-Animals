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
        // Create sprite assets using canvas
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
        canvas.height = 70;
        const ctx = canvas.getContext('2d');

        // Tail
        ctx.fillStyle = '#EEE8D5';
        ctx.beginPath();
        ctx.arc(42, 52, 7, 0, Math.PI * 2);
        ctx.fill();

        // Body (oval)
        ctx.fillStyle = '#F5F5DC';
        ctx.beginPath();
        ctx.ellipse(26, 50, 17, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left ear
        ctx.fillStyle = '#F5F5DC';
        ctx.beginPath();
        ctx.ellipse(18, 15, 5, 14, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.ellipse(18, 15, 3, 10, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Right ear
        ctx.fillStyle = '#F5F5DC';
        ctx.beginPath();
        ctx.ellipse(30, 13, 5, 14, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.ellipse(30, 13, 3, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#F5F5DC';
        ctx.beginPath();
        ctx.arc(24, 32, 12, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#CC3366';
        ctx.beginPath();
        ctx.arc(20, 29, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(29, 29, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(20, 29, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(29, 29, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Eye shine
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(21, 28, 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 28, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#FF8C94';
        ctx.beginPath();
        ctx.ellipse(24, 34, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Mouth
        ctx.strokeStyle = '#CC6677';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(22, 36);
        ctx.quadraticCurveTo(24, 38, 26, 36);
        ctx.stroke();

        // Front legs
        ctx.fillStyle = '#F0EDD5';
        ctx.beginPath();
        ctx.ellipse(18, 62, 5, 8, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(34, 62, 5, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createPenguinSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 56;
        canvas.height = 72;
        const ctx = canvas.getContext('2d');

        // Body
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.ellipse(28, 46, 18, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        // White belly
        ctx.fillStyle = '#f8f8f8';
        ctx.beginPath();
        ctx.ellipse(28, 48, 12, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(28, 20, 14, 0, Math.PI * 2);
        ctx.fill();

        // White face patch
        ctx.fillStyle = '#f8f8f8';
        ctx.beginPath();
        ctx.ellipse(28, 22, 9, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(24, 17, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(32, 17, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(25, 16, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(33, 16, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(25, 23);
        ctx.lineTo(31, 23);
        ctx.lineTo(28, 28);
        ctx.closePath();
        ctx.fill();

        // Wings
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.ellipse(10, 46, 7, 16, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(46, 46, 7, 16, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Feet
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.ellipse(21, 68, 7, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(35, 68, 7, 4, 0.3, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createElephantSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');

        // Body
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.ellipse(55, 55, 35, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Large ear (left)
        ctx.fillStyle = '#BDBDBD';
        ctx.beginPath();
        ctx.ellipse(22, 38, 18, 22, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#E9C3B0';
        ctx.beginPath();
        ctx.ellipse(22, 38, 12, 15, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.ellipse(38, 34, 20, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Trunk
        ctx.strokeStyle = '#9E9E9E';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(28, 42);
        ctx.bezierCurveTo(14, 50, 10, 65, 22, 72);
        ctx.stroke();
        // Trunk tip
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.arc(22, 72, 5, 0, Math.PI * 2);
        ctx.fill();

        // Tusk
        ctx.strokeStyle = '#FFFDE7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(26, 48);
        ctx.quadraticCurveTo(14, 58, 18, 66);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(33, 27, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(34, 26, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillStyle = '#8E8E8E';
        ctx.beginPath(); ctx.ellipse(36, 78, 8, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(50, 80, 8, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(64, 80, 8, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 78, 8, 10, 0, 0, Math.PI * 2); ctx.fill();

        // Tail
        ctx.strokeStyle = '#8E8E8E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(88, 50);
        ctx.quadraticCurveTo(96, 56, 90, 64);
        ctx.stroke();

        return canvas;
    }

    createMonkeySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');

        // Tail
        ctx.strokeStyle = '#6B3A2A';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(44, 60);
        ctx.bezierCurveTo(60, 55, 62, 38, 50, 30);
        ctx.stroke();

        // Body
        ctx.fillStyle = '#7B4A30';
        ctx.beginPath();
        ctx.ellipse(28, 55, 16, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms
        ctx.strokeStyle = '#7B4A30';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(14, 48);
        ctx.bezierCurveTo(4, 52, 2, 62, 8, 68);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(42, 48);
        ctx.bezierCurveTo(54, 50, 56, 60, 52, 66);
        ctx.stroke();
        // Hands
        ctx.fillStyle = '#C4956A';
        ctx.beginPath(); ctx.arc(8, 68, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(52, 66, 5, 0, Math.PI * 2); ctx.fill();

        // Head
        ctx.fillStyle = '#7B4A30';
        ctx.beginPath();
        ctx.arc(28, 28, 16, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath(); ctx.arc(13, 28, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(43, 28, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#C4956A';
        ctx.beginPath(); ctx.arc(13, 28, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(43, 28, 4, 0, Math.PI * 2); ctx.fill();

        // Face disc
        ctx.fillStyle = '#C4956A';
        ctx.beginPath();
        ctx.ellipse(28, 30, 10, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(23, 24, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(33, 24, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(24, 23, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(34, 23, 1, 0, Math.PI * 2); ctx.fill();

        // Nose & mouth
        ctx.fillStyle = '#A0714F';
        ctx.beginPath(); ctx.ellipse(28, 31, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(26, 31, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(30, 31, 1, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#7B4A30';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(25, 35);
        ctx.quadraticCurveTo(28, 38, 31, 35);
        ctx.stroke();

        // Legs
        ctx.fillStyle = '#7B4A30';
        ctx.beginPath(); ctx.ellipse(20, 72, 7, 10, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(36, 72, 7, 10, 0.1, 0, Math.PI * 2); ctx.fill();

        return canvas;
    }

    createLionSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');

        // Body
        ctx.fillStyle = '#D4A843';
        ctx.beginPath();
        ctx.ellipse(55, 52, 28, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.strokeStyle = '#C49020';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(82, 48);
        ctx.bezierCurveTo(92, 42, 94, 32, 86, 28);
        ctx.stroke();
        // Tail tuft
        ctx.fillStyle = '#8B6010';
        ctx.beginPath();
        ctx.arc(86, 26, 6, 0, Math.PI * 2);
        ctx.fill();

        // Mane (layered circles for fluffy effect)
        const maneColor = '#B8751A';
        ctx.fillStyle = maneColor;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
            ctx.beginPath();
            ctx.arc(32 + Math.cos(a) * 18, 34 + Math.sin(a) * 18, 10, 0, Math.PI * 2);
            ctx.fill();
        }
        // Inner mane
        ctx.fillStyle = '#CD9030';
        ctx.beginPath();
        ctx.arc(32, 34, 17, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#E8BC50';
        ctx.beginPath();
        ctx.arc(32, 34, 14, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#4A3000';
        ctx.beginPath(); ctx.arc(26, 30, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38, 30, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#DAA520';
        ctx.beginPath(); ctx.arc(26, 30, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38, 30, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(26, 30, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38, 30, 1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(26.5, 29.3, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38.5, 29.3, 0.7, 0, Math.PI * 2); ctx.fill();

        // Nose
        ctx.fillStyle = '#C06060';
        ctx.beginPath();
        ctx.moveTo(28, 37);
        ctx.lineTo(36, 37);
        ctx.lineTo(32, 41);
        ctx.closePath();
        ctx.fill();
        // Mouth whiskers area
        ctx.fillStyle = '#F0D070';
        ctx.beginPath(); ctx.ellipse(32, 40, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#AAA';
        ctx.lineWidth = 1;
        for (let wx of [-10, -6, 6, 10]) {
            ctx.beginPath();
            ctx.moveTo(32, 40);
            ctx.lineTo(32 + wx, 38 + (wx < 0 ? -2 : -2));
            ctx.stroke();
        }

        // Legs
        ctx.fillStyle = '#C8A030';
        ctx.beginPath(); ctx.ellipse(36, 68, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(50, 68, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(62, 68, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 68, 7, 10, 0, 0, Math.PI * 2); ctx.fill();

        return canvas;
    }

    createDolphinSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');

        // Main body
        ctx.fillStyle = '#4A90C4';
        ctx.beginPath();
        ctx.moveTo(10, 30);
        ctx.bezierCurveTo(20, 14, 68, 14, 80, 30);
        ctx.bezierCurveTo(68, 46, 20, 46, 10, 30);
        ctx.fill();

        // White belly
        ctx.fillStyle = '#E8F4FD';
        ctx.beginPath();
        ctx.ellipse(42, 32, 28, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail flukes
        ctx.fillStyle = '#3A7AB4';
        ctx.beginPath();
        ctx.moveTo(78, 30);
        ctx.bezierCurveTo(82, 20, 90, 16, 88, 22);
        ctx.bezierCurveTo(86, 27, 84, 28, 84, 30);
        ctx.bezierCurveTo(84, 32, 86, 33, 88, 38);
        ctx.bezierCurveTo(90, 44, 82, 40, 78, 30);
        ctx.fill();

        // Dorsal fin
        ctx.fillStyle = '#3A7AB4';
        ctx.beginPath();
        ctx.moveTo(46, 17);
        ctx.bezierCurveTo(50, 8, 58, 6, 58, 18);
        ctx.closePath();
        ctx.fill();

        // Pectoral fin
        ctx.fillStyle = '#3A7AB4';
        ctx.beginPath();
        ctx.moveTo(30, 30);
        ctx.bezierCurveTo(26, 38, 20, 44, 24, 44);
        ctx.bezierCurveTo(30, 44, 34, 36, 36, 30);
        ctx.fill();

        // Snout/beak
        ctx.fillStyle = '#4A90C4';
        ctx.beginPath();
        ctx.moveTo(12, 28);
        ctx.bezierCurveTo(2, 26, 0, 30, 2, 32);
        ctx.bezierCurveTo(4, 34, 12, 32, 12, 30);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = '#1A2A3A';
        ctx.beginPath();
        ctx.arc(18, 24, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(19, 23, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#2A6A9A';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(6, 31);
        ctx.quadraticCurveTo(10, 34, 14, 31);
        ctx.stroke();

        return canvas;
    }

    createGiraffeSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 70;
        canvas.height = 110;
        const ctx = canvas.getContext('2d');

        // Legs
        ctx.fillStyle = '#C8900A';
        ctx.beginPath(); ctx.ellipse(28, 90, 6, 18, -0.05, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(42, 90, 6, 18, 0.05, 0, Math.PI * 2); ctx.fill();
        // Back legs slightly behind
        ctx.fillStyle = '#B8800A';
        ctx.beginPath(); ctx.ellipse(22, 92, 5, 16, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(48, 92, 5, 16, -0.1, 0, Math.PI * 2); ctx.fill();
        // Hooves
        ctx.fillStyle = '#3A2000';
        for (const hx of [22, 28, 42, 48]) {
            ctx.beginPath(); ctx.ellipse(hx, 105, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
        }

        // Body
        ctx.fillStyle = '#E8A820';
        ctx.beginPath();
        ctx.ellipse(35, 72, 22, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Neck
        ctx.fillStyle = '#E8A820';
        ctx.beginPath();
        ctx.moveTo(28, 60);
        ctx.lineTo(32, 20);
        ctx.lineTo(42, 20);
        ctx.lineTo(44, 60);
        ctx.closePath();
        ctx.fill();

        // Spots on body and neck
        ctx.fillStyle = '#9A5500';
        const spots = [[30,68,7,5],[46,74,6,4],[35,82,5,4],[20,74,5,4],[33,44,5,4],[38,34,4,3],[30,55,4,3]];
        for (const [sx,sy,rx,ry] of spots) {
            ctx.beginPath();
            ctx.ellipse(sx, sy, rx, ry, Math.random(), 0, Math.PI * 2);
            ctx.fill();
        }

        // Head
        ctx.fillStyle = '#E8A820';
        ctx.beginPath();
        ctx.ellipse(38, 14, 12, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Ossicones (horns)
        ctx.fillStyle = '#9A5500';
        ctx.beginPath(); ctx.ellipse(33, 7, 2.5, 6, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(43, 6, 2.5, 6, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#4A2800';
        ctx.beginPath(); ctx.arc(33, 4, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(43, 3, 3, 0, Math.PI * 2); ctx.fill();

        // Eye
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(33, 12, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(34, 11, 1.2, 0, Math.PI * 2); ctx.fill();

        // Nostril
        ctx.fillStyle = '#C07010';
        ctx.beginPath(); ctx.ellipse(43, 17, 2, 1.5, 0.3, 0, Math.PI * 2); ctx.fill();

        // Ear
        ctx.fillStyle = '#E8A820';
        ctx.beginPath(); ctx.ellipse(28, 12, 4, 7, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#F0C060';
        ctx.beginPath(); ctx.ellipse(28, 12, 2.5, 5, -0.5, 0, Math.PI * 2); ctx.fill();

        return canvas;
    }

    createBearSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 72;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');

        // Body
        ctx.fillStyle = '#6B3A2A';
        ctx.beginPath();
        ctx.ellipse(36, 54, 26, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.beginPath(); ctx.ellipse(22, 70, 9, 10, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(50, 70, 9, 10, 0.1, 0, Math.PI * 2); ctx.fill();

        // Arms
        ctx.beginPath(); ctx.ellipse(12, 52, 8, 12, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(60, 52, 8, 12, 0.3, 0, Math.PI * 2); ctx.fill();
        // Paws
        ctx.fillStyle = '#4A2818';
        ctx.beginPath(); ctx.arc(10, 62, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(62, 62, 6, 0, Math.PI * 2); ctx.fill();

        // Head
        ctx.fillStyle = '#6B3A2A';
        ctx.beginPath();
        ctx.arc(36, 28, 20, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath(); ctx.arc(18, 12, 9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(54, 12, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8B5040';
        ctx.beginPath(); ctx.arc(18, 12, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(54, 12, 5, 0, Math.PI * 2); ctx.fill();

        // Snout
        ctx.fillStyle = '#8B5040';
        ctx.beginPath();
        ctx.ellipse(36, 34, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#1A0A00';
        ctx.beginPath();
        ctx.ellipse(36, 29, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#1A0A00';
        ctx.beginPath(); ctx.arc(28, 22, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(44, 22, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(29, 21, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(45, 21, 1.5, 0, Math.PI * 2); ctx.fill();

        // Mouth
        ctx.strokeStyle = '#4A1808';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(30, 36);
        ctx.quadraticCurveTo(36, 40, 42, 36);
        ctx.stroke();

        // Belly patch
        ctx.fillStyle = '#9B6050';
        ctx.beginPath();
        ctx.ellipse(36, 56, 14, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createOwlSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');

        // Body (rounded)
        ctx.fillStyle = '#7B5A2A';
        ctx.beginPath();
        ctx.ellipse(32, 52, 22, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wing texture lines
        ctx.strokeStyle = '#5A3A10';
        ctx.lineWidth = 1.2;
        for (let wy = 36; wy < 72; wy += 5) {
            ctx.beginPath();
            ctx.moveTo(10, wy);
            ctx.quadraticCurveTo(32, wy - 3, 54, wy);
            ctx.stroke();
        }

        // Belly
        ctx.fillStyle = '#D4AA70';
        ctx.beginPath();
        ctx.ellipse(32, 55, 14, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        // Belly chevron pattern
        ctx.strokeStyle = '#AA8848';
        ctx.lineWidth = 1.2;
        for (let cy = 44; cy < 70; cy += 5) {
            ctx.beginPath();
            ctx.moveTo(24, cy);
            ctx.lineTo(32, cy - 3);
            ctx.lineTo(40, cy);
            ctx.stroke();
        }

        // Head
        ctx.fillStyle = '#7B5A2A';
        ctx.beginPath();
        ctx.arc(32, 24, 20, 0, Math.PI * 2);
        ctx.fill();

        // Ear tufts
        ctx.fillStyle = '#5A3A10';
        ctx.beginPath();
        ctx.moveTo(18, 8);
        ctx.lineTo(14, 0);
        ctx.lineTo(22, 6);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(46, 8);
        ctx.lineTo(50, 0);
        ctx.lineTo(42, 6);
        ctx.closePath();
        ctx.fill();

        // Facial disc
        ctx.fillStyle = '#D4AA70';
        ctx.beginPath();
        ctx.arc(32, 26, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#AA8848';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(32, 26, 14, 0, Math.PI * 2);
        ctx.stroke();

        // Large eyes
        ctx.fillStyle = '#FFF8DC';
        ctx.beginPath(); ctx.arc(24, 24, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(40, 24, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#F5A000';
        ctx.beginPath(); ctx.arc(24, 24, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(40, 24, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1A0A00';
        ctx.beginPath(); ctx.arc(24, 24, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(40, 24, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(25.5, 22.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(41.5, 22.5, 1.5, 0, Math.PI * 2); ctx.fill();

        // Beak
        ctx.fillStyle = '#C8820A';
        ctx.beginPath();
        ctx.moveTo(28, 30);
        ctx.lineTo(36, 30);
        ctx.lineTo(32, 36);
        ctx.closePath();
        ctx.fill();

        // Talons
        ctx.strokeStyle = '#4A2808';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        for (let tx of [-10, -4, 4, 10]) {
            ctx.beginPath();
            ctx.moveTo(32 + tx * 0.5, 76);
            ctx.lineTo(32 + tx, 80);
            ctx.stroke();
        }

        return canvas;
    }

    createDragonSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');

        // Tail
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(72, 60);
        ctx.bezierCurveTo(86, 56, 90, 44, 82, 36);
        ctx.stroke();
        // Tail spikes
        ctx.fillStyle = '#1B5E20';
        ctx.beginPath(); ctx.moveTo(84, 40); ctx.lineTo(90, 34); ctx.lineTo(88, 44); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 50); ctx.lineTo(92, 46); ctx.lineTo(90, 56); ctx.fill();

        // Body
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.ellipse(46, 58, 26, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly scales
        ctx.fillStyle = '#81C784';
        ctx.beginPath();
        ctx.ellipse(46, 60, 16, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wing (left, back)
        ctx.fillStyle = '#1B5E20';
        ctx.beginPath();
        ctx.moveTo(30, 50);
        ctx.bezierCurveTo(14, 30, 4, 20, 16, 16);
        ctx.bezierCurveTo(22, 14, 26, 28, 30, 40);
        ctx.closePath();
        ctx.fill();
        // Wing membrane lines
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(30, 46); ctx.lineTo(10, 22); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30, 42); ctx.lineTo(18, 18); ctx.stroke();

        // Wing (right, front)
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.moveTo(62, 50);
        ctx.bezierCurveTo(78, 28, 88, 16, 76, 14);
        ctx.bezierCurveTo(70, 12, 64, 28, 62, 42);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(62, 46); ctx.lineTo(82, 22); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(62, 42); ctx.lineTo(74, 18); ctx.stroke();

        // Neck
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.moveTo(30, 44);
        ctx.lineTo(24, 26);
        ctx.lineTo(36, 24);
        ctx.lineTo(40, 44);
        ctx.closePath();
        ctx.fill();

        // Head
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.ellipse(30, 20, 16, 12, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.beginPath();
        ctx.ellipse(18, 22, 9, 7, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Horns
        ctx.fillStyle = '#1B5E20';
        ctx.beginPath(); ctx.moveTo(26, 10); ctx.lineTo(20, 2); ctx.lineTo(30, 8); ctx.fill();
        ctx.beginPath(); ctx.moveTo(36, 9); ctx.lineTo(34, 1); ctx.lineTo(42, 8); ctx.fill();

        // Nostril
        ctx.fillStyle = '#FF6600';
        ctx.beginPath(); ctx.arc(14, 22, 3, 0, Math.PI * 2); ctx.fill();
        // Fire breath hint
        ctx.fillStyle = 'rgba(255,100,0,0.6)';
        ctx.beginPath(); ctx.arc(8, 22, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,220,0,0.6)';
        ctx.beginPath(); ctx.arc(4, 21, 3, 0, Math.PI * 2); ctx.fill();

        // Eye
        ctx.fillStyle = '#FFEE00';
        ctx.beginPath(); ctx.arc(28, 16, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1A0A00';
        ctx.beginPath();
        ctx.ellipse(28, 16, 2, 4, 0, 0, Math.PI * 2); // slit pupil
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(29.5, 14.5, 1.2, 0, Math.PI * 2); ctx.fill();

        // Teeth
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(14, 24); ctx.lineTo(12, 28); ctx.lineTo(16, 26); ctx.fill();
        ctx.beginPath(); ctx.moveTo(18, 25); ctx.lineTo(17, 29); ctx.lineTo(21, 27); ctx.fill();

        // Legs
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath(); ctx.ellipse(34, 74, 7, 10, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(58, 74, 7, 10, 0.1, 0, Math.PI * 2); ctx.fill();
        // Claws
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (let cx of [-6, -2, 2, 6]) {
            ctx.beginPath(); ctx.moveTo(34 + cx * 0.5, 82); ctx.lineTo(34 + cx, 87); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(58 + cx * 0.5, 82); ctx.lineTo(58 + cx, 87); ctx.stroke();
        }

        return canvas;
    }

    createCarrotSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 44;
        const ctx = canvas.getContext('2d');

        // Carrot body
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(12, 40);
        ctx.bezierCurveTo(6, 38, 4, 24, 6, 14);
        ctx.lineTo(18, 14);
        ctx.bezierCurveTo(20, 24, 18, 38, 12, 40);
        ctx.fill();
        // Carrot lines
        ctx.strokeStyle = '#E07000';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(10, 18); ctx.quadraticCurveTo(12, 30, 10, 38); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(14, 18); ctx.quadraticCurveTo(15, 28, 14, 36); ctx.stroke();

        // Leafy top
        ctx.fillStyle = '#2E8B0A';
        ctx.beginPath();
        ctx.moveTo(12, 14);
        ctx.bezierCurveTo(8, 6, 2, 4, 6, 2);
        ctx.bezierCurveTo(9, 0, 12, 8, 12, 12);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(12, 14);
        ctx.bezierCurveTo(12, 6, 18, 2, 20, 4);
        ctx.bezierCurveTo(22, 6, 16, 10, 12, 14);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(12, 14);
        ctx.bezierCurveTo(8, 8, 6, 2, 10, 4);
        ctx.bezierCurveTo(12, 5, 12, 10, 12, 14);
        ctx.fill();

        return canvas;
    }

    createFishSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');

        // Tail
        ctx.fillStyle = '#2255CC';
        ctx.beginPath();
        ctx.moveTo(26, 12);
        ctx.lineTo(36, 4);
        ctx.lineTo(36, 20);
        ctx.closePath();
        ctx.fill();

        // Body
        ctx.fillStyle = '#4488EE';
        ctx.beginPath();
        ctx.ellipse(15, 12, 13, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = '#88BBFF';
        ctx.beginPath();
        ctx.ellipse(14, 14, 9, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dorsal fin
        ctx.fillStyle = '#2255CC';
        ctx.beginPath();
        ctx.moveTo(10, 5);
        ctx.bezierCurveTo(14, 0, 20, 2, 22, 6);
        ctx.closePath();
        ctx.fill();

        // Scales suggestion
        ctx.strokeStyle = '#2255AA';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(14, 12, 5, -Math.PI*0.7, Math.PI*0.3); ctx.stroke();
        ctx.beginPath(); ctx.arc(20, 12, 5, -Math.PI*0.7, Math.PI*0.3); ctx.stroke();

        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(7, 10, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(7, 10, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(7.8, 9.2, 0.8, 0, Math.PI * 2); ctx.fill();

        return canvas;
    }

    createPeanutSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#D4A96A';
        ctx.beginPath();
        ctx.ellipse(8, 10, 7, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(22, 10, 7, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Middle pinch
        ctx.fillStyle = '#C09050';
        ctx.beginPath();
        ctx.ellipse(15, 10, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Texture
        ctx.strokeStyle = '#A06830';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(8, 10, 5, 0.3, Math.PI - 0.3); ctx.stroke();
        ctx.beginPath(); ctx.arc(22, 10, 5, 0.3, Math.PI - 0.3); ctx.stroke();

        return canvas;
    }

    createBananaSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = '#F5D400';
        ctx.lineWidth = 9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(4, 20);
        ctx.bezierCurveTo(8, 6, 24, 2, 32, 10);
        ctx.stroke();
        // Highlight
        ctx.strokeStyle = '#FFEC60';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(6, 18);
        ctx.bezierCurveTo(10, 8, 22, 4, 28, 10);
        ctx.stroke();
        // Tips
        ctx.fillStyle = '#8B6010';
        ctx.beginPath(); ctx.arc(4, 20, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(32, 10, 3, 0, Math.PI * 2); ctx.fill();

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