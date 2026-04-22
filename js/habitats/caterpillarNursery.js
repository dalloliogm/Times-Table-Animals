// Caterpillar Nursery Habitat for Times Table Animals
// Square Roots: e.g. √256 = 16 (because 16 x 16 = 256)

class CaterpillarNursery {
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
        this.requiredProblems = [];
        this.requiredProblemIndex = 0;

        this.caterpillars = [];
        this.leaves = [];
        this.cocoons = [];

        this.celebrationActive = false;
        this.hintActive = false;
        this.problemStartTime = 0;

        this.init();
    }

    init() {
        this.mathEngine.setHabitat('caterpillarNursery');
        this.gameEngine.setBackground('caterpillarNursery');
        this.requiredProblems = this.createFixedProblemsQueue();
        this.requiredProblemIndex = 0;
        this.createEnvironment();
        this.startNextProblem();
    }

    createFixedProblemsQueue() {
        return [
            this.buildFixedProblem(
                'Find the square root of 65,536.',
                '√65,536 = ?',
                256,
                [256, 128, 216, 196],
                'square_roots'
            ),
            this.buildFixedProblem(
                'Find the square root of 256.',
                '√256 = ?',
                16,
                [16, 14, 18, 12],
                'square_roots'
            )
        ];
    }

    buildFixedProblem(text, operation, answer, options, type) {
        return {
            type: type,
            title: this.mathEngine.translate('problem.challenge'),
            text: text,
            answer: answer,
            visual: ['🐛', '🍃', '√'],
            operation: operation,
            explanation: `${operation.replace('?', answer)}`,
            options: this.mathEngine.shuffleArray([...options]),
            isRequiredProblem: true,
            habitat: 'caterpillarNursery',
            difficulty: this.mathEngine.difficultyLevel
        };
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    createEnvironment() {
        this.createBackground();
        this.createCaterpillars();
    }

    createBackground() {
        const bg = {
            x: 0, y: 0,
            render: function(ctx) {
                ctx.fillStyle = '#90EE90';
                ctx.fillRect(0, 0, 1200, 800);
                ctx.fillStyle = '#228B22';
                ctx.fillRect(0, 650, 1200, 150);
                // Leaf decorations
                ctx.font = '48px serif';
                ctx.textAlign = 'left';
                const leafPos = [50, 200, 400, 600, 800, 1000];
                leafPos.forEach(x => ctx.fillText('🍃', x, 100 + Math.sin(x) * 30));
                // Title
                ctx.fillStyle = '#006400';
                ctx.font = 'bold 34px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('√ Square Root Nursery', 600, 260);
            }
        };
        this.gameEngine.addSprite(bg);
    }

    createCaterpillars() {
        const positions = [
            { x: 160, y: 500 }, { x: 350, y: 480 }, { x: 550, y: 510 },
            { x: 750, y: 490 }, { x: 950, y: 505 }, { x: 1080, y: 475 }
        ];
        positions.forEach((pos, index) => {
            const cat = this.gameEngine.createSprite('caterpillar', pos.x, pos.y);
            cat.id = `caterpillar_${index}`;
            cat.originalX = pos.x;
            cat.originalY = pos.y;
            cat.crawlTime = Math.random() * Math.PI * 2;
            cat.crawlSpeed = 0.8 + Math.random() * 0.6;
            cat.update = function(deltaTime) {
                this.crawlTime += (deltaTime / 1000) * this.crawlSpeed;
                this.x = this.originalX + Math.cos(this.crawlTime) * 18;
            };
            cat.render = function(ctx) {
                ctx.save();
                ctx.font = '34px serif';
                ctx.textAlign = 'center';
                ctx.fillText('🐛', this.x, this.y);
                ctx.restore();
            };
            this.caterpillars.push(cat);
            this.gameEngine.addSprite(cat);
        });
    }

    startNextProblem() {
        if (this.nextProblemTimer) { clearTimeout(this.nextProblemTimer); this.nextProblemTimer = null; }
        if (this.requiredProblemIndex < this.requiredProblems.length) {
            this.currentProblem = this.requiredProblems[this.requiredProblemIndex];
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
                ctx.fillStyle = 'rgba(0,100,0,0.85)';
                ctx.strokeStyle = '#ADFF2F';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 160, this.y - 50, 320, 90, 14);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#ADFF2F';
                ctx.font = 'bold 22px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.fillText('√ Find the Square Root!', this.x, this.y - 10);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '15px "Comic Sans MS", cursive';
                ctx.fillText('e.g. √256 = 16  (16×16=256)', this.x, this.y + 25);
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
        if (this.currentProblem && this.currentProblem.isRequiredProblem && this.requiredProblemIndex < this.requiredProblems.length) {
            this.requiredProblemIndex++;
        }
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
        this.caterpillars.forEach(c => this.gameEngine.createCelebrationParticles(c.x, c.y));
        const cel = {
            x: 600, y: 300, life: 3000,
            update: function(dt) { this.life -= dt; if (this.life <= 0) this.isDead = true; },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / 3000;
                ctx.fillStyle = '#ADFF2F';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('SQUARE ROOT FOUND! 🐛', this.x, this.y);
                ctx.fillText('SQUARE ROOT FOUND! 🐛', this.x, this.y);
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
                ctx.strokeStyle = '#ADFF2F';
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
                ctx.fillStyle = '#ADFF2F';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.font = '42px "Comic Sans MS", cursive';
                ctx.textAlign = 'center';
                ctx.strokeText('Caterpillar Nursery Complete!', this.x, this.y);
                ctx.fillText('Caterpillar Nursery Complete!', this.x, this.y);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '18px "Comic Sans MS", cursive';
                ctx.fillText('You mastered Square Roots! The caterpillars celebrate!', this.x, this.y + 45);
                ctx.font = '48px serif';
                ctx.fillText('🐛🦋🐛', this.x, this.y + 110);
                ctx.restore();
            }
        };
        this.gameEngine.addSprite(msg);
        setTimeout(() => this.returnToHabitatSelection(), 6000);
    }

    returnToHabitatSelection() {
        console.log('Caterpillar Nursery completed! Returning to habitat selection...');
    }

    onContinueButtonClicked() {
        if (this.nextProblemTimer) { clearTimeout(this.nextProblemTimer); this.nextProblemTimer = null; }
        if (this.problemsSolved < this.totalProblems) this.startNextProblem();
    }

    update(deltaTime) {
        this.caterpillars.forEach(c => { if (c.update) c.update(deltaTime); });
        if (this.currentProblem) {
            if (Date.now() - this.problemStartTime > 240000) { this.showHint(); this.problemStartTime = Date.now(); }
        }
    }

    getProgress() {
        return { solved: this.problemsSolved, total: this.totalProblems, percentage: (this.problemsSolved / this.totalProblems) * 100 };
    }

    cleanup() {
        this.caterpillars = []; this.leaves = []; this.cocoons = [];
        this.currentProblem = null;
        this.gameEngine.clearSprites(); this.gameEngine.clearParticles(); this.gameEngine.clearAnimations();
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = CaterpillarNursery; }
