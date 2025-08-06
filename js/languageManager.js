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
                    'menu.credits': 'Credits (people who made this game)',
                    
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
                    'habitat.rainbowReserve': 'Rainbow Reserve',
                    
                    // Habitat Descriptions
                    'habitat.desc.addition_subtraction': 'Addition & Subtraction',
                    'habitat.desc.doubles_tables': 'Doubles (2× Tables)',
                    'habitat.desc.multiplication': 'Multiplication',
                    'habitat.desc.division': 'Division',
                    'habitat.desc.fractions': 'Fractions',
                    'habitat.desc.equations_word': 'Equations & Word Problems',
                    'habitat.desc.decimals_measurement': 'Decimals & Measurement',
                    'habitat.desc.mixed_operations': 'Mixed Operations',
                    'habitat.desc.measurement_geometry': 'Measurement & Geometry',
                    'habitat.desc.advanced_multiplication': 'Advanced Multiplication',
                    'habitat.desc.exponentials_advanced': 'Exponentials & Advanced',
                    'habitat.desc.ultimate_challenge': 'Ultimate Challenge',
                    
                    // Problem Titles
                    'problem.help_bunnies': 'Help the Bunnies!',
                    'problem.help_penguins': 'Help the Penguins!',
                    'problem.help_elephants': 'Help the Elephants!',
                    'problem.help_monkeys': 'Help the Monkeys!',
                    'problem.help_lions': 'Help the Lions!',
                    'problem.help_dolphins': 'Help the Dolphins!',
                    'problem.help_bears': 'Help the Bears!',
                    'problem.help_giraffes': 'Help the Giraffes!',
                    'problem.help_owls': 'Help the Owls!',
                    'problem.help_dragons': 'Help the Dragons!',
                    'problem.penguin_pairs': 'Penguin Pairs!',
                    'problem.penguin_story': 'Penguin Story Problem!',
                    'problem.challenge': 'Challenge Problem!',
                    'problem.story': 'Story Problem!',
                    
                    // Timer and Game Messages
                    'timer.warning': 'minute remaining!',
                    'timer.catastrophic_title': 'VOLCANO ERUPTS!',
                    'timer.catastrophic_message': 'Time ran out! The volcano erupted and scared away all the animals! Don\'t worry - you can try again!',
                    'timer.try_again': 'Try Again',
                    'timer.choose_different': 'Choose Different Habitat',
                    
                    // Feedback Messages
                    'feedback.correct': 'Correct! Well done!',
                    'feedback.incorrect': 'Not quite right, try again!',
                    'feedback.continue': 'Continue',
                    
                    // Credits
                    'credits.title': 'Credits',
                    'credits.team_title': 'Development Team',
                    'credits.albert_role': 'Leader, CEO, Director & Designer',
                    'credits.albert_desc': 'Visionary behind Times Table Animals and creative director',
                    'credits.giovanni_role': 'Computer Expert',
                    'credits.giovanni_desc': 'Technical mastermind and programming wizard',
                    'credits.game_info_title': 'Game Information',
                    'credits.version': 'Version',
                    'credits.engine': 'Engine',
                    'credits.languages': 'Languages',
                    'credits.thanks_title': 'Special Thanks',
                    'credits.thanks_text': 'Thank you to all the young mathematicians who will embark on this animal adventure!',
                    'credits.mission': 'Our mission: Making math fun, one animal habitat at a time! 🐰🐧🐘',
                    'credits.back': 'Back to Menu'
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
                    'menu.credits': 'Créditos',
                    
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
                    'habitat.rainbowReserve': 'Reserva del Arcoíris',
                    
                    // Habitat Descriptions
                    'habitat.desc.addition_subtraction': 'Suma y Resta',
                    'habitat.desc.doubles_tables': 'Dobles (Tablas del 2×)',
                    'habitat.desc.multiplication': 'Multiplicación',
                    'habitat.desc.division': 'División',
                    'habitat.desc.fractions': 'Fracciones',
                    'habitat.desc.equations_word': 'Ecuaciones y Problemas de Palabras',
                    'habitat.desc.decimals_measurement': 'Decimales y Medición',
                    'habitat.desc.mixed_operations': 'Operaciones Mixtas',
                    'habitat.desc.measurement_geometry': 'Medición y Geometría',
                    'habitat.desc.advanced_multiplication': 'Multiplicación Avanzada',
                    'habitat.desc.exponentials_advanced': 'Exponenciales y Avanzado',
                    'habitat.desc.ultimate_challenge': 'Desafío Definitivo',
                    
                    // Problem Titles
                    'problem.help_bunnies': '¡Ayuda a los Conejos!',
                    'problem.help_penguins': '¡Ayuda a los Pingüinos!',
                    'problem.help_elephants': '¡Ayuda a los Elefantes!',
                    'problem.help_monkeys': '¡Ayuda a los Monos!',
                    'problem.help_lions': '¡Ayuda a los Leones!',
                    'problem.help_dolphins': '¡Ayuda a los Delfines!',
                    'problem.help_bears': '¡Ayuda a los Osos!',
                    'problem.help_giraffes': '¡Ayuda a las Jirafas!',
                    'problem.help_owls': '¡Ayuda a los Búhos!',
                    'problem.help_dragons': '¡Ayuda a los Dragones!',
                    'problem.penguin_pairs': '¡Parejas de Pingüinos!',
                    'problem.penguin_story': '¡Problema de Historia de Pingüinos!',
                    'problem.challenge': '¡Problema de Desafío!',
                    'problem.story': '¡Problema de Historia!',
                    
                    // Timer and Game Messages
                    'timer.warning': '¡minuto restante!',
                    'timer.catastrophic_title': '¡EL VOLCÁN ERUPCIONA!',
                    'timer.catastrophic_message': '¡Se acabó el tiempo! ¡El volcán hizo erupción y asustó a todos los animales! ¡No te preocupes - puedes intentarlo de nuevo!',
                    'timer.try_again': 'Intentar de Nuevo',
                    'timer.choose_different': 'Elegir Hábitat Diferente',
                    
                    // Feedback Messages
                    'feedback.correct': '¡Correcto! ¡Muy bien!',
                    'feedback.incorrect': '¡No del todo correcto, inténtalo de nuevo!',
                    'feedback.continue': 'Continuar',
                    
                    // Credits
                    'credits.title': 'Créditos',
                    'credits.team_title': 'Equipo de Desarrollo',
                    'credits.albert_role': 'Líder, CEO, Director y Diseñador',
                    'credits.albert_desc': 'Visionario detrás de Animales de Tablas y director creativo',
                    'credits.giovanni_role': 'Experto en Computación',
                    'credits.giovanni_desc': 'Maestro técnico y mago de la programación',
                    'credits.game_info_title': 'Información del Juego',
                    'credits.version': 'Versión',
                    'credits.engine': 'Motor',
                    'credits.languages': 'Idiomas',
                    'credits.thanks_title': 'Agradecimientos Especiales',
                    'credits.thanks_text': '¡Gracias a todos los jóvenes matemáticos que se embarcarán en esta aventura animal!',
                    'credits.mission': '¡Nuestra misión: hacer que las matemáticas sean divertidas, un hábitat animal a la vez! 🐰🐧🐘',
                    'credits.back': 'Volver al Menú'
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
                    'menu.credits': 'Crediti',
                    
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
                    'habitat.rainbowReserve': 'Riserva dell\'Arcobaleno',
                    
                    // Habitat Descriptions
                    'habitat.desc.addition_subtraction': 'Addizione e Sottrazione',
                    'habitat.desc.doubles_tables': 'Doppie (Tabelle del 2×)',
                    'habitat.desc.multiplication': 'Moltiplicazione',
                    'habitat.desc.division': 'Divisione',
                    'habitat.desc.fractions': 'Frazioni',
                    'habitat.desc.equations_word': 'Equazioni e Problemi di Parole',
                    'habitat.desc.decimals_measurement': 'Decimali e Misurazione',
                    'habitat.desc.mixed_operations': 'Operazioni Miste',
                    'habitat.desc.measurement_geometry': 'Misurazione e Geometria',
                    'habitat.desc.advanced_multiplication': 'Moltiplicazione Avanzata',
                    'habitat.desc.exponentials_advanced': 'Esponenziali e Avanzato',
                    'habitat.desc.ultimate_challenge': 'Sfida Definitiva',
                    
                    // Problem Titles
                    'problem.help_bunnies': 'Aiuta i Conigli!',
                    'problem.help_penguins': 'Aiuta i Pinguini!',
                    'problem.help_elephants': 'Aiuta gli Elefanti!',
                    'problem.help_monkeys': 'Aiuta le Scimmie!',
                    'problem.help_lions': 'Aiuta i Leoni!',
                    'problem.help_dolphins': 'Aiuta i Delfini!',
                    'problem.help_bears': 'Aiuta gli Orsi!',
                    'problem.help_giraffes': 'Aiuta le Giraffe!',
                    'problem.help_owls': 'Aiuta i Gufi!',
                    'problem.help_dragons': 'Aiuta i Draghi!',
                    'problem.penguin_pairs': 'Coppie di Pinguini!',
                    'problem.penguin_story': 'Problema Storia di Pinguini!',
                    'problem.challenge': 'Problema Sfida!',
                    'problem.story': 'Problema Storia!',
                    
                    // Timer and Game Messages
                    'timer.warning': 'minuto rimanente!',
                    'timer.catastrophic_title': 'IL VULCANO ERUTTA!',
                    'timer.catastrophic_message': 'Tempo scaduto! Il vulcano è esploso e ha spaventato tutti gli animali! Non preoccuparti - puoi riprovare!',
                    'timer.try_again': 'Riprova',
                    'timer.choose_different': 'Scegli Habitat Diverso',
                    
                    // Feedback Messages
                    'feedback.correct': 'Corretto! Ben fatto!',
                    'feedback.incorrect': 'Non proprio giusto, riprova!',
                    'feedback.continue': 'Continua',
                    
                    // Credits
                    'credits.title': 'Crediti',
                    'credits.team_title': 'Team di Sviluppo',
                    'credits.albert_role': 'Leader, CEO, Direttore e Designer',
                    'credits.albert_desc': 'Visionario dietro Animali delle Tabelline e direttore creativo',
                    'credits.giovanni_role': 'Esperto di Computer',
                    'credits.giovanni_desc': 'Genio tecnico e mago della programmazione',
                    'credits.game_info_title': 'Informazioni sul Gioco',
                    'credits.version': 'Versione',
                    'credits.engine': 'Motore',
                    'credits.languages': 'Lingue',
                    'credits.thanks_title': 'Ringraziamenti Speciali',
                    'credits.thanks_text': 'Grazie a tutti i giovani matematici che intraprenderanno questa avventura animale!',
                    'credits.mission': 'La nostra missione: rendere la matematica divertente, un habitat animale alla volta! 🐰🐧🐘',
                    'credits.back': 'Torna al Menu'
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