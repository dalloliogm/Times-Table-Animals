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
        this.sfxTracks = {
            'correct': this.createAudioTrack('correct-answer-sfx'),
            'incorrect': this.createAudioTrack('incorrect-answer-sfx'),
            'badge-earned': this.createAudioTrack('badge-earned-sfx'),
            'button-click': this.createAudioTrack('button-click-sfx'),
            'habitat-enter': this.createAudioTrack('habitat-enter-sfx'),
            'problem-appear': this.createAudioTrack('problem-appear-sfx'),
            'celebration': this.createAudioTrack('celebration-sfx'),
            'bunny-hop': this.createAudioTrack('bunny-hop-sfx'),
            'penguin-waddle': this.createAudioTrack('penguin-waddle-sfx'),
            'elephant-trumpet': this.createAudioTrack('elephant-trumpet-sfx'),
            'monkey-chatter': this.createAudioTrack('monkey-chatter-sfx'),
            'lion-roar': this.createAudioTrack('lion-roar-sfx'),
            'dolphin-click': this.createAudioTrack('dolphin-click-sfx'),
            'bear-growl': this.createAudioTrack('bear-growl-sfx'),
            'giraffe-munch': this.createAudioTrack('giraffe-munch-sfx'),
            'owl-hoot': this.createAudioTrack('owl-hoot-sfx'),
            'dragon-breath': this.createAudioTrack('dragon-breath-sfx'),
            // Enhanced timer warning sounds
            'timer-warning': this.createAudioTrack('timer-warning-sfx'),
            'timer-warning-urgent': this.createAudioTrack('timer-warning-urgent-sfx'),
            'timer-warning-critical': this.createAudioTrack('timer-warning-critical-sfx'),
            'timer-warning-emergency': this.createAudioTrack('timer-warning-emergency-sfx'),
            'volcano-rumble': this.createAudioTrack('volcano-rumble-sfx'),
            'earthquake': this.createAudioTrack('earthquake-sfx'),
            'catastrophic-event': this.createAudioTrack('catastrophic-event-sfx'),
            'volcanic-explosion': this.createAudioTrack('volcanic-explosion-sfx'),
            'ground-shake': this.createAudioTrack('ground-shake-sfx'),
            'danger-siren': this.createAudioTrack('danger-siren-sfx')
        };

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

    playSFX(soundName) {
        if (!this.settings.sfxEnabled) return;
        
        const track = this.sfxTracks[soundName];
        if (!track) {
            console.warn(`Sound effect '${soundName}' not found`);
            return;
        }
        
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
            'penguinArctic': { notes: [220.00, 246.94, 293.66, 329.63], tempo: 600 },
            'elephantSavanna': { notes: [174.61, 196.00, 220.00, 246.94], tempo: 800 }
        };
        
        const pattern = musicPatterns[trackName] || musicPatterns['menu'];
        this.playMelody(pattern.notes, pattern.tempo);
    }

    generateSFX(soundName) {
        // Generate simple synthesized sound effects
        if (!this.audioContext || !this.settings.sfxEnabled) return;
        
        const sfxPatterns = {
            'correct': { type: 'sine', frequency: 523.25, duration: 0.3 },
            'incorrect': { type: 'sawtooth', frequency: 146.83, duration: 0.5 },
            'badge-earned': { type: 'sine', frequency: 783.99, duration: 0.8 },
            'button-click': { type: 'square', frequency: 1000, duration: 0.1 },
            // Enhanced timer warning sounds
            'timer-warning': { type: 'sine', frequency: 440, duration: 0.3 },
            'timer-warning-urgent': { type: 'square', frequency: 523.25, duration: 0.5 },
            'timer-warning-critical': { type: 'sawtooth', frequency: 659.25, duration: 0.7 },
            'timer-warning-emergency': { type: 'square', frequency: 880, duration: 1.0 }
        };
        
        const pattern = sfxPatterns[soundName];
        if (pattern) {
            this.playTone(pattern.type, pattern.frequency, pattern.duration);
        }
        
        // Handle complex sound effects
        switch (soundName) {
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
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            utterance.volume = this.settings.masterVolume / 100;
            
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
            'welcome': 'Welcome to Welcome Albert Animals! Get ready for a mathematical adventure!',
            'habitat-intro': 'Choose a habitat to explore and help our animal friends!',
            'problem-intro': 'Here\'s a math problem to solve. Take your time and think carefully!',
            'encouragement': 'Great job! You\'re doing wonderful! Keep up the good work!',
            'celebration': 'Fantastic! You solved it correctly! The animals are so happy!',
            'badge-earned': 'Amazing! You\'ve earned a new badge! You\'re becoming a great animal caretaker!'
        };
        
        return voiceTexts[voiceName] || '';
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