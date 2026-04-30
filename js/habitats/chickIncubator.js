// Chick Incubator Habitat for Times Table Animals
// Powers of Ten: e.g. 10^4 = 10,000

class ChickIncubator {
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

        this.chicks = [];
        this.eggs = [];

        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;

        this.init();
    }

    init() {
        this.mathEngine.setHabitat('chickIncubator');
        this.gameEngine.setBackground('chickIncubator');
        this.createEnvironment();
        this.startNextProblem();
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createBackground();
        this.createChicks();
    }

    createBackground() {
        const bg = {
            x: 0, y: 0,
            render: function(ctx) {
                const grad = ctx.createLinearGradient(0, 0, 0, 800);
                grad.addColorStop(0, '#FFF7D6');
                grad.addColorStop(1, '#FFE7A7');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 1200, 800);

                // Straw floor
                ctx.fillStyle = '#D8B661';
                ctx.fillRect(0, 640, 1200, 160);

                // Nest circles
                ctx.fillStyle = '#B98D3D';
                const nests = [
                    { x: 180, y: 610 }, { x: 380, y: 585 }, { x: 600, y: 620 },
                    { x: 820, y: 595 }, { x: 1030, y: 615 }
                ];
                nests.forEach((n) => {
                    ctx.beginPath();
                    ctx.ellipse(n.x, n.y, 95, 40, 0, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Eggs in nests
                ctx.font = '40px serif';
                ctx.textAlign = 'center';
                ctx.fillText('🥚', 160, 610);
                ctx.fillText('🥚', 200, 614);
                ctx.fillText('🥚', 360, 585);
                ctx.fillText('🥚', 400, 589);
                ctx.fillText('🥚', 580, 620);
                ctx.fillText('🥚', 620, 624);
                ctx.fillText('🥚', 800, 595);
                ctx.fillText('🥚', 840, 599);
                ctx.fillText('🥚', 1010, 615);
                ctx.fillText('🥚', 1050, 619);

                // Title
                ctx.fillStyle = '#8A5A00';
                ctx.font = 'bold 34px "Comic Sans MS", cursive';
                ctx.fillText('10^n Chick Incubator', 600, 250);
            }
        };

        this.gameEngine.addSprite(bg);
    }

    createChicks() {
        const positions = [
            { x: 180, y: 560 }, { x: 380, y: 535 }, { x: 600, y: 570 },
            { x: 820, y: 545 }, { x: 1030, y: 565 }, { x: 500, y: 500 }
        ];

        positions.forEach((pos, index) => {
            const chick = this.gameEngine.createSprite('butterfly', pos.x, pos.y);
            chick.id = `chick_${index}`;
            chick.originalX = pos.x;
            chick.originalY = pos.y;
            chick.bobTime = Math.random() * Math.PI * 2;
            chick.bobSpeed = 0.8 + Math.random() * 0.8;
            chick.update = function(deltaTime) {
                this.bobTime += (deltaTime / 1000) * this.bobSpeed;
                this.y = this.originalY + Math.sin(this.bobTime) * 10;
            };
            chick.render = function(ctx) {
                ctx.save();
                ctx.font = '34px serif';
                ctx.textAlign = 'center';
                ctx.fillText('🐥', this.x, this.y);
                ctx.restore();
            };

            this.chicks.push(chick);
            this.gameEngine.addSprite(chick);
        });
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

        if (this.audioManager) {
            this.audioManager.playSFX('problem-appear');
        }

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
                ctx.fillStyle = 'rgba(138,90,0,0.86)';
                ctx.strokeStyle = '#FFE8A3';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 175, this.y - 50, 350, 90, 14);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#FFE8A3';
                ctx.font = 'bold 22px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('Powers of Ten', this.x, this.y - 10);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '15px "Comic Sans MS", cursive';
                ctx.fillText('10^3 = 10 × 10 × 10 = 1,000', this.x, this.y + 25);
                ctx.restore();
            }
        };

        this.gameEngine.addSprite(visual);
    }

    clearProblemVisuals() {
        this.gameEngine.sprites = this.gameEngine.sprites.filter((s) => !s.isProblemVisual);
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
        if (this.audioManager) {
            this.audioManager.playSFX('correct');
            this.audioManager.playVoice('celebration');
        }

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

        this.chicks.forEach((c) => this.gameEngine.createCelebrationParticles(c.x, c.y));

        const cel = {
            x: 600, y: 300, life: 3000,
            update: function(dt) { this.life -= dt; if (this.life <= 0) this.isDead = true; },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                ctx.fillStyle = '#FFE8A3';
                ctx.strokeStyle = '#8A5A00';
                ctx.lineWidth = 3;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('HATCHED! 🐥', this.x, this.y);
                ctx.fillText('HATCHED! 🐥', this.x, this.y);
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
                ctx.fillStyle = 'rgba(138,90,0,0.9)';
                ctx.strokeStyle = '#FFE8A3';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 165, this.y - 50, 330, 100, 12);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '16px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                const words = this.text.split(' ');
                let line = '';
                let y = this.y - 20;
                words.forEach((w, i) => {
                    const t = line + w + ' ';
                    if (ctx.measureText(t).width > 290 && i > 0) {
                        ctx.fillText(line, this.x, y);
                        line = w + ' ';
                        y += 20;
                    } else {
                        line = t;
                    }
                });
                ctx.fillText(line, this.x, y);
                ctx.restore();
            }
        };

        this.gameEngine.addSprite(bubble);
    }

    completeHabitat() {
        if (this.audioManager) {
            this.audioManager.playSFX('badge-earned');
            this.audioManager.playVoice('habitat-complete');
        }

        const msg = {
            x: 600, y: 300, life: 6000, opacity: 1,
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(0, 0, 1200, 800);

                ctx.fillStyle = '#FFE8A3';
                ctx.strokeStyle = '#8A5A00';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('Chick Incubator Complete!', this.x, this.y);
                ctx.fillText('Chick Incubator Complete!', this.x, this.y);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText('You mastered Powers of Ten! The chicks are cheering!', this.x, this.y + 45);
                ctx.font = '48px serif';
                ctx.fillText('🐥🥚🐥', this.x, this.y + 110);
                ctx.restore();
            }
        };

        this.gameEngine.addSprite(msg);
        setTimeout(() => this.returnToHabitatSelection(), 6000);
    }

    returnToHabitatSelection() {
        console.log('Chick Incubator completed! Returning to habitat selection...');
    }

    onContinueButtonClicked() {
        if (this.nextProblemTimer) {
            clearTimeout(this.nextProblemTimer);
            this.nextProblemTimer = null;
        }
        if (this.problemsSolved < this.totalProblems) this.startNextProblem();
    }

    update(deltaTime) {
        this.chicks.forEach((c) => { if (c.update) c.update(deltaTime); });
        if (this.currentProblem) {
            if (Date.now() - this.problemStartTime > 240000) {
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
        this.chicks = [];
        this.eggs = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites();
        this.gameEngine.clearParticles();
        this.gameEngine.clearAnimations();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChickIncubator;
}
