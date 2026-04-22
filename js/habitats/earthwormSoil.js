// Earthworm Soil Habitat for Times Table Animals
// Cube Roots: e.g. cube root of 1,000,000 = 100 (because 100 x 100 x 100 = 1,000,000)

class EarthwormSoil {
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
        this.earthworms = [];
        this.soilMounds = [];
        this.rootCubes = [];
        this.tunnels = [];

        // Animation
        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;

        this.particles = [];

        this.init();
    }

    init() {
        this.mathEngine.setHabitat('earthwormSoil');
        this.gameEngine.setBackground('earthwormSoil');
        this.createEnvironment();
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createEarthworms();
        this.createSoilScene();
    }

    createEarthworms() {
        const positions = [
            { x: 140, y: 430 }, { x: 290, y: 500 }, { x: 470, y: 570 },
            { x: 680, y: 470 }, { x: 880, y: 545 }, { x: 1040, y: 430 }
        ];
        positions.forEach((pos, index) => {
            const worm = this.gameEngine.createSprite('earthworm', pos.x, pos.y);
            worm.id = `worm_${index}`;
            worm.width = 40;
            worm.height = 20;
            worm.originalX = pos.x;
            worm.originalY = pos.y;
            worm.wiggleTime = Math.random() * Math.PI * 2;
            worm.wiggleSpeed = 1.5 + Math.random();
            worm.update = function(deltaTime) {
                this.wiggleTime += (deltaTime / 1000) * this.wiggleSpeed;
                this.y = this.originalY + Math.sin(this.wiggleTime) * 8;
            };
            worm.render = function(ctx) {
                ctx.save();
                ctx.font = '32px serif';
                ctx.textAlign = 'center';
                ctx.fillText('🪱', this.x, this.y);
                ctx.restore();
            };
            this.earthworms.push(worm);
            this.gameEngine.addSprite(worm);
        });
    }

    createSoilScene() {
        const soil = {
            x: 0, y: 0,
            render: function(ctx) {
                // Full underground soil background
                const soilGradient = ctx.createLinearGradient(0, 0, 0, 800);
                soilGradient.addColorStop(0, '#8B5A2B');
                soilGradient.addColorStop(0.45, '#6F451F');
                soilGradient.addColorStop(1, '#4A2C14');
                ctx.fillStyle = soilGradient;
                ctx.fillRect(0, 0, 1200, 800);

                // Top grass strip to indicate surface
                ctx.fillStyle = '#2E8B57';
                ctx.fillRect(0, 0, 1200, 40);

                // Soil texture pebbles
                ctx.fillStyle = '#A66A3F';
                for (let i = 0; i < 44; i++) {
                    ctx.beginPath();
                    ctx.arc(40 + i * 28, 90 + (i % 8) * 82, 9 + (i % 3), 0, Math.PI * 2);
                    ctx.fill();
                }

                // Curvy soil tunnels
                const drawTunnel = (startX, startY, c1x, c1y, c2x, c2y, endX, endY) => {
                    ctx.strokeStyle = 'rgba(92, 56, 24, 0.8)';
                    ctx.lineWidth = 22;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, endX, endY);
                    ctx.stroke();

                    ctx.strokeStyle = 'rgba(140, 90, 45, 0.35)';
                    ctx.lineWidth = 12;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, endX, endY);
                    ctx.stroke();
                };

                drawTunnel(80, 200, 260, 110, 420, 250, 610, 210);
                drawTunnel(200, 560, 420, 640, 650, 470, 940, 560);
                drawTunnel(540, 120, 680, 190, 860, 90, 1100, 180);

                // Static earthworms in tunnels to reinforce habitat theme
                ctx.font = '28px serif';
                ctx.textAlign = 'center';
                const staticWorms = [
                    { x: 170, y: 210 },
                    { x: 420, y: 235 },
                    { x: 715, y: 190 },
                    { x: 325, y: 565 },
                    { x: 760, y: 535 },
                    { x: 1035, y: 180 }
                ];
                staticWorms.forEach((worm) => ctx.fillText('🪱', worm.x, worm.y));

                // Cube root sign
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 36px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('∛ Earthworm Soil - Cube Roots', 600, 70);
            }
        };
        this.gameEngine.addSprite(soil);
    }

    startNextProblem() {
        if (this.nextProblemTimer) {
            clearTimeout(this.nextProblemTimer);
            this.nextProblemTimer = null;
        }
        this.currentProblem = this.mathEngine.generateProblem();
        this.problemStartTime = Date.now();
        this.updateProblemDisplay();
        this.addProblemVisuals();
        if (this.audioManager) this.audioManager.playSFX('problem-appear');
        if (this.gameController && this.gameController.mathEngine) {
            this.gameController.mathEngine.currentProblem = this.currentProblem;
        }
    }

    updateProblemDisplay() {
        const problemTitle = document.getElementById('problemTitle');
        const problemText = document.getElementById('problemText');
        const feedback = document.getElementById('feedback');
        if (problemTitle) problemTitle.textContent = this.currentProblem.title;
        if (problemText) {
            const highlighted = this.mathEngine.highlightNumbers(this.currentProblem.text);
            problemText.innerHTML = highlighted;
        }
        if (feedback) feedback.classList.add('hidden');
        this.updateAnswerOptions();
        this.updateProgressIndicator();
        const mathProblem = document.getElementById('mathProblem');
        if (mathProblem) mathProblem.classList.remove('hidden');
    }

    updateAnswerOptions() {
        if (!this.currentProblem || !this.currentProblem.options) return;
        this.currentProblem.options.forEach((option, index) => {
            const btn = document.getElementById(`option${index + 1}`);
            if (btn) {
                const text = btn.querySelector('.option-text');
                if (text) text.textContent = option;
                btn.classList.remove('selected', 'correct', 'incorrect');
            }
        });
    }

    updateProgressIndicator() {
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        if (fill) fill.style.width = `${(this.problemsSolved / this.totalProblems) * 100}%`;
        if (text) text.textContent = `Problem ${this.problemsSolved + 1} of ${this.totalProblems}`;
    }

    addProblemVisuals() {
        this.clearProblemVisuals();
        const visual = {
            x: 600, y: 140,
            isProblemVisual: true,
            render: function(ctx) {
                ctx.save();
                ctx.fillStyle = 'rgba(139, 69, 19, 0.85)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 160, this.y - 50, 320, 90, 14);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 22px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('∛ Find the Cube Root!', this.x, this.y - 10);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '15px "Comic Sans MS", cursive';
                ctx.fillText('e.g. ∛1,000,000 = 100', this.x, this.y + 25);
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(visual);
    }

    clearProblemVisuals() {
        this.gameEngine.sprites = this.gameEngine.sprites.filter(s => !s.isProblemVisual);
    }

    checkAnswer(userAnswer) {
        const isCorrect = this.mathEngine.checkAnswer(userAnswer);
        if (isCorrect) {
            this.onCorrectAnswer();
            if (this.gameController) this.gameController.audioManager.playSFX('correct');
        } else {
            this.onIncorrectAnswer();
            if (this.gameController) this.gameController.audioManager.playSFX('incorrect');
        }
        return isCorrect;
    }

    onCorrectAnswer() {
        this.problemsSolved++;
        if (this.gameController) this.gameController.updateProgress();
        if (this.audioManager) { this.audioManager.playSFX('correct'); this.audioManager.playVoice('celebration'); }
        this.updateProgressIndicator();
        this.startCelebration();
        this.clearProblemVisuals();
        if (this.problemsSolved >= this.totalProblems) {
            if (this.gameController) this.gameController.completeLevel();
        } else {
            this.nextProblemTimer = setTimeout(() => this.startNextProblem(), 3000);
        }
    }

    onIncorrectAnswer() {
        if (this.audioManager) this.audioManager.playSFX('incorrect');
        setTimeout(() => this.showHint(), 1000);
    }

    startCelebration() {
        this.celebrationActive = true;
        this.earthworms.forEach(w => this.gameEngine.createCelebrationParticles(w.x, w.y));
        const cel = {
            x: 600, y: 300, life: 3000,
            update: function(dt) { this.life -= dt; if (this.life <= 0) this.isDead = true; },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('CUBE ROOT FOUND! 🪱', this.x, this.y);
                ctx.fillText('CUBE ROOT FOUND! 🪱', this.x, this.y);
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(cel);
        setTimeout(() => { this.celebrationActive = false; }, 3000);
    }

    showHint() {
        const hint = this.mathEngine.getHint();
        const bubble = {
            x: 600, y: 170, text: hint, life: 6000, opacity: 1,
            update: function(dt) {
                this.life -= dt;
                if (this.life < 1500) this.opacity = this.life / 1500;
                if (this.life <= 0) this.isDead = true;
            },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = 'rgba(139,69,19,0.9)';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 160, this.y - 50, 320, 100, 12);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                const words = this.text.split(' ');
                let line = '', y = this.y - 20;
                words.forEach((w, i) => {
                    const t = line + w + ' ';
                    if (ctx.measureText(t).width > 280 && i > 0) {
                        ctx.fillText(line, this.x, y); line = w + ' '; y += 20;
                    } else { line = t; }
                });
                ctx.fillText(line, this.x, y);
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(bubble);
    }

    completeHabitat() {
        if (this.audioManager) { this.audioManager.playSFX('badge-earned'); this.audioManager.playVoice('habitat-complete'); }
        const msg = {
            x: 600, y: 300, life: 6000, opacity: 1,
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(0, 0, 1200, 800);
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('Earthworm Soil Complete!', this.x, this.y);
                ctx.fillText('Earthworm Soil Complete!', this.x, this.y);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText('You mastered Cube Roots! The earthworms cheer!', this.x, this.y + 45);
                ctx.font = '48px serif';
                ctx.fillText('🪱🌱🪱', this.x, this.y + 110);
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(msg);
        setTimeout(() => this.returnToHabitatSelection(), 6000);
    }

    returnToHabitatSelection() {
        console.log('Earthworm Soil completed! Returning to habitat selection...');
    }

    onContinueButtonClicked() {
        if (this.nextProblemTimer) { clearTimeout(this.nextProblemTimer); this.nextProblemTimer = null; }
        if (this.problemsSolved < this.totalProblems) this.startNextProblem();
    }

    update(deltaTime) {
        this.earthworms.forEach(w => { if (w.update) w.update(deltaTime); });
        if (this.currentProblem) {
            const elapsed = Date.now() - this.problemStartTime;
            if (elapsed > 240000) { this.showHint(); this.problemStartTime = Date.now(); }
        }
    }

    getProgress() {
        return { solved: this.problemsSolved, total: this.totalProblems, percentage: (this.problemsSolved / this.totalProblems) * 100 };
    }

    cleanup() {
        this.earthworms = []; this.soilMounds = []; this.rootCubes = []; this.tunnels = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites(); this.gameEngine.clearParticles(); this.gameEngine.clearAnimations();
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = EarthwormSoil; }
