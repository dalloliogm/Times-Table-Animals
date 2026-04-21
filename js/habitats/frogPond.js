// Frog Pond Habitat for Times Table Animals
// Cubing: e.g. 100 x 100 x 100 = 1,000,000

class FrogPond {
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

        this.frogs = [];
        this.lilyPads = [];
        this.ripples = [];

        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;

        this.init();
    }

    init() {
        this.mathEngine.setHabitat('frogPond');
        this.gameEngine.setBackground('frogPond');
        this.createEnvironment();
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createBackground();
        this.createFrogs();
    }

    createBackground() {
        const bg = {
            x: 0, y: 0,
            render: function(ctx) {
                // Sky
                ctx.fillStyle = '#B0E0E6';
                ctx.fillRect(0, 0, 1200, 300);
                // Pond water
                ctx.fillStyle = '#1E90FF';
                ctx.beginPath();
                ctx.ellipse(600, 550, 580, 280, 0, 0, Math.PI * 2);
                ctx.fill();
                // Water sheen
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.beginPath();
                ctx.ellipse(500, 480, 300, 80, -0.2, 0, Math.PI * 2);
                ctx.fill();
                // Reeds
                ctx.fillStyle = '#556B2F';
                for (let i = 0; i < 8; i++) {
                    ctx.fillRect(40 + i * 145, 350, 8, 200);
                }
                // Lily pads
                ctx.fillStyle = '#228B22';
                const pads = [{ x: 200, y: 580 }, { x: 450, y: 620 }, { x: 700, y: 600 }, { x: 900, y: 570 }];
                pads.forEach(p => {
                    ctx.beginPath();
                    ctx.ellipse(p.x, p.y, 45, 28, 0, 0, Math.PI * 2);
                    ctx.fill();
                });
                // Title
                ctx.fillStyle = '#006400';
                ctx.font = 'bold 34px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('³ Cubing Pond', 600, 260);
            }
        };
        this.gameEngine.addSprite(bg);
    }

    createFrogs() {
        const positions = [
            { x: 200, y: 560 }, { x: 450, y: 600 }, { x: 700, y: 580 },
            { x: 900, y: 555 }, { x: 320, y: 520 }, { x: 800, y: 510 }
        ];
        positions.forEach((pos, index) => {
            const frog = this.gameEngine.createSprite('frog', pos.x, pos.y);
            frog.id = `frog_${index}`;
            frog.originalX = pos.x;
            frog.originalY = pos.y;
            frog.jumpTime = Math.random() * Math.PI * 2;
            frog.jumpSpeed = 0.5 + Math.random() * 0.7;
            frog.update = function(deltaTime) {
                this.jumpTime += (deltaTime / 1000) * this.jumpSpeed;
                this.y = this.originalY + Math.abs(Math.sin(this.jumpTime)) * -12;
            };
            frog.render = function(ctx) {
                ctx.save();
                ctx.font = '34px serif';
                ctx.textAlign = 'center';
                ctx.fillText('🐸', this.x, this.y);
                ctx.restore();
            };
            this.frogs.push(frog);
            this.gameEngine.addSprite(frog);
        });
    }

    startNextProblem() {
        if (this.nextProblemTimer) { clearTimeout(this.nextProblemTimer); this.nextProblemTimer = null; }
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
        if (problemText) problemText.innerHTML = this.mathEngine.highlightNumbers(this.currentProblem.text);
        if (feedback) feedback.classList.add('hidden');
        this.updateAnswerOptions();
        this.updateProgressIndicator();
        const mp = document.getElementById('mathProblem');
        if (mp) mp.classList.remove('hidden');
    }

    updateAnswerOptions() {
        if (!this.currentProblem || !this.currentProblem.options) return;
        this.currentProblem.options.forEach((option, index) => {
            const btn = document.getElementById(`option${index + 1}`);
            if (btn) {
                const t = btn.querySelector('.option-text');
                if (t) t.textContent = option;
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
            x: 600, y: 140, isProblemVisual: true,
            render: function(ctx) {
                ctx.save();
                ctx.fillStyle = 'rgba(0,100,0,0.85)';
                ctx.strokeStyle = '#90EE90';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 165, this.y - 50, 330, 90, 14);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#90EE90';
                ctx.font = 'bold 22px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('³ Cube the Number!', this.x, this.y - 10);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '15px "Comic Sans MS", cursive';
                ctx.fillText('e.g. 10³ = 10×10×10 = 1,000', this.x, this.y + 25);
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
        this.frogs.forEach(f => this.gameEngine.createCelebrationParticles(f.x, f.y));
        const cel = {
            x: 600, y: 300, life: 3000,
            update: function(dt) { this.life -= dt; if (this.life <= 0) this.isDead = true; },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                ctx.fillStyle = '#90EE90';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('CUBED! 🐸', this.x, this.y);
                ctx.fillText('CUBED! 🐸', this.x, this.y);
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
                ctx.fillStyle = 'rgba(0,100,0,0.9)';
                ctx.strokeStyle = '#90EE90';
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
                ctx.fillStyle = '#90EE90';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('Frog Pond Complete!', this.x, this.y);
                ctx.fillText('Frog Pond Complete!', this.x, this.y);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText('You mastered Cubing! The frogs leap for joy!', this.x, this.y + 45);
                ctx.font = '48px serif';
                ctx.fillText('🐸💧🐸', this.x, this.y + 110);
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(msg);
        setTimeout(() => this.returnToHabitatSelection(), 6000);
    }

    returnToHabitatSelection() {
        console.log('Frog Pond completed! Returning to habitat selection...');
    }

    onContinueButtonClicked() {
        if (this.nextProblemTimer) { clearTimeout(this.nextProblemTimer); this.nextProblemTimer = null; }
        if (this.problemsSolved < this.totalProblems) this.startNextProblem();
    }

    update(deltaTime) {
        this.frogs.forEach(f => { if (f.update) f.update(deltaTime); });
        if (this.currentProblem) {
            if (Date.now() - this.problemStartTime > 240000) { this.showHint(); this.problemStartTime = Date.now(); }
        }
    }

    getProgress() {
        return { solved: this.problemsSolved, total: this.totalProblems, percentage: (this.problemsSolved / this.totalProblems) * 100 };
    }

    cleanup() {
        this.frogs = []; this.lilyPads = []; this.ripples = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites(); this.gameEngine.clearParticles(); this.gameEngine.clearAnimations();
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = FrogPond; }
