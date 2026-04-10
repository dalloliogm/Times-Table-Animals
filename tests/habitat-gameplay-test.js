const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { Window } = require('happy-dom');

function createCanvasContextStub() {
    return {
        canvas: { width: 1200, height: 800 },
        save() {},
        restore() {},
        clearRect() {},
        fillRect() {},
        strokeRect() {},
        beginPath() {},
        closePath() {},
        arc() {},
        fill() {},
        stroke() {},
        moveTo() {},
        lineTo() {},
        quadraticCurveTo() {},
        bezierCurveTo() {},
        roundRect() {},
        ellipse() {},
        translate() {},
        rotate() {},
        scale() {},
        setTransform() {},
        resetTransform() {},
        drawImage() {},
        fillText() {},
        strokeText() {},
        measureText(text) {
            return { width: String(text || '').length * 10 };
        },
        createLinearGradient() {
            return { addColorStop() {} };
        },
        createRadialGradient() {
            return { addColorStop() {} };
        }
    };
}

function installBrowserStubs(window) {
    class AudioStub {
        constructor() {
            this.currentTime = 0;
            this.readyState = 4;
            this.loop = false;
            this.volume = 1;
        }
        play() {
            return Promise.resolve();
        }
        pause() {}
    }

    class GainNodeStub {
        constructor() {
            this.gain = { value: 1 };
        }
        connect() {}
    }

    class AudioContextStub {
        constructor() {
            this.destination = {};
        }
        createGain() {
            return new GainNodeStub();
        }
        createOscillator() {
            return {
                type: 'sine',
                frequency: {
                    value: 440,
                    setValueAtTime(value) {
                        this.value = value;
                    }
                },
                connect() {},
                start() {},
                stop() {}
            };
        }
        createBufferSource() {
            return {
                buffer: null,
                connect() {},
                start() {},
                stop() {}
            };
        }
        createAnalyser() {
            return { connect() {} };
        }
        resume() {
            return Promise.resolve();
        }
    }

    window.Audio = AudioStub;
    window.AudioContext = AudioContextStub;
    window.webkitAudioContext = AudioContextStub;
    window.speechSynthesis = {
        speak() {},
        cancel() {},
        getVoices() {
            return [];
        }
    };
    window.SpeechSynthesisUtterance = class {
        constructor(text) {
            this.text = text;
        }
    };
    window.requestAnimationFrame = (callback) => window.setTimeout(() => callback(Date.now()), 16);
    window.cancelAnimationFrame = (id) => window.clearTimeout(id);
    window.HTMLCanvasElement.prototype.getContext = () => createCanvasContextStub();
}

function extractScripts(html) {
    const scripts = [];
    const scriptRegex = /<script(?:\s+src="([^"]+)")?>([\s\S]*?)<\/script>/gi;
    const htmlWithoutScripts = html.replace(scriptRegex, (_, src, inlineCode) => {
        scripts.push({ src, inlineCode });
        return '';
    });
    return { scripts, htmlWithoutScripts };
}

function loadScripts(window, scripts, rootDir) {
    const context = vm.createContext(window);

    for (const script of scripts) {
        let code = script.inlineCode || '';
        let filename = 'inline-script.js';

        if (script.src) {
            filename = script.src;
            code = fs.readFileSync(path.join(rootDir, script.src), 'utf8');
        }

        vm.runInContext(code, context, { filename });
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createGameWindow() {
    const rootDir = path.join(__dirname, '..');
    const htmlPath = path.join(rootDir, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const { scripts, htmlWithoutScripts } = extractScripts(html);

    const window = new Window({
        url: `file://${htmlPath}`,
        settings: {
            disableJavaScriptFileLoading: true,
            disableJavaScriptEvaluation: false,
            disableCSSFileLoading: true,
            disableIframePageLoading: true
        }
    });

    installBrowserStubs(window);
    window.console = console;
    window.innerWidth = 1200;
    window.innerHeight = 800;
    window.document.write(htmlWithoutScripts);
    loadScripts(window, scripts, rootDir);
    window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));

    assert(window.gameController, 'GameController did not initialize');
    window.gameController.forceOpenMainMenu();

    return window;
}

function clickCorrectAnswer(window) {
    const gameController = window.gameController;
    const problem = gameController.getActiveProblem();

    assert(problem, 'No active problem available');
    assert(Array.isArray(problem.options), 'Active problem is missing answer options');

    const correctIndex = problem.options.indexOf(problem.answer);
    assert(correctIndex >= 0, `Correct answer ${problem.answer} was not found in options ${problem.options.join(', ')}`);

    const button = window.document.getElementById(`option${correctIndex + 1}`);
    assert(button, `Missing answer button option${correctIndex + 1}`);
    button.click();

    return problem;
}

async function wait(window, ms) {
    await new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function testBunnyMeadowAnswerRegistration() {
    const window = createGameWindow();
    const gameController = window.gameController;

    gameController.enterHabitat('bunnyMeadow');

    const beforeProgress = gameController.gameState.habitatProgress.bunnyMeadow.completed;
    clickCorrectAnswer(window);
    await wait(window, 150);

    assert(gameController.currentHabitat.problemsSolved === 1, 'Bunny Meadow did not count the correct answer');
    assert(
        gameController.gameState.habitatProgress.bunnyMeadow.completed === beforeProgress + 1,
        'Bunny Meadow progress did not update after a correct click'
    );
    assert(gameController.isSubmittingAnswer === false, 'Bunny Meadow left answer submission stuck in progress');
}

async function testStartAgainResetsCurrentHabitat() {
    const window = createGameWindow();
    const gameController = window.gameController;

    gameController.enterHabitat('bunnyMeadow');
    clickCorrectAnswer(window);
    await wait(window, 150);

    assert(gameController.currentHabitat.problemsSolved === 1, 'Setup failed: Bunny Meadow should have one solved problem before restart');

    const startAgainButton = window.document.getElementById('startAgainBtn');
    assert(startAgainButton, 'Start Again button is missing');
    startAgainButton.click();
    await wait(window, 100);

    assert(gameController.gameState.currentHabitat === 'bunnyMeadow', 'Start Again should keep the player in the same habitat');
    assert(gameController.currentHabitat.problemsSolved === 0, 'Start Again did not reset the habitat question counter');
    assert(
        gameController.gameState.habitatProgress.bunnyMeadow.completed === 0,
        'Start Again did not reset saved progress for the current habitat'
    );
    assert(
        window.document.getElementById('progressText').textContent === 'Problem 1 of 10',
        'Start Again did not return Bunny Meadow to problem 1'
    );
}

async function testHabitatEntryResumesSavedQuestionNumber() {
    const window = createGameWindow();
    const gameController = window.gameController;

    gameController.gameState.habitatProgress.bunnyMeadow.completed = 9;
    gameController.enterHabitat('bunnyMeadow');
    await wait(window, 50);

    assert(gameController.currentHabitat.problemsSolved === 9, 'Habitat entry did not restore Bunny Meadow saved progress');
    assert(
        window.document.getElementById('progressText').textContent === 'Problem 10 of 10',
        'Habitat entry did not show the resumed Bunny Meadow question number'
    );
}

async function testPenguinPairsProgression() {
    const window = createGameWindow();
    const gameController = window.gameController;

    gameController.enterHabitat('penguinPairsArctic');
    const firstProblem = gameController.getActiveProblem();
    const firstOperation = firstProblem.operation;

    clickCorrectAnswer(window);
    await wait(window, 150);

    assert(gameController.currentHabitat.problemsSolved === 1, 'Penguin Pairs did not count the correct answer');

    const continueButton = window.document.getElementById('nextProblem');
    assert(continueButton, 'Continue button is missing');
    continueButton.click();
    await wait(window, 50);

    const secondProblem = gameController.getActiveProblem();
    assert(secondProblem, 'Penguin Pairs did not load a new problem after Continue');
    assert(
        secondProblem !== firstProblem || secondProblem.operation !== firstOperation,
        'Penguin Pairs did not advance to a different problem after Continue'
    );
}

async function testPenguinDoublesTemplateMatchesAnswer() {
    const window = createGameWindow();
    const mathEngine = window.gameController.mathEngine;
    const templates = mathEngine.questionTemplatesData.en.doubles;

    mathEngine.setHabitat('penguinPairsArctic');
    mathEngine.selectedQuestionType = 'doubles';
    mathEngine.selectedQuestionTemplate = templates[0];

    const problem = mathEngine.generateProblem();

    assert(
        problem.text.includes('penguin pairs'),
        `Expected doubles template to mention penguin pairs, got: ${problem.text}`
    );
    assert(problem.answer === problem.baseNumber * 2, 'Penguin doubles answer no longer matches the generated base number');
}

async function run() {
    await testBunnyMeadowAnswerRegistration();
    console.log('Bunny Meadow answer registration passed.');

    await testStartAgainResetsCurrentHabitat();
    console.log('Start Again habitat reset passed.');

    await testHabitatEntryResumesSavedQuestionNumber();
    console.log('Habitat entry resume passed.');

    await testPenguinPairsProgression();
    console.log('Penguin Pairs progression passed.');

    await testPenguinDoublesTemplateMatchesAnswer();
    console.log('Penguin doubles template consistency passed.');

    console.log('Habitat gameplay test suite passed.');
    process.exit(0);
}

run().catch((error) => {
    console.error('Habitat gameplay test failed:', error);
    process.exit(1);
});
