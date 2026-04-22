// Butterfly Vivarium Habitat for Times Table Animals
// Squaring: e.g. 256 x 256 = 65,536

class ButterflyVivarium {
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
        this.fixedProblemsQueue = [];

        this.butterflies = [];
        this.flowers = [];

        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;

        this.init();
    }

    init() {
        this.mathEngine.setHabitat('butterflyVivarium');
        this.gameEngine.setBackground('butterflyVivarium');
        this.fixedProblemsQueue = this.createFixedProblemsQueue();
        this.createEnvironment();
        this.startNextProblem();
    }

    createFixedProblemsQueue() {
        return [
            this.buildFixedProblem(
                'What is 256 squared? (256 × 256)',
                '256 × 256 = ?',
                65536,
                [65536, 65236, 65526, 66536],
                'squaring'
            ),
            this.buildFixedProblem(
                'What is 16 squared? (16 × 16)',
                '16 × 16 = ?',
                256,
                [256, 196, 216, 266],
                'squaring'
            )
        ];
    }

    buildFixedProblem(text, operation, answer, options, type) {
        return {
            type: type,
            title: this.mathEngine.translate('problem.challenge'),
            text: text,
            answer: answer,
            visual: ['🦋', '²', '🌸'],
            operation: operation,
            explanation: `${operation.replace('?', answer)}`,
            options: this.mathEngine.shuffleArray([...options]),
            habitat: 'butterflyVivarium',
            difficulty: this.mathEngine.difficultyLevel
        };
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createBackground();
        this.createButterflies();
    }

    createBackground() {
        const bg = {
            x: 0, y: 0,
            render: function(ctx) {
                // Sky gradient
                const grad = ctx.createLinearGradient(0, 0, 0, 800);
                grad.addColorStop(0, '#87CEEB');
                grad.addColorStop(1, '#E0FFE0');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 1200, 800);
                // Ground
                ctx.fillStyle = '#7CFC00';
                ctx.fillRect(0, 650, 1200, 150);
                // Flowers
                const flowers = ['🌸', '🌺', '🌻', '🌼', '💐'];
                for (let i = 0; i < 18; i++) {
                    ctx.font = '36px serif';
                    ctx.textAlign = 'left';
                    ctx.fillText(flowers[i % flowers.length], 30 + i * 65, 660);
                }
                // Title
                ctx.fillStyle = '#8B008B';
                ctx.font = 'bold 34px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('² Squaring Vivarium', 600, 260);
            }
        };
        this.gameEngine.addSprite(bg);
    }

    createButterflies() {
        const positions = [
            { x: 120, y: 350 }, { x: 280, y: 300 }, { x: 460, y: 380 },
            { x: 650, y: 310 }, { x: 840, y: 360 }, { x: 1020, y: 320 }
        ];
        const emojis = ['🦋', '🦋', '🦋', '🦋', '🦋', '🦋'];
        positions.forEach((pos, index) => {
            const b = this.gameEngine.createSprite('butterfly', pos.x, pos.y);
            b.id = `butterfly_${index}`;
            b.originalX = pos.x;
            b.originalY = pos.y;
            b.floatTime = Math.random() * Math.PI * 2;
            b.floatSpeed = 0.6 + Math.random() * 0.8;
            b.emoji = emojis[index];
            b.update = function(deltaTime) {
                this.floatTime += (deltaTime / 1000) * this.floatSpeed;
                this.x = this.originalX + Math.cos(this.floatTime) * 25;
                this.y = this.originalY + Math.sin(this.floatTime * 0.7) * 18;
            };
            b.render = function(ctx) {
                ctx.save();
                ctx.font = '36px serif';
                ctx.textAlign = 'center';
                ctx.fillText(this.emoji, this.x, this.y);
                ctx.restore();
            };
            this.butterflies.push(b);
            this.gameEngine.addSprite(b);
        });
    }

    startNextProblem() {
        if (this.nextProblemTimer) { clearTimeout(this.nextProblemTimer); this.nextProblemTimer = null; }
        if (this.fixedProblemsQueue.length > 0) {
            this.currentProblem = this.fixedProblemsQueue.shift();
        } else {
            this.currentProblem = this.mathEngine.generateProblem();
        }
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
                ctx.fillStyle = 'rgba(139,0,139,0.85)';
                ctx.strokeStyle = '#FFB6C1';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 160, this.y - 50, 320, 90, 14);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#FFB6C1';
                ctx.font = 'bold 22px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('² Square the Number!', this.x, this.y - 10);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '15px "Comic Sans MS", cursive';
                ctx.fillText('e.g. 16² = 16 × 16 = 256', this.x, this.y + 25);
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
        this.butterflies.forEach(b => this.gameEngine.createCelebrationParticles(b.x, b.y));
        const cel = {
            x: 600, y: 300, life: 3000,
            update: function(dt) { this.life -= dt; if (this.life <= 0) this.isDead = true; },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                ctx.fillStyle = '#FFB6C1';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('SQUARED! 🦋', this.x, this.y);
                ctx.fillText('SQUARED! 🦋', this.x, this.y);
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
                ctx.fillStyle = 'rgba(139,0,139,0.9)';
                ctx.strokeStyle = '#FFB6C1';
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
                ctx.fillStyle = '#FFB6C1';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('Butterfly Vivarium Complete!', this.x, this.y);
                ctx.fillText('Butterfly Vivarium Complete!', this.x, this.y);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText('You mastered Squaring! The butterflies dance!', this.x, this.y + 45);
                ctx.font = '48px serif';
                ctx.fillText('🦋✨🦋', this.x, this.y + 110);
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(msg);
        setTimeout(() => this.returnToHabitatSelection(), 6000);
    }

    returnToHabitatSelection() {
        console.log('Butterfly Vivarium completed! Returning to habitat selection...');
    }

    onContinueButtonClicked() {
        if (this.nextProblemTimer) { clearTimeout(this.nextProblemTimer); this.nextProblemTimer = null; }
        if (this.problemsSolved < this.totalProblems) this.startNextProblem();
    }

    update(deltaTime) {
        this.butterflies.forEach(b => { if (b.update) b.update(deltaTime); });
        if (this.currentProblem) {
            if (Date.now() - this.problemStartTime > 240000) { this.showHint(); this.problemStartTime = Date.now(); }
        }
    }

    getProgress() {
        return { solved: this.problemsSolved, total: this.totalProblems, percentage: (this.problemsSolved / this.totalProblems) * 100 };
    }

    cleanup() {
        this.butterflies = []; this.flowers = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites(); this.gameEngine.clearParticles(); this.gameEngine.clearAnimations();
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = ButterflyVivarium; }
