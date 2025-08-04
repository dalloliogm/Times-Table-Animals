// Language Manager for Times Table Animals
// Handles internationalization and language switching

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.languages = {
            'en': {
                code: 'en',
                name: 'English',
                flag: '🇺🇸',
                translations: {
                    // Main Menu
                    'game.title': 'Times Table Animals',
                    'game.subtitle': 'Welcome to Albert Animals!',
                    'menu.start': 'Start Adventure',
                    'menu.settings': 'Settings',
                    'menu.achievements': 'Achievements',
                    
                    // Settings
                    'settings.title': 'Settings',
                    'settings.language': 'Language',
                    'settings.music': 'Background Music',
                    'settings.sfx': 'Sound Effects',
                    'settings.voice': 'Voice Narration',
                    'settings.volume': 'Master Volume',
                    'settings.difficulty': 'Difficulty',
                    'settings.reset': 'Reset Progress',
                    'settings.back': 'Back to Menu',
                    
                    // Difficulty Levels
                    'difficulty.easy': 'Easy',
                    'difficulty.medium': 'Medium',
                    'difficulty.hard': 'Hard',
                    
                    // Habitat Selection
                    'habitat.choose': 'Choose Your Habitat',
                    'habitat.back': 'Back',
                    
                    // Game UI
                    'game.home': '🏠',
                    'game.pause': '⏸️',
                    'game.settings': '⚙️',
                    
                    // Habitat Names
                    'habitat.bunnyMeadow': 'Bunny Meadow',
                    'habitat.penguinPairsArctic': 'Penguin Pairs Arctic',
                    'habitat.penguinArctic': 'Penguin Arctic',
                    'habitat.elephantSavanna': 'Elephant Savanna',
                    'habitat.monkeyJungle': 'Monkey Jungle',
                    'habitat.lionPride': 'Lion Pride',
                    'habitat.dolphinCove': 'Dolphin Cove',
                    'habitat.bearForest': 'Bear Forest',
                    'habitat.giraffePlains': 'Giraffe Plains',
                    'habitat.owlObservatory': 'Owl Observatory',
                    'habitat.dragonSanctuary': 'Dragon Sanctuary',
                    'habitat.rainbowReserve': 'Rainbow Reserve'
                }
            },
            'es': {
                code: 'es',
                name: 'Español',
                flag: '🇪🇸',
                translations: {
                    // Main Menu
                    'game.title': 'Animales de Tablas',
                    'game.subtitle': '¡Bienvenido a Albert Animales!',
                    'menu.start': 'Comenzar Aventura',
                    'menu.settings': 'Configuración',
                    'menu.achievements': 'Logros',
                    
                    // Settings
                    'settings.title': 'Configuración',
                    'settings.language': 'Idioma',
                    'settings.music': 'Música de Fondo',
                    'settings.sfx': 'Efectos de Sonido',
                    'settings.voice': 'Narración de Voz',
                    'settings.volume': 'Volumen Principal',
                    'settings.difficulty': 'Dificultad',
                    'settings.reset': 'Reiniciar Progreso',
                    'settings.back': 'Volver al Menú',
                    
                    // Difficulty Levels
                    'difficulty.easy': 'Fácil',
                    'difficulty.medium': 'Medio',
                    'difficulty.hard': 'Difícil',
                    
                    // Habitat Selection
                    'habitat.choose': 'Elige tu Hábitat',
                    'habitat.back': 'Atrás',
                    
                    // Game UI
                    'game.home': '🏠',
                    'game.pause': '⏸️',
                    'game.settings': '⚙️',
                    
                    // Habitat Names
                    'habitat.bunnyMeadow': 'Prado de Conejos',
                    'habitat.penguinPairsArctic': 'Ártico de Parejas de Pingüinos',
                    'habitat.penguinArctic': 'Ártico de Pingüinos',
                    'habitat.elephantSavanna': 'Sabana de Elefantes',
                    'habitat.monkeyJungle': 'Selva de Monos',
                    'habitat.lionPride': 'Manada de Leones',
                    'habitat.dolphinCove': 'Cala de Delfines',
                    'habitat.bearForest': 'Bosque de Osos',
                    'habitat.giraffePlains': 'Llanuras de Jirafas',
                    'habitat.owlObservatory': 'Observatorio de Búhos',
                    'habitat.dragonSanctuary': 'Santuario de Dragones',
                    'habitat.rainbowReserve': 'Reserva del Arcoíris'
                }
            },
            'it': {
                code: 'it',
                name: 'Italiano',
                flag: '🇮🇹',
                translations: {
                    // Main Menu
                    'game.title': 'Animali delle Tabelline',
                    'game.subtitle': 'Benvenuto agli Animali di Albert!',
                    'menu.start': 'Inizia Avventura',
                    'menu.settings': 'Impostazioni',
                    'menu.achievements': 'Risultati',
                    
                    // Settings
                    'settings.title': 'Impostazioni',
                    'settings.language': 'Lingua',
                    'settings.music': 'Musica di Sottofondo',
                    'settings.sfx': 'Effetti Sonori',
                    'settings.voice': 'Narrazione Vocale',
                    'settings.volume': 'Volume Principale',
                    'settings.difficulty': 'Difficoltà',
                    'settings.reset': 'Azzera Progresso',
                    'settings.back': 'Torna al Menu',
                    
                    // Difficulty Levels
                    'difficulty.easy': 'Facile',
                    'difficulty.medium': 'Medio',
                    'difficulty.hard': 'Difficile',
                    
                    // Habitat Selection
                    'habitat.choose': 'Scegli il tuo Habitat',
                    'habitat.back': 'Indietro',
                    
                    // Game UI
                    'game.home': '🏠',
                    'game.pause': '⏸️',
                    'game.settings': '⚙️',
                    
                    // Habitat Names
                    'habitat.bunnyMeadow': 'Prato dei Conigli',
                    'habitat.penguinPairsArctic': 'Artico delle Coppie di Pinguini',
                    'habitat.penguinArctic': 'Artico dei Pinguini',
                    'habitat.elephantSavanna': 'Savana degli Elefanti',
                    'habitat.monkeyJungle': 'Giungla delle Scimmie',
                    'habitat.lionPride': 'Branco di Leoni',
                    'habitat.dolphinCove': 'Baia dei Delfini',
                    'habitat.bearForest': 'Foresta degli Orsi',
                    'habitat.giraffePlains': 'Pianure delle Giraffe',
                    'habitat.owlObservatory': 'Osservatorio dei Gufi',
                    'habitat.dragonSanctuary': 'Santuario dei Draghi',
                    'habitat.rainbowReserve': 'Riserva dell\'Arcobaleno'
                }
            }
        };
        
        this.translationElements = new Map();
        this.init();
    }

    init() {
        // Load saved language preference
        this.loadLanguagePreference();
        
        // Register translation elements
        this.registerTranslationElements();
        
        // Apply current language
        this.updateAllTranslations();
    }

    loadLanguagePreference() {
        try {
            const savedState = localStorage.getItem('timesTableAnimalsGame');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                if (parsed.settings && parsed.settings.language) {
                    this.currentLanguage = parsed.settings.language;
                }
            }
        } catch (error) {
            console.warn('Could not load language preference:', error);
            this.currentLanguage = 'en';
        }
    }

    registerTranslationElements() {
        // Clear existing registrations
        this.translationElements.clear();
        
        // Register elements with data-translate attributes
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (!this.translationElements.has(key)) {
                this.translationElements.set(key, []);
            }
            this.translationElements.get(key).push(element);
        });
    }

    translate(key) {
        const currentLang = this.languages[this.currentLanguage];
        if (currentLang && currentLang.translations[key]) {
            return currentLang.translations[key];
        }
        
        // Fallback to English
        const englishLang = this.languages['en'];
        if (englishLang && englishLang.translations[key]) {
            return englishLang.translations[key];
        }
        
        // Return key if no translation found
        return key;
    }

    setLanguage(languageCode) {
        if (this.languages[languageCode]) {
            this.currentLanguage = languageCode;
            this.updateAllTranslations();
            this.updateLanguageSelector();
            
            // Trigger event for other components
            const event = new CustomEvent('languageChanged', {
                detail: { language: languageCode }
            });
            document.dispatchEvent(event);
        }
    }

    updateAllTranslations() {
        // Re-register elements in case DOM has changed
        this.registerTranslationElements();
        
        // Update all registered elements
        this.translationElements.forEach((elements, key) => {
            const translation = this.translate(key);
            elements.forEach(element => {
                if (element.tagName === 'INPUT' && element.type === 'button') {
                    element.value = translation;
                } else if (element.tagName === 'INPUT') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            });
        });
    }

    updateLanguageSelector() {
        const languageButton = document.getElementById('languageSelectorBtn');
        if (languageButton) {
            const currentLang = this.languages[this.currentLanguage];
            const flagSpan = languageButton.querySelector('.language-flag');
            const nameSpan = languageButton.querySelector('.language-name');
            
            if (flagSpan && nameSpan && currentLang) {
                flagSpan.textContent = currentLang.flag;
                nameSpan.textContent = currentLang.name;
            }
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return Object.keys(this.languages).map(code => ({
            code: code,
            name: this.languages[code].name,
            flag: this.languages[code].flag
        }));
    }

    getLanguageData(code) {
        return this.languages[code] || this.languages['en'];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}