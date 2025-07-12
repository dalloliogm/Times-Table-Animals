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
            'dragon-breath': this.createAudioTrack('dragon-breath-sfx')
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
            'button-click': { type: 'square', frequency: 1000, duration: 0.1 }
        };
        
        const pattern = sfxPatterns[soundName];
        if (pattern) {
            this.playTone(pattern.type, pattern.frequency, pattern.duration);
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