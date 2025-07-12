// Scene Manager for Times Table Animals
// Handles scene transitions and game state management

class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
        this.gameEngine = null;
        this.mathEngine = null;
        this.audioManager = null;
        this.transitionInProgress = false;
        this.fadeAlpha = 0;
        this.fadeDirection = 0; // 0: no fade, 1: fade in, -1: fade out
    }

    init(gameEngine, mathEngine, audioManager) {
        this.gameEngine = gameEngine;
        this.mathEngine = mathEngine;
        this.audioManager = audioManager;
        this.registerScenes();
    }

    registerScenes() {
        // Register available scenes
        this.scenes = {
            'menu': new MenuScene(this),
            'habitatSelect': new HabitatSelectScene(this),
            'bunnyMeadow': new BunnyMeadowScene(this),
            'penguinArctic': new PenguinArcticScene(this),
            'elephantSavanna': new ElephantSavannaScene(this),
            'monkeyJungle': new MonkeyJungleScene(this),
            'lionPride': new LionPrideScene(this),
            'pause': new PauseScene(this),
            'settings': new SettingsScene(this),
            'victory': new VictoryScene(this)
        };
    }

    loadScene(sceneName, data = null) {
        if (this.transitionInProgress) return;
        
        const scene = this.scenes[sceneName];
        if (!scene) {
            console.error(`Scene '${sceneName}' not found`);
            return;
        }
        
        this.transitionInProgress = true;
        
        // Start fade out
        this.fadeDirection = -1;
        this.fadeAlpha = 0;
        
        // After fade out completes, switch scenes
        setTimeout(() => {
            this.switchScene(scene, data);
        }, 300);
    }

    switchScene(scene, data) {
        // Unload current scene
        if (this.currentScene) {
            this.currentScene.unload();
        }
        
        // Clear game engine
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
        
        // Load new scene
        this.currentScene = scene;
        this.currentScene.load(data);
        
        // Start fade in
        this.fadeDirection = 1;
        this.fadeAlpha = 1;
        
        // Complete transition
        setTimeout(() => {
            this.transitionInProgress = false;
            this.fadeDirection = 0;
            this.fadeAlpha = 0;
        }, 300);
    }

    update(deltaTime) {
        // Update fade transition
        if (this.fadeDirection !== 0) {
            this.fadeAlpha += this.fadeDirection * deltaTime / 300;
            this.fadeAlpha = Math.max(0, Math.min(1, this.fadeAlpha));
        }
        
        // Update current scene
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    render(ctx) {
        // Render current scene
        if (this.currentScene) {
            this.currentScene.render(ctx);
        }
        
        // Render fade transition
        if (this.fadeAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.fadeAlpha;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
        }
    }

    getCurrentScene() {
        return this.currentScene;
    }

    getGameEngine() {
        return this.gameEngine;
    }

    getMathEngine() {
        return this.mathEngine;
    }

    getAudioManager() {
        return this.audioManager;
    }
}

// Base Scene Class
class Scene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.isLoaded = false;
        this.sprites = [];
        this.ui = [];
    }

    load(data) {
        this.isLoaded = true;
        this.onLoad(data);
    }

    unload() {
        this.isLoaded = false;
        this.onUnload();
    }

    update(deltaTime) {
        if (!this.isLoaded) return;
        this.onUpdate(deltaTime);
    }

    render(ctx) {
        if (!this.isLoaded) return;
        this.onRender(ctx);
    }

    // Override these methods in subclasses
    onLoad(data) {}
    onUnload() {}
    onUpdate(deltaTime) {}
    onRender(ctx) {}
}

// Menu Scene
class MenuScene extends Scene {
    onLoad(data) {
        const gameEngine = this.sceneManager.getGameEngine();
        gameEngine.setBackground('menu');
        
        // Add floating animals for decoration
        this.addFloatingAnimals();
    }

    addFloatingAnimals() {
        const gameEngine = this.sceneManager.getGameEngine();
        
        // Add some floating bunnies
        for (let i = 0; i < 3; i++) {
            const bunny = gameEngine.createSprite('bunny', 
                Math.random() * 1000 + 100, 
                Math.random() * 600 + 100);
            bunny.velocity.x = Math.random() * 50 - 25;
            bunny.velocity.y = Math.random() * 50 - 25;
            gameEngine.addSprite(bunny);
        }
    }

    onUpdate(deltaTime) {
        // Bounce animals off edges
        const gameEngine = this.sceneManager.getGameEngine();
        gameEngine.sprites.forEach(sprite => {
            if (sprite.x < 0 || sprite.x > 1140) {
                sprite.velocity.x *= -1;
            }
            if (sprite.y < 0 || sprite.y > 740) {
                sprite.velocity.y *= -1;
            }
        });
    }
}

// Habitat Select Scene
class HabitatSelectScene extends Scene {
    onLoad(data) {
        const gameEngine = this.sceneManager.getGameEngine();
        gameEngine.setBackground('habitatSelect');
        
        // Add preview animals for each habitat
        this.addHabitatPreviews();
    }

    addHabitatPreviews() {
        const gameEngine = this.sceneManager.getGameEngine();
        
        // Add habitat preview animals
        const habitats = [
            { type: 'bunny', x: 200, y: 200 },
            { type: 'penguin', x: 400, y: 200 },
            { type: 'elephant', x: 600, y: 200 },
            { type: 'monkey', x: 800, y: 200 }
        ];
        
        habitats.forEach(habitat => {
            const sprite = gameEngine.createSprite(habitat.type, habitat.x, habitat.y);
            sprite.animationSpeed = 0.2;
            gameEngine.addSprite(sprite);
        });
    }
}

// Bunny Meadow Scene
class BunnyMeadowScene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
        this.problemActive = false;
        this.currentProblem = null;
        this.bunnies = [];
        this.carrots = [];
        this.problemStartTime = 0;
    }

    onLoad(data) {
        const gameEngine = this.sceneManager.getGameEngine();
        const mathEngine = this.sceneManager.getMathEngine();
        
        gameEngine.setBackground('bunnyMeadow');
        mathEngine.setHabitat('bunnyMeadow');
        
        // Create bunny meadow environment
        this.createEnvironment();
        
        // Start first problem
        this.startNextProblem();
    }

    createEnvironment() {
        const gameEngine = this.sceneManager.getGameEngine();
        
        // Add grass and flowers (simple decorations)
        this.addDecorations();
        
        // Add initial bunnies
        this.addBunnies(3);
    }

    addDecorations() {
        const gameEngine = this.sceneManager.getGameEngine();
        
        // Add some decorative elements
        for (let i = 0; i < 10; i++) {
            const decoration = {
                x: Math.random() * 1200,
                y: Math.random() * 800,
                type: Math.random() > 0.5 ? 'flower' : 'grass',
                render: function(ctx) {
                    ctx.fillStyle = this.type === 'flower' ? '#FF69B4' : '#32CD32';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            gameEngine.addSprite(decoration);
        }
    }

    addBunnies(count) {
        const gameEngine = this.sceneManager.getGameEngine();
        
        for (let i = 0; i < count; i++) {
            const bunny = gameEngine.createSprite('bunny', 
                Math.random() * 800 + 100, 
                Math.random() * 600 + 100);
            
            // Add bunny behavior
            bunny.hopTime = Math.random() * 2000;
            bunny.isHopping = false;
            bunny.originalY = bunny.y;
            
            bunny.update = function(deltaTime) {
                this.hopTime -= deltaTime;
                
                if (this.hopTime <= 0) {
                    this.isHopping = true;
                    this.hopTime = Math.random() * 3000 + 2000;
                }
                
                if (this.isHopping) {
                    this.y = this.originalY + Math.sin(this.animationFrame * 10) * 10;
                    if (this.animationFrame > 1) {
                        this.isHopping = false;
                        this.y = this.originalY;
                        this.animationFrame = 0;
                    }
                }
                
                this.animationFrame += this.animationSpeed * deltaTime / 1000;
            };
            
            this.bunnies.push(bunny);
            gameEngine.addSprite(bunny);
        }
    }

    addCarrots(count) {
        const gameEngine = this.sceneManager.getGameEngine();
        
        for (let i = 0; i < count; i++) {
            const carrot = gameEngine.createSprite('carrot', 
                Math.random() * 800 + 100, 
                Math.random() * 600 + 400);
            
            carrot.onClick = () => {
                this.onCarrotClick(carrot);
            };
            
            this.carrots.push(carrot);
            gameEngine.addSprite(carrot);
        }
    }

    startNextProblem() {
        const mathEngine = this.sceneManager.getMathEngine();
        const audioManager = this.sceneManager.getAudioManager();
        
        // Generate new problem
        this.currentProblem = mathEngine.generateProblem();
        this.problemActive = true;
        this.problemStartTime = Date.now();
        
        // Update UI to show problem
        this.updateProblemUI();
        
        // Add visual elements for problem
        this.addProblemVisuals();
        
        // Play problem introduction sound
        audioManager.playSFX('problem-appear');
        audioManager.playVoice('problem-intro');
    }

    updateProblemUI() {
        // This would update the DOM elements for the math problem
        // The actual UI update is handled by the main game controller
        const problemUI = document.getElementById('mathProblem');
        if (problemUI) {
            problemUI.classList.remove('hidden');
        }
    }

    addProblemVisuals() {
        const gameEngine = this.sceneManager.getGameEngine();
        
        // Clear existing problem visuals
        this.clearProblemVisuals();
        
        // Add visuals based on problem type
        if (this.currentProblem.type === 'addition') {
            this.addAdditionVisuals();
        } else if (this.currentProblem.type === 'subtraction') {
            this.addSubtractionVisuals();
        }
    }

    addAdditionVisuals() {
        const gameEngine = this.sceneManager.getGameEngine();
        
        // Parse the problem to get numbers
        const numbers = this.currentProblem.operation.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const a = parseInt(numbers[0]);
            const b = parseInt(numbers[1]);
            
            // Add carrots for first number
            for (let i = 0; i < a; i++) {
                const carrot = gameEngine.createSprite('carrot', 
                    200 + i * 40, 
                    300);
                carrot.isProblemVisual = true;
                gameEngine.addSprite(carrot);
            }
            
            // Add carrots for second number
            for (let i = 0; i < b; i++) {
                const carrot = gameEngine.createSprite('carrot', 
                    200 + (a + i) * 40, 
                    350);
                carrot.isProblemVisual = true;
                gameEngine.addSprite(carrot);
            }
        }
    }

    addSubtractionVisuals() {
        const gameEngine = this.sceneManager.getGameEngine();
        
        // Parse the problem to get numbers
        const numbers = this.currentProblem.operation.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const a = parseInt(numbers[0]);
            const b = parseInt(numbers[1]);
            
            // Add carrots for minuend
            for (let i = 0; i < a; i++) {
                const carrot = gameEngine.createSprite('carrot', 
                    200 + i * 40, 
                    300);
                carrot.isProblemVisual = true;
                
                // Make some carrots "eaten" (subtrahend)
                if (i < b) {
                    carrot.opacity = 0.3;
                    carrot.isEaten = true;
                }
                
                gameEngine.addSprite(carrot);
            }
        }
    }

    clearProblemVisuals() {
        const gameEngine = this.sceneManager.getGameEngine();
        
        // Remove problem visual sprites
        gameEngine.sprites = gameEngine.sprites.filter(sprite => !sprite.isProblemVisual);
    }

    onCarrotClick(carrot) {
        const gameEngine = this.sceneManager.getGameEngine();
        const audioManager = this.sceneManager.getAudioManager();
        
        // Remove carrot
        gameEngine.removeSprite(carrot);
        
        // Add particles
        gameEngine.createCelebrationParticles(carrot.x, carrot.y);
        
        // Play sound
        audioManager.playSFX('correct');
    }

    checkAnswer(answer) {
        const mathEngine = this.sceneManager.getMathEngine();
        const audioManager = this.sceneManager.getAudioManager();
        
        const isCorrect = mathEngine.checkAnswer(answer);
        
        if (isCorrect) {
            this.onCorrectAnswer();
        } else {
            this.onIncorrectAnswer();
        }
        
        return isCorrect;
    }

    onCorrectAnswer() {
        const gameEngine = this.sceneManager.getGameEngine();
        const audioManager = this.sceneManager.getAudioManager();
        
        // Play celebration
        audioManager.playSFX('correct');
        audioManager.playVoice('celebration');
        
        // Add celebration particles
        gameEngine.createCelebrationParticles(600, 400);
        
        // Make bunnies hop
        this.bunnies.forEach(bunny => {
            bunny.isHopping = true;
            bunny.hopTime = 0;
        });
        
        // Clear problem visuals
        this.clearProblemVisuals();
        
        // Mark problem as inactive
        this.problemActive = false;
        
        // Schedule next problem
        setTimeout(() => {
            this.startNextProblem();
        }, 2000);
    }

    onIncorrectAnswer() {
        const audioManager = this.sceneManager.getAudioManager();
        
        // Play encouragement
        audioManager.playSFX('incorrect');
        audioManager.playVoice('encouragement');
        
        // Bunny reactions (maybe look sad temporarily)
        this.bunnies.forEach(bunny => {
            bunny.velocity.x = 0;
            bunny.velocity.y = 0;
        });
    }

    onUpdate(deltaTime) {
        // Update bunnies
        this.bunnies.forEach(bunny => {
            if (bunny.update) {
                bunny.update(deltaTime);
            }
        });
        
        // Update problem timer
        if (this.problemActive) {
            const elapsed = Date.now() - this.problemStartTime;
            
            // Provide hints after 30 seconds
            if (elapsed > 30000) {
                this.provideHint();
            }
        }
    }

    provideHint() {
        const mathEngine = this.sceneManager.getMathEngine();
        const audioManager = this.sceneManager.getAudioManager();
        
        const hint = mathEngine.getHint();
        
        // Play hint sound
        audioManager.playSFX('hint');
        
        // Show hint visually (this would be implemented in the UI)
        console.log('Hint:', hint);
    }

    onUnload() {
        this.bunnies = [];
        this.carrots = [];
        this.problemActive = false;
        this.currentProblem = null;
    }
}

// Placeholder scenes for other habitats
class PenguinArcticScene extends Scene {
    onLoad(data) {
        const gameEngine = this.sceneManager.getGameEngine();
        const mathEngine = this.sceneManager.getMathEngine();
        
        gameEngine.setBackground('penguinArctic');
        mathEngine.setHabitat('penguinArctic');
        
        // TODO: Implement penguin habitat
        console.log('Penguin Arctic scene loaded');
    }
}

class ElephantSavannaScene extends Scene {
    onLoad(data) {
        const gameEngine = this.sceneManager.getGameEngine();
        const mathEngine = this.sceneManager.getMathEngine();
        
        gameEngine.setBackground('elephantSavanna');
        mathEngine.setHabitat('elephantSavanna');
        
        // TODO: Implement elephant habitat
        console.log('Elephant Savanna scene loaded');
    }
}

class MonkeyJungleScene extends Scene {
    onLoad(data) {
        const gameEngine = this.sceneManager.getGameEngine();
        const mathEngine = this.sceneManager.getMathEngine();
        
        gameEngine.setBackground('monkeyJungle');
        mathEngine.setHabitat('monkeyJungle');
        
        // TODO: Implement monkey habitat
        console.log('Monkey Jungle scene loaded');
    }
}

class LionPrideScene extends Scene {
    onLoad(data) {
        const gameEngine = this.sceneManager.getGameEngine();
        const mathEngine = this.sceneManager.getMathEngine();
        
        gameEngine.setBackground('lionPride');
        mathEngine.setHabitat('lionPride');
        
        // TODO: Implement lion habitat
        console.log('Lion Pride scene loaded');
    }
}

// Utility scenes
class PauseScene extends Scene {
    onLoad(data) {
        // TODO: Implement pause menu
        console.log('Pause scene loaded');
    }
}

class SettingsScene extends Scene {
    onLoad(data) {
        // TODO: Implement settings menu
        console.log('Settings scene loaded');
    }
}

class VictoryScene extends Scene {
    onLoad(data) {
        // TODO: Implement victory celebration
        console.log('Victory scene loaded');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SceneManager;
}