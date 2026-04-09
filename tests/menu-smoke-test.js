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
                frequency: { value: 440 },
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
        getVoices() { return []; }
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

async function run() {
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

    const unhandledErrors = [];
    window.addEventListener('error', (event) => {
        unhandledErrors.push(event.error || new Error(event.message));
    });

    window.document.write(htmlWithoutScripts);
    loadScripts(window, scripts, rootDir);

    window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));

    assert(window.gameController, 'GameController did not initialize');

    window.gameController.forceOpenMainMenu();

    const clickAndAssert = (buttonId, screenId) => {
        const button = window.document.getElementById(buttonId);
        assert(button, `Missing button ${buttonId}`);
        button.click();
        const screen = window.document.getElementById(screenId);
        assert(screen && screen.classList.contains('active'), `${buttonId} did not activate ${screenId}`);
    };

    clickAndAssert('settingsBtn', 'settingsMenu');
    clickAndAssert('backToMenuBtn', 'mainMenu');
    clickAndAssert('achievementsBtn', 'achievementsScreen');
    clickAndAssert('backToMenuFromAchievements', 'mainMenu');
    clickAndAssert('creditsBtn', 'creditsScreen');
    clickAndAssert('backToMenuFromCredits', 'mainMenu');
    clickAndAssert('startGameBtn', 'habitatSelect');

    if (unhandledErrors.length > 0) {
        throw unhandledErrors[0];
    }

    console.log('Menu smoke test passed.');
    process.exit(0);
}

run().catch((error) => {
    console.error('Menu smoke test failed:', error);
    process.exit(1);
});
