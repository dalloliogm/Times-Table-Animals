// Audio Manager for Times Table Animals
// Handles background music, sound effects, and voice narration

class AudioManager {
    constructor(settings) {
        this.settings = settings;
        this.audioContext = null;
        this.backgroundMusic = null;
        this.currentTrack = null;
        this.sfxSounds = {};
        this.voiceSounds = {};
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.voiceGain = null;
        this.voicePlaybackState = {
            lastSpokenAt: {},
            playCounts: {}
        };
        this.lastVoiceVariantIndex = {};
        
        this.init();
    }

    init() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupAudioNodes();
            this.loadAudioAssets();
        } catch (error) {
            console.warn('Web Audio API not supported, falling back to HTML5 Audio');
            this.useHTML5Audio = true;
        }
    }

    setupAudioNodes() {
        // Create gain nodes for volume control
        this.masterGain = this.audioContext.createGain();
        this.musicGain = this.audioContext.createGain();
        this.sfxGain = this.audioContext.createGain();
        this.voiceGain = this.audioContext.createGain();

        // Connect gain nodes
        this.musicGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.voiceGain.connect(this.masterGain);
        this.masterGain.connect(this.audioContext.destination);

        // Set initial volumes
        this.updateVolumes();
    }

    loadAudioAssets() {
        // Background music tracks
        this.musicTracks = {
            'menu': this.createAudioTrack('menu-music', true),
            'habitat-selection': this.createAudioTrack('habitat-selection-music', true),
            'bunnyMeadow': this.createAudioTrack('bunny-meadow-music', true),
            'penguinPairsArctic': this.createAudioTrack('penguin-pairs-arctic-music', true),
            'penguinArctic': this.createAudioTrack('penguin-arctic-music', true),
            'elephantSavanna': this.createAudioTrack('elephant-savanna-music', true),
            'monkeyJungle': this.createAudioTrack('monkey-jungle-music', true),
            'lionPride': this.createAudioTrack('lion-pride-music', true),
            'dolphinCove': this.createAudioTrack('dolphin-cove-music', true),
            'bearForest': this.createAudioTrack('bear-forest-music', true),
            'giraffePlains': this.createAudioTrack('giraffe-plains-music', true),
            'owlObservatory': this.createAudioTrack('owl-observatory-music', true),
            'dragonSanctuary': this.createAudioTrack('dragon-sanctuary-music', true),
            'rainbowReserve': this.createAudioTrack('rainbow-reserve-music', true)
        };

        // Sound effects
        const sfxTrackNames = [
            'correct',
            'incorrect',
            'badge-earned',
            'button-click',
            'ui-select',
            'click',
            'habitat-enter',
            'problem-appear',
            'new-problem',
            'celebration',
            'habitat-complete',
            'hint',
            'encouragement',
            'collect',
            'challenge-step',
            'times-table-practice',
            'equation-solve',
            'geometry-click',
            'telescope-focus',
            'telescope-view',
            'constellation-reveal',
            'bunny-hop',
            'penguin-waddle',
            'penguin-call',
            'elephant-trumpet',
            'monkey-chatter',
            'lion-roar',
            'dolphin-click',
            'bear-growl',
            'giraffe-munch',
            'giraffe-call',
            'owl-hoot',
            'dragon-breath',
            'dragon-roar',
            'zebra-neigh',
            'startled',
            'hunt-success',
            'munch',
            'vine-swing',
            'coconut-drop',
            'bubble-pop',
            'gentle-splash',
            'splash',
            'mud-splash',
            'honey-splash',
            'ice-crack',
            'stone-tap',
            'leaf-rustle',
            'leaves-rustle',
            'rustle-leaves',
            'cave-echo',
            'crystal-chime',
            'treasure-open',
            'treasure-reveal',
            'bell-ring',
            'sled-bell',
            'timer-warning',
            'timer-warning-urgent',
            'timer-warning-critical',
            'timer-warning-emergency',
            'volcano-rumble',
            'earthquake',
            'catastrophic-event',
            'volcanic-explosion',
            'ground-shake',
            'danger-siren'
        ];

        this.sfxTracks = Object.fromEntries(
            sfxTrackNames.map((trackName) => [trackName, this.createAudioTrack(`${trackName}-sfx`)])
        );

        // Voice narration
        this.voiceTracks = {
            'welcome': this.createAudioTrack('welcome-voice'),
            'habitat-intro': this.createAudioTrack('habitat-intro-voice'),
            'problem-intro': this.createAudioTrack('problem-intro-voice'),
            'encouragement': this.createAudioTrack('encouragement-voice'),
            'celebration': this.createAudioTrack('celebration-voice'),
            'badge-earned': this.createAudioTrack('badge-earned-voice')
        };
    }

    createAudioTrack(filename, isMusic = false) {
        // For now, we'll use placeholder audio or synthesized sounds
        // In a real implementation, these would load from actual audio files
        const audio = new Audio();
        
        // Generate placeholder audio data or use existing browser sounds
        if (this.useHTML5Audio) {
            audio.preload = 'auto';
            audio.volume = 0.5;
            if (isMusic) {
                audio.loop = true;
            }
        }
        
        return {
            audio: audio,
            isMusic: isMusic,
            loaded: false,
            playing: false
        };
    }

    updateVolumes() {
        if (!this.audioContext) return;
        
        const masterVolume = this.settings.masterVolume / 100;
        this.masterGain.gain.value = masterVolume;
        
        this.musicGain.gain.value = this.settings.musicEnabled ? 0.6 : 0;
        this.sfxGain.gain.value = this.settings.sfxEnabled ? 0.8 : 0;
        this.voiceGain.gain.value = this.settings.voiceEnabled ? 0.9 : 0;
    }

    setMasterVolume(volume) {
        this.settings.masterVolume = volume;
        this.updateVolumes();
    }

    toggleMusic(enabled) {
        this.settings.musicEnabled = enabled;
        this.updateVolumes();
        
        if (!enabled && this.currentTrack) {
            this.stopBackgroundMusic();
        }
    }

    toggleSFX(enabled) {
        this.settings.sfxEnabled = enabled;
        this.updateVolumes();
    }

    toggleVoice(enabled) {
        this.settings.voiceEnabled = enabled;
        this.updateVolumes();
    }

    playBackgroundMusic(trackName) {
        if (!this.settings.musicEnabled) return;
        
        // Stop current track if playing
        if (this.currentTrack) {
            this.stopBackgroundMusic();
        }
        
        const track = this.musicTracks[trackName];
        if (!track) {
            console.warn(`Background music track '${trackName}' not found`);
            return;
        }
        
        this.currentTrack = track;
        
        if (this.useHTML5Audio) {
            this.playHTML5Audio(track);
        } else {
            this.playWebAudio(track, this.musicGain);
        }
        
        // Generate synthesized background music for demo
        this.generateBackgroundMusic(trackName);
    }

    stopBackgroundMusic() {
        if (this.currentTrack) {
            if (this.useHTML5Audio) {
                this.currentTrack.audio.pause();
                this.currentTrack.audio.currentTime = 0;
            }
            this.currentTrack.playing = false;
            this.currentTrack = null;
        }
    }

    ensureSFXTrack(soundName) {
        if (!this.sfxTracks[soundName]) {
            this.sfxTracks[soundName] = this.createAudioTrack(`${soundName}-sfx`);
        }

        return this.sfxTracks[soundName];
    }

    playSFX(soundName) {
        if (!this.settings.sfxEnabled) return;
        
        const track = this.ensureSFXTrack(soundName);
        
        if (this.useHTML5Audio) {
            this.playHTML5Audio(track);
        } else {
            this.playWebAudio(track, this.sfxGain);
        }
        
        // Generate synthesized sound effect for demo
        this.generateSFX(soundName);
    }

    playVoice(voiceName) {
        if (!this.settings.voiceEnabled) return;

        if (!this.shouldPlayVoice(voiceName)) {
            return;
        }
        
        const track = this.voiceTracks[voiceName];
        if (!track) {
            console.warn(`Voice track '${voiceName}' not found`);
            return;
        }
        
        if (this.useHTML5Audio) {
            this.playHTML5Audio(track);
        } else {
            this.playWebAudio(track, this.voiceGain);
        }
        
        // For now, we'll use text-to-speech API if available
        this.speakText(this.getVoiceText(voiceName));
    }

    shouldPlayVoice(voiceName) {
        const now = Date.now();
        const lastSpoken = this.voicePlaybackState.lastSpokenAt[voiceName] || 0;
        const count = (this.voicePlaybackState.playCounts[voiceName] || 0) + 1;
        this.voicePlaybackState.playCounts[voiceName] = count;

        // Keep high-frequency feedback from becoming repetitive.
        const rules = {
            encouragement: { minIntervalMs: 10000, everyN: 3 },
            celebration: { minIntervalMs: 12000, everyN: 3 }
        };

        const rule = rules[voiceName];
        if (!rule) {
            this.voicePlaybackState.lastSpokenAt[voiceName] = now;
            return true;
        }

        if (now - lastSpoken < rule.minIntervalMs) {
            return false;
        }

        if (count % rule.everyN !== 0) {
            return false;
        }

        this.voicePlaybackState.lastSpokenAt[voiceName] = now;
        return true;
    }

    playHTML5Audio(track) {
        if (track.audio.readyState >= 2) {
            track.audio.currentTime = 0;
            track.audio.play().catch(error => {
                console.warn('Audio play failed:', error);
            });
        }
    }

    playWebAudio(track, gainNode) {
        // Web Audio API implementation would go here
        // For now, fall back to HTML5 audio
        this.playHTML5Audio(track);
    }

    generateBackgroundMusic(trackName) {
        // Generate simple synthesized background music using Web Audio API
        if (!this.audioContext || !this.settings.musicEnabled) return;
        
        const musicPatterns = {
            'menu': { notes: [261.63, 293.66, 329.63, 349.23], tempo: 500 },
            'bunnyMeadow': { notes: [349.23, 392.00, 440.00, 493.88], tempo: 400 },
            'penguinPairsArctic': { notes: [246.94, 293.66, 329.63, 369.99], tempo: 520 },
            'penguinArctic': { notes: [220.00, 246.94, 293.66, 329.63], tempo: 600 },
            'elephantSavanna': { notes: [174.61, 196.00, 220.00, 246.94], tempo: 800 }
        };
        
        const pattern = musicPatterns[trackName] || musicPatterns['menu'];
        this.playMelody(pattern.notes, pattern.tempo);
    }

    generateSFX(soundName) {
        // Generate simple synthesized sound effects
        if (!this.audioContext || !this.settings.sfxEnabled) return;

        const patternName = this.getSFXPatternName(soundName);
        
        const sfxPatterns = {
            'correct': { type: 'sine', frequency: 523.25, duration: 0.3 },
            'incorrect': { type: 'sawtooth', frequency: 146.83, duration: 0.5 },
            'badge-earned': { type: 'sine', frequency: 783.99, duration: 0.8 },
            'button-click': { type: 'square', frequency: 1000, duration: 0.1 },
            'problem-appear': { type: 'triangle', frequency: 659.25, duration: 0.18 },
            'celebration': { type: 'sine', frequency: 698.46, duration: 0.45 },
            'animal-call': { type: 'triangle', frequency: 220.00, duration: 0.35 },
            'water': { type: 'sine', frequency: 392.00, duration: 0.22 },
            'rustle': { type: 'sawtooth', frequency: 180.00, duration: 0.16 },
            'impact': { type: 'square', frequency: 246.94, duration: 0.12 },
            'chime': { type: 'sine', frequency: 880.00, duration: 0.3 },
            // Enhanced timer warning sounds
            'timer-warning': { type: 'sine', frequency: 440, duration: 0.3 },
            'timer-warning-urgent': { type: 'square', frequency: 523.25, duration: 0.5 },
            'timer-warning-critical': { type: 'sawtooth', frequency: 659.25, duration: 0.7 },
            'timer-warning-emergency': { type: 'square', frequency: 880, duration: 1.0 }
        };
        
        const pattern = sfxPatterns[patternName];
        if (pattern) {
            this.playTone(pattern.type, pattern.frequency, pattern.duration);
        }
        
        // Handle complex sound effects
        switch (patternName) {
            case 'volcano-rumble':
                this.playVolcanoRumble();
                break;
            case 'earthquake':
                this.playEarthquake();
                break;
            case 'catastrophic-event':
                this.playCatastrophicEvent();
                break;
            case 'volcanic-explosion':
                this.playVolcanicExplosion();
                break;
            case 'ground-shake':
                this.playGroundShake();
                break;
            case 'danger-siren':
                this.playDangerSiren();
                break;
        }
    }

    getSFXPatternName(soundName) {
        const aliases = {
            'ui-select': 'button-click',
            'click': 'button-click',
            'collect': 'celebration',
            'problem-appear': 'problem-appear',
            'new-problem': 'problem-appear',
            'hint': 'problem-appear',
            'encouragement': 'celebration',
            'habitat-complete': 'celebration',
            'times-table-practice': 'problem-appear',
            'equation-solve': 'problem-appear',
            'geometry-click': 'button-click',
            'telescope-focus': 'button-click',
            'telescope-view': 'problem-appear',
            'constellation-reveal': 'chime',
            'bell-ring': 'chime',
            'sled-bell': 'chime',
            'crystal-chime': 'chime',
            'treasure-open': 'chime',
            'treasure-reveal': 'chime',
            'bubble-pop': 'water',
            'gentle-splash': 'water',
            'splash': 'water',
            'mud-splash': 'water',
            'honey-splash': 'water',
            'ice-crack': 'impact',
            'stone-tap': 'impact',
            'challenge-step': 'impact',
            'coconut-drop': 'impact',
            'leaf-rustle': 'rustle',
            'leaves-rustle': 'rustle',
            'rustle-leaves': 'rustle',
            'vine-swing': 'rustle',
            'cave-echo': 'rustle',
            'penguin-call': 'animal-call',
            'giraffe-call': 'animal-call',
            'zebra-neigh': 'animal-call',
            'dragon-roar': 'animal-call',
            'startled': 'animal-call',
            'hunt-success': 'celebration',
            'munch': 'animal-call',
            'bunny-hop': 'animal-call',
            'elephant-trumpet': 'animal-call',
            'monkey-chatter': 'animal-call',
            'lion-roar': 'animal-call',
            'dolphin-click': 'animal-call',
            'bear-growl': 'animal-call',
            'giraffe-munch': 'animal-call',
            'owl-hoot': 'animal-call',
            'dragon-breath': 'animal-call'
        };

        return aliases[soundName] || soundName;
    }

    playTone(type, frequency, duration) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playMelody(notes, tempo) {
        if (!this.audioContext) return;
        
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playTone('sine', note, 0.2);
            }, index * tempo);
        });
    }

    speakText(text) {
        // Use Web Speech API for text-to-speech if available
        if ('speechSynthesis' in window && this.settings.voiceEnabled) {
            if (!text) {
                return;
            }

            // Prevent stacking multiple queued messages.
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.08;

            // Keep voice narration softer than music/SFX.
            const masterVolume = this.settings.masterVolume / 100;
            utterance.volume = Math.min(0.45, masterVolume * 0.6);
            
            // Try to use a child-friendly voice
            const voices = speechSynthesis.getVoices();
            const childVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('child') || 
                voice.name.toLowerCase().includes('young') ||
                voice.name.toLowerCase().includes('female')
            );
            
            if (childVoice) {
                utterance.voice = childVoice;
            }
            
            speechSynthesis.speak(utterance);
        }
    }

    getVoiceText(voiceName) {
        const voiceTexts = {
            'welcome': [
                'Welcome to Albert Animals. Ready for a math adventure?'
            ],
            'habitat-intro': [
                'Choose a habitat and help your animal friends.'
            ],
            'problem-intro': [
                'Try this math problem. You can do it.'
            ],
            'encouragement': [
                'Nice work!',
                'Great thinking!',
                'You are doing well!',
                'Keep it up!'
            ],
            'celebration': [
                'Correct!',
                'Excellent!',
                'Fantastic answer!',
                'Well done!'
            ],
            'badge-earned': [
                'Amazing! You earned a new badge!'
            ]
        };

        const variants = voiceTexts[voiceName];
        if (!variants || variants.length === 0) {
            return '';
        }

        if (variants.length === 1) {
            return variants[0];
        }

        const previousIndex = this.lastVoiceVariantIndex[voiceName];
        let nextIndex = Math.floor(Math.random() * variants.length);

        if (typeof previousIndex === 'number' && variants.length > 1) {
            while (nextIndex === previousIndex) {
                nextIndex = Math.floor(Math.random() * variants.length);
            }
        }

        this.lastVoiceVariantIndex[voiceName] = nextIndex;
        return variants[nextIndex];
    }

    pauseAll() {
        if (this.currentTrack && this.currentTrack.playing) {
            if (this.useHTML5Audio) {
                this.currentTrack.audio.pause();
            }
        }
    }

    resumeAll() {
        if (this.currentTrack && this.settings.musicEnabled) {
            if (this.useHTML5Audio) {
                this.currentTrack.audio.play().catch(error => {
                    console.warn('Audio resume failed:', error);
                });
            }
        }
    }

    // Enhanced dramatic sound effects for timer warnings
    playVolcanoRumble() {
        if (!this.audioContext) return;
        
        // Create low-frequency rumbling sound
        const duration = 2.0;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        // Low frequency rumble with slight randomization
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + duration);
        
        // Low-pass filter for muffled effect
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        // Fade in and out
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playEarthquake() {
        if (!this.audioContext) return;
        
        // Create earthquake rumble with multiple oscillators
        const duration = 3.0;
        const frequencies = [25, 35, 45, 55];
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.sfxGain);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, this.audioContext.currentTime);
            
            // Stagger the start times and vary intensities
            const startTime = this.audioContext.currentTime + (index * 0.1);
            const intensity = 0.2 - (index * 0.03);
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.exponentialRampToValueAtTime(intensity, startTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }
    
    playCatastrophicEvent() {
        if (!this.audioContext) return;
        
        // Dramatic explosion sound
        const duration = 2.5;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + duration);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playVolcanicExplosion() {
        if (!this.audioContext) return;
        
        // Multiple explosion layers
        const explosionLayers = [
            { freq: 100, duration: 1.0, gain: 0.3 },
            { freq: 200, duration: 0.8, gain: 0.2 },
            { freq: 400, duration: 0.5, gain: 0.1 }
        ];
        
        explosionLayers.forEach((layer, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.sfxGain);
                
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(layer.freq, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(layer.freq * 0.3, this.audioContext.currentTime + layer.duration);
                
                gainNode.gain.setValueAtTime(layer.gain, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + layer.duration);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + layer.duration);
            }, index * 100);
        });
    }
    
    playGroundShake() {
        if (!this.audioContext) return;
        
        // Quick rumble burst
        const duration = 0.5;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playDangerSiren() {
        if (!this.audioContext) return;
        
        // Alternating high-low siren
        const duration = 2.0;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        // Create siren effect
        for (let i = 0; i < 4; i++) {
            const startTime = this.audioContext.currentTime + (i * 0.5);
            oscillator.frequency.setValueAtTime(800, startTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, startTime + 0.25);
            oscillator.frequency.exponentialRampToValueAtTime(800, startTime + 0.5);
        }
        
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Clean up audio resources
    destroy() {
        this.stopBackgroundMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}