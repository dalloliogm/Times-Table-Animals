// Math Engine for Times Table Animals
// Generates math problems and validates answers

class MathEngine {
    constructor() {
        this.currentProblem = null;
        this.problemHistory = [];
        this.difficultyLevel = 1;
        this.globalDifficulty = 'medium'; // easy, medium, hard
        this.currentHabitat = 'bunnyMeadow';
        this.selectedQuestionTemplate = null;
        this.selectedQuestionType = null;
        this.currentLanguage = 'en'; // Default to English
        
        this.problemTypes = {
            bunnyMeadow: ['addition'],
            penguinPairsArctic: ['doubles', 'doubles_word_problems'],
            penguinArctic: ['multiplication', 'simple_division'],
            elephantSavanna: ['division', 'multiplication'],
            monkeyJungle: ['fractions', 'mixed_operations'],
            lionPride: ['equations', 'word_problems'],
            dolphinCove: ['decimals', 'measurement'],
            bearForest: ['mixed_operations', 'word_problems'],
            giraffePlains: ['measurement', 'geometry'],
            owlObservatory: ['advanced_multiplication', 'patterns'],
            dragonSanctuary: ['exponentials', 'advanced_equations'],
            rainbowReserve: ['all_concepts', 'challenge_problems']
        };
        
        // Load the multilingual question templates
        this.loadQuestionTemplates();
    }
    
    loadQuestionTemplates() {
        // Use the global QuestionTemplates if available, otherwise fallback
        if (typeof QuestionTemplates !== 'undefined') {
            this.questionTemplatesData = QuestionTemplates;
        } else {
            console.warn('QuestionTemplates not loaded, using fallback English templates');
            this.questionTemplatesData = {
                'en': {
                    addition: ['There are {a} items and {b} more items. How many total?'],
                    subtraction: ['There were {a} items, {b} were taken. How many left?'],
                    doubles: ['There are {n} pairs. How many items total?'],
                    doubles_word_problems: ['Each has 2 items. With {n} groups, how many total?'],
                    multiplication: ['Each group has {a} items. With {b} groups, how many total?'],
                    simple_division: ['{a} items shared among {b} groups. How many per group?'],
                    division: ['{a} items divided by {b}. What is the result?'],
                    fractions: ['What is {n}/{d} of the total?'],
                    equations: ['Solve for x: {a}x = {b}'],
                    decimals: ['Calculate: {a} + {b}'],
                    exponentials: ['What is {base} squared?'],
                    mixed_operations: ['Calculate: {a} + {b} × {c}'],
                    word_problems: ['Solve this problem step by step.']
                }
            };
        }
    }
    
    getQuestionTemplates() {
        const langTemplates = this.questionTemplatesData[this.currentLanguage];
        if (langTemplates) {
            return langTemplates;
        }
        
        // Fallback to English if current language not found
        console.warn(`Templates for language '${this.currentLanguage}' not found, falling back to English`);
        return this.questionTemplatesData['en'] || {};
    }
    
    setLanguage(languageCode) {
        this.currentLanguage = languageCode;
        console.log(`MathEngine: Language set to ${languageCode}`);
        
        // Store reference to language manager for translations
        if (typeof window !== 'undefined' && window.gameController && window.gameController.languageManager) {
            this.languageManager = window.gameController.languageManager;
        }
        
        // Re-select question template for current level with new language
        if (this.selectedQuestionType) {
            this.selectLevelQuestionTemplate();
        }
    }
    
    translate(key) {
        // Try to get language manager reference if not available
        if (!this.languageManager) {
            if (typeof window !== 'undefined' && window.gameController && window.gameController.languageManager) {
                this.languageManager = window.gameController.languageManager;
            }
        }
        
        if (this.languageManager && this.languageManager.translate) {
            return this.languageManager.translate(key);
        }
        
        // Fallback: try to access global language manager directly
        if (typeof window !== 'undefined' && window.languageManager && window.languageManager.translate) {
            return window.languageManager.translate(key);
        }
        
        console.warn(`MathEngine: Translation failed for key '${key}', returning key as fallback`);
        return key; // fallback to key if no translator available
    }

    setHabitat(habitat) {
        this.currentHabitat = habitat;
        this.difficultyLevel = this.getHabitatDifficulty(habitat);
        // Apply global difficulty adjustment
        this.applyGlobalDifficultyAdjustment();
        // Select question template for this level
        this.selectLevelQuestionTemplate();
    }

    setDifficulty(difficulty) {
        this.globalDifficulty = difficulty;
        console.log(`Math Engine: Difficulty set to ${difficulty}`);
        // Reapply difficulty adjustment if we have a current habitat
        if (this.currentHabitat) {
            this.applyGlobalDifficultyAdjustment();
        }
    }

    applyGlobalDifficultyAdjustment() {
        const baseDifficulty = this.getHabitatDifficulty(this.currentHabitat);
        
        switch (this.globalDifficulty) {
            case 'easy':
                this.difficultyLevel = Math.max(1, baseDifficulty - 2);
                break;
            case 'medium':
                this.difficultyLevel = baseDifficulty;
                break;
            case 'hard':
                this.difficultyLevel = baseDifficulty + 2;
                break;
            default:
                this.difficultyLevel = baseDifficulty;
        }
        
        console.log(`Applied difficulty adjustment: ${this.globalDifficulty} -> Level ${this.difficultyLevel}`);
    }

    selectLevelQuestionTemplate() {
        // Get problem types for current habitat
        const problemTypes = this.problemTypes[this.currentHabitat];
        
        // Randomly select one problem type for the entire level
        this.selectedQuestionType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        
        // Get available templates for the selected problem type in current language
        const questionTemplates = this.getQuestionTemplates();
        const availableTemplates = questionTemplates[this.selectedQuestionType];
        if (availableTemplates) {
            // Randomly select one template for the entire level
            const templateIndex = Math.floor(Math.random() * availableTemplates.length);
            this.selectedQuestionTemplate = availableTemplates[templateIndex];
        }
        
        console.log(`Selected question type: ${this.selectedQuestionType}, template: ${this.selectedQuestionTemplate}`);
    }

    highlightNumbers(text) {
        // Find all numbers in the text and wrap them with highlighting spans
        return text.replace(/\b\d+\b/g, '<span class="highlighted-number">$&</span>');
    }

    getHabitatDifficulty(habitat) {
        const difficultyMap = {
            bunnyMeadow: 1,
            penguinPairsArctic: 2,
            penguinArctic: 3,
            elephantSavanna: 4,
            monkeyJungle: 5,
            lionPride: 6,
            dolphinCove: 7,
            bearForest: 8,
            giraffePlains: 9,
            owlObservatory: 10,
            dragonSanctuary: 11,
            rainbowReserve: 12
        };
        return difficultyMap[habitat] || 1;
    }

    generateProblem() {
        // Use the selected question type for the level instead of random selection
        const problemType = this.selectedQuestionType;
        
        let problem;
        switch (problemType) {
            case 'addition':
                problem = this.generateAdditionProblem();
                break;
            case 'subtraction':
                problem = this.generateSubtractionProblem();
                break;
            case 'doubles':
                problem = this.generateDoublesProblem();
                break;
            case 'doubles_word_problems':
                problem = this.generateDoublesWordProblem();
                break;
            case 'multiplication':
                problem = this.generateMultiplicationProblem();
                break;
            case 'simple_division':
                problem = this.generateSimpleDivisionProblem();
                break;
            case 'division':
                problem = this.generateDivisionProblem();
                break;
            case 'fractions':
                problem = this.generateFractionProblem();
                break;
            case 'equations':
                problem = this.generateEquationProblem();
                break;
            case 'decimals':
                problem = this.generateDecimalProblem();
                break;
            case 'exponentials':
                problem = this.generateExponentialProblem();
                break;
            case 'mixed_operations':
                problem = this.generateMixedOperationProblem();
                break;
            case 'word_problems':
                problem = this.generateWordProblem();
                break;
            case 'measurement':
                problem = this.generateMeasurementProblem();
                break;
            case 'geometry':
                problem = this.generateGeometryProblem();
                break;
            case 'advanced_multiplication':
                problem = this.generateAdvancedMultiplicationProblem();
                break;
            case 'patterns':
                problem = this.generatePatternProblem();
                break;
            case 'advanced_equations':
                problem = this.generateAdvancedEquationProblem();
                break;
            case 'all_concepts':
                problem = this.generateAllConceptsProblem();
                break;
            case 'challenge_problems':
                problem = this.generateChallengeProblem();
                break;
            default:
                problem = this.generateAdditionProblem();
        }

        // Add multiple choice options
        const distractors = this.generateDistractors(problem);
        const allOptions = [problem.answer, ...distractors].slice(0, 4);
        
        // Shuffle options
        problem.options = this.shuffleArray(allOptions);
        problem.correctOptionIndex = problem.options.indexOf(problem.answer);
        
        this.currentProblem = problem;
        this.problemHistory.push(problem);
        return problem;
    }

    generateDistractors(problem) {
        const correctAnswer = problem.answer;
        let distractors = [];
        
        switch (problem.type) {
            case 'addition':
                distractors = this.generateAdditionDistractors(problem, correctAnswer);
                break;
            case 'subtraction':
                distractors = this.generateSubtractionDistractors(problem, correctAnswer);
                break;
            case 'multiplication':
                distractors = this.generateMultiplicationDistractors(problem, correctAnswer);
                break;
            case 'doubles':
            case 'doubles_word_problems':
                distractors = this.generateDoublesDistractors(problem, correctAnswer);
                break;
            case 'division':
            case 'simple_division':
                distractors = this.generateDivisionDistractors(problem, correctAnswer);
                break;
            case 'fractions':
                distractors = this.generateFractionDistractors(problem, correctAnswer);
                break;
            case 'equations':
                distractors = this.generateEquationDistractors(problem, correctAnswer);
                break;
            case 'exponentials':
                distractors = this.generateExponentialDistractors(problem, correctAnswer);
                break;
            case 'measurement':
            case 'geometry':
            case 'advanced_multiplication':
            case 'patterns':
            case 'advanced_equations':
            case 'all_concepts':
            case 'challenge_problems':
                distractors = this.generateAdvancedDistractors(problem, correctAnswer);
                break;
            default:
                distractors = this.generateGenericDistractors(correctAnswer);
        }
        
        // Ensure we have exactly 3 unique distractors
        const uniqueDistractors = [...new Set(distractors)].filter(d => d !== correctAnswer && d > 0);
        
        // If we don't have enough unique distractors, add some generic ones
        while (uniqueDistractors.length < 3) {
            const genericDistractor = this.generateGenericDistractor(correctAnswer, uniqueDistractors);
            if (!uniqueDistractors.includes(genericDistractor)) {
                uniqueDistractors.push(genericDistractor);
            }
        }
        
        return uniqueDistractors.slice(0, 3);
    }

    generateAdditionDistractors(problem, correctAnswer) {
        const numbers = problem.operation.match(/\d+/g);
        const a = parseInt(numbers[0]);
        const b = parseInt(numbers[1]);
        
        return [
            Math.abs(a - b), // Common mistake: subtraction instead of addition
            correctAnswer + 1, // Off by one error
            correctAnswer - 1, // Off by one error
            a * b, // Multiplication instead of addition
            Math.max(a, b), // Forgot to add the other number
            a + b + 10, // Decimal place error
            Math.floor(correctAnswer / 2) // Half the correct answer
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateSubtractionDistractors(problem, correctAnswer) {
        const numbers = problem.operation.match(/\d+/g);
        const a = parseInt(numbers[0]);
        const b = parseInt(numbers[1]);
        
        return [
            a + b, // Addition instead of subtraction
            correctAnswer + 1, // Off by one error
            correctAnswer - 1, // Off by one error
            b - a, // Subtracted in wrong order
            a, // Forgot to subtract
            b, // Just the subtrahend
            Math.abs(b - a) // Absolute value confusion
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateMultiplicationDistractors(problem, correctAnswer) {
        const numbers = problem.operation.match(/\d+/g);
        const a = parseInt(numbers[0]);
        const b = parseInt(numbers[1]);
        
        return [
            a + b, // Addition instead of multiplication
            correctAnswer + a, // Added one factor instead of multiplying
            correctAnswer - a, // Common calculation error
            a * (b + 1), // Off by one in one factor
            a * (b - 1), // Off by one in one factor
            (a + 1) * b, // Off by one in the other factor
            correctAnswer * 2, // Double the correct answer
            Math.floor(correctAnswer / 2) // Half the correct answer
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateDoublesDistractors(problem, correctAnswer) {
        const baseNumber = problem.baseNumber || Math.floor(correctAnswer / 2);
        
        return [
            baseNumber, // Forgot to double
            baseNumber + 2, // Added 2 instead of doubling
            correctAnswer + 1, // Off by one
            correctAnswer - 1, // Off by one
            baseNumber * 3, // Tripled instead of doubled
            correctAnswer + baseNumber, // Added the base number again
            baseNumber + 1 // Base number plus one
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateDivisionDistractors(problem, correctAnswer) {
        const numbers = problem.operation.match(/\d+/g);
        const dividend = parseInt(numbers[0]);
        const divisor = parseInt(numbers[1]);
        
        return [
            dividend - divisor, // Subtraction instead of division
            correctAnswer + 1, // Off by one error
            correctAnswer - 1, // Off by one error
            dividend, // Forgot to divide
            divisor, // Just the divisor
            Math.floor(dividend / 2), // Divided by 2 instead of divisor
            correctAnswer * 2 // Double the correct answer
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateFractionDistractors(problem, correctAnswer) {
        return [
            correctAnswer + 1, // Off by one
            correctAnswer - 1, // Off by one
            Math.floor(correctAnswer * 2), // Double
            Math.ceil(correctAnswer / 2), // Half
            Math.floor(correctAnswer), // Integer part only
            Math.ceil(correctAnswer), // Rounded up
            correctAnswer + 0.5 // Common fraction error
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateEquationDistractors(problem, correctAnswer) {
        const numbers = problem.operation.match(/\d+/g);
        const a = parseInt(numbers[0]);
        const b = parseInt(numbers[1]);
        
        return [
            a + b, // Addition instead of division
            b - a, // Subtraction
            a, // Just the coefficient
            b, // Just the constant
            correctAnswer + 1, // Off by one
            correctAnswer - 1, // Off by one
            Math.floor(correctAnswer * 2) // Double
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateExponentialDistractors(problem, correctAnswer) {
        const numbers = problem.operation.match(/\d+/g);
        const base = parseInt(numbers[0]);
        
        return [
            base + base, // Addition instead of multiplication
            base * 3, // Tripled instead of squared
            base + 2, // Added 2 instead of squaring
            correctAnswer + base, // Added base to correct answer
            correctAnswer - base, // Subtracted base from correct answer
            base, // Just the base
            correctAnswer + 1, // Off by one
            correctAnswer - 1 // Off by one
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateAdvancedDistractors(problem, correctAnswer) {
        return [
            correctAnswer + 1, // Off by one
            correctAnswer - 1, // Off by one
            correctAnswer + 2, // Off by two
            correctAnswer - 2, // Off by two
            Math.floor(correctAnswer * 1.5), // 1.5x the answer
            Math.floor(correctAnswer / 2), // Half the answer
            correctAnswer + 5, // Add 5
            correctAnswer - 5, // Subtract 5
            Math.floor(correctAnswer * 2), // Double
            Math.abs(correctAnswer - 10) // Subtract 10 (absolute value)
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateGenericDistractors(correctAnswer) {
        return [
            correctAnswer + 1,
            correctAnswer - 1,
            correctAnswer + 2,
            correctAnswer - 2,
            Math.floor(correctAnswer * 1.5),
            Math.floor(correctAnswer / 2),
            correctAnswer + 10,
            correctAnswer - 10
        ].filter(distractor => distractor !== correctAnswer && distractor > 0);
    }

    generateGenericDistractor(correctAnswer, existingDistractors) {
        const variations = [
            correctAnswer + Math.floor(Math.random() * 5) + 1,
            correctAnswer - Math.floor(Math.random() * 5) - 1,
            Math.floor(correctAnswer * (1 + Math.random() * 0.5)),
            Math.floor(correctAnswer * (0.5 + Math.random() * 0.5))
        ];
        
        for (const variation of variations) {
            if (variation > 0 && variation !== correctAnswer && !existingDistractors.includes(variation)) {
                return variation;
            }
        }
        
        return Math.max(1, correctAnswer + Math.floor(Math.random() * 10) - 5);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generateAdditionProblem() {
        let range = Math.min(10 + this.difficultyLevel * 5, 50);
        
        // Adjust range based on global difficulty
        switch (this.globalDifficulty) {
            case 'easy':
                range = Math.min(range, 20);
                break;
            case 'hard':
                range = Math.min(range + 20, 100);
                break;
        }
        
        const a = Math.floor(Math.random() * range) + 1;
        const b = Math.floor(Math.random() * range) + 1;
        const answer = a + b;
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const template = this.selectedQuestionTemplate || (questionTemplates.addition && questionTemplates.addition[0]) || 'Calculate {a} + {b}';
        const text = template.replace('{a}', a).replace('{b}', b);
        
        return {
            type: 'addition',
            title: this.translate('problem.help_bunnies'),
            text: text,
            answer: answer,
            visual: this.generateAdditionVisual(a, b),
            operation: `${a} + ${b} = ?`,
            explanation: `${a} + ${b} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateSubtractionProblem() {
        const range = Math.min(10 + this.difficultyLevel * 5, 50);
        const a = Math.floor(Math.random() * range) + 10;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        const answer = a - b;
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const template = this.selectedQuestionTemplate || (questionTemplates.subtraction && questionTemplates.subtraction[0]) || 'Calculate {a} - {b}';
        const text = template.replace('{a}', a).replace('{b}', b);
        
        return {
            type: 'subtraction',
            title: this.translate('problem.help_bunnies'),
            text: text,
            answer: answer,
            visual: this.generateSubtractionVisual(a, b),
            operation: `${a} - ${b} = ?`,
            explanation: `${a} - ${b} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateMultiplicationProblem() {
        let maxFactor = Math.min(5 + this.difficultyLevel, 12);
        
        // Adjust factor range based on global difficulty
        switch (this.globalDifficulty) {
            case 'easy':
                maxFactor = Math.min(maxFactor, 5);
                break;
            case 'hard':
                maxFactor = Math.min(maxFactor + 3, 15);
                break;
        }
        const a = Math.floor(Math.random() * maxFactor) + 1;
        const b = Math.floor(Math.random() * maxFactor) + 1;
        const answer = a * b;
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.multiplication || ['Calculate {a} × {b}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        const text = template.replace('{a}', a).replace('{b}', b);
        
        return {
            type: 'multiplication',
            title: this.translate('problem.help_penguins'),
            text: text,
            answer: answer,
            visual: this.generateMultiplicationVisual(a, b),
            operation: `${a} × ${b} = ?`,
            explanation: `${a} × ${b} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateDoublesProblem() {
        // Generate doubles from 1×2 to 12×2
        const number = Math.floor(Math.random() * 12) + 1;
        const answer = number * 2;
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const template = this.selectedQuestionTemplate || (questionTemplates.doubles && questionTemplates.doubles[0]) || 'Double {n}';
        const text = template.replace('{n}', number);
        
        return {
            type: 'doubles',
            title: this.translate('problem.penguin_pairs'),
            text: text,
            answer: answer,
            visual: this.generateDoublesVisual(number),
            operation: `${number} × 2 = ?`,
            explanation: `${number} × 2 = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel,
            baseNumber: number
        };
    }

    generateDoublesWordProblem() {
        const number = Math.floor(Math.random() * 12) + 1;
        const answer = number * 2;
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const template = this.selectedQuestionTemplate || (questionTemplates.doubles_word_problems && questionTemplates.doubles_word_problems[0]) || 'There are {n} pairs. How many total?';
        const text = template.replace('{n}', number);
        const operation = `${number} × 2 = ?`;
        
        return {
            type: 'doubles_word_problems',
            title: this.translate('problem.penguin_story'),
            text: text,
            answer: answer,
            visual: this.generateDoublesVisual(number),
            operation: operation,
            explanation: `${operation.replace('?', answer)}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel,
            baseNumber: number
        };
    }

    generateSimpleDivisionProblem() {
        const divisor = Math.floor(Math.random() * 8) + 2;
        const quotient = Math.floor(Math.random() * 10) + 1;
        const dividend = divisor * quotient;
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.simple_division || ['Divide {a} by {b}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        const text = template.replace('{a}', dividend).replace('{b}', divisor);
        
        return {
            type: 'division',
            title: this.translate('problem.help_penguins'),
            text: text,
            answer: quotient,
            visual: this.generateDivisionVisual(dividend, divisor),
            operation: `${dividend} ÷ ${divisor} = ?`,
            explanation: `${dividend} ÷ ${divisor} = ${quotient}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateDivisionProblem() {
        const divisor = Math.floor(Math.random() * 10) + 2;
        const quotient = Math.floor(Math.random() * 15) + 1;
        const dividend = divisor * quotient;
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.division || ['Divide {a} by {b}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        const text = template.replace('{a}', dividend).replace('{b}', divisor);
        
        return {
            type: 'division',
            title: this.translate('problem.help_elephants'),
            text: text,
            answer: quotient,
            visual: this.generateDivisionVisual(dividend, divisor),
            operation: `${dividend} ÷ ${divisor} = ?`,
            explanation: `${dividend} ÷ ${divisor} = ${quotient}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateFractionProblem() {
        let denominators;
        // Adjust fraction complexity based on global difficulty
        switch (this.globalDifficulty) {
            case 'easy':
                denominators = [2, 3, 4];
                break;
            case 'medium':
                denominators = [2, 3, 4, 5, 6, 8];
                break;
            case 'hard':
                denominators = [2, 3, 4, 5, 6, 8, 10, 12];
                break;
            default:
                denominators = [2, 3, 4, 5, 6, 8, 10];
        }
        const d = denominators[Math.floor(Math.random() * denominators.length)];
        const n = Math.floor(Math.random() * (d - 1)) + 1;
        
        let answer, text;
        const problemType = Math.floor(Math.random() * 3);
        
        // Get the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.fractions || ['What is {n}/{d}?'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        if (problemType === 0) {
            // Addition of fractions
            const count = Math.floor(Math.random() * 5) + 2;
            answer = Math.round((n * count / d) * 100) / 100;
            text = template.replace('{n}', n).replace('{d}', d).replace('{count}', count);
        } else if (problemType === 1) {
            // Complement fraction
            answer = d - n;
            text = template.replace('{n}', n).replace('{d}', d);
        } else {
            // Remainder fraction
            answer = d - n;
            text = template.replace('{n}', n).replace('{d}', d);
        }
        
        return {
            type: 'fractions',
            title: this.translate('problem.help_monkeys'),
            text: text,
            answer: answer,
            visual: this.generateFractionVisual(n, d),
            operation: `${n}/${d}`,
            explanation: `The answer is ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateEquationProblem() {
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 50) + 10;
        const answer = Math.floor(b / a);
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.equations || ['Solve: {a}x = {b}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        const text = template.replace('{a}', a).replace('{b}', b);
        
        return {
            type: 'equations',
            title: this.translate('problem.help_lions'),
            text: text,
            answer: answer,
            visual: this.generateEquationVisual(a, b),
            operation: `${a} × x = ${b}`,
            explanation: `x = ${b} ÷ ${a} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateExponentialProblem() {
        const base = Math.floor(Math.random() * 5) + 2;
        const exponent = 2; // Keep it simple for 8-year-olds
        const answer = Math.pow(base, exponent);
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.exponentials || ['What is {base} squared?'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        const text = template.replace(/{base}/g, base);
        
        return {
            type: 'exponentials',
            title: this.translate('problem.help_dragons'),
            text: text,
            answer: answer,
            visual: this.generateExponentialVisual(base, exponent),
            operation: `${base}² = ${base} × ${base}`,
            explanation: `${base}² = ${base} × ${base} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateMixedOperationProblem() {
        // Generate a problem that combines multiple operations
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        
        const operations = [
            { text: `(${a} + ${b}) × ${c}`, answer: (a + b) * c },
            { text: `${a} × ${b} + ${c}`, answer: a * b + c },
            { text: `${a + b} - ${c}`, answer: (a + b) - c }
        ];
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.mixed_operations || ['Calculate: {a} + {b} × {c}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        const text = template.replace('{a}', a).replace('{b}', b).replace('{c}', c) || `Calculate: ${operation.text}`;
        
        return {
            type: 'mixed_operations',
            title: this.translate('problem.challenge'),
            text: text,
            answer: operation.answer,
            visual: this.generateMixedOperationVisual(operation.text),
            operation: operation.text,
            explanation: `${operation.text} = ${operation.answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateWordProblem() {
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.word_problems || ['Solve this problem step by step.'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        // Generate numbers for the word problem
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 5) + 2;
        const answer = a - b;
        
        return {
            type: 'word_problems',
            title: this.translate('problem.story'),
            text: template,
            answer: answer,
            visual: ['📚', '🧮', '✏️'],
            operation: `${a} - ${b} = ?`,
            explanation: `${a} - ${b} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateMeasurementProblem() {
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.measurement || ['Calculate: {a} × {b}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        // Generate numbers for measurement problems
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 8) + 2;
        const answer = a * b;
        
        return {
            type: 'measurement',
            title: this.translate('problem.help_dolphins'),
            text: template.replace('{a}', a).replace('{b}', b),
            answer: answer,
            visual: ['📏', '🐬', '💧'],
            operation: `${a} × ${b} = ?`,
            explanation: `${a} × ${b} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateGeometryProblem() {
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.geometry || ['Calculate: {a} + {b}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        // Generate numbers for geometry problems
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * 6) + 2;
        const answer = (a + b) * 2; // Simple perimeter calculation
        
        return {
            type: 'geometry',
            title: this.translate('problem.help_giraffes'),
            text: template.replace('{a}', a).replace('{b}', b),
            answer: answer,
            visual: ['📐', '🦒', '🔺'],
            operation: `2 × (${a} + ${b}) = ?`,
            explanation: `2 × (${a} + ${b}) = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateAdvancedMultiplicationProblem() {
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.advanced_multiplication || ['Calculate: {a} × {b}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        // Generate larger numbers for advanced multiplication
        const a = Math.floor(Math.random() * 12) + 8;
        const b = Math.floor(Math.random() * 8) + 3;
        const answer = a * b;
        
        return {
            type: 'advanced_multiplication',
            title: this.translate('problem.help_owls'),
            text: template.replace('{a}', a).replace('{b}', b),
            answer: answer,
            visual: ['🦉', '🌙', '🔢'],
            operation: `${a} × ${b} = ?`,
            explanation: `${a} × ${b} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generatePatternProblem() {
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.patterns || ['What comes next: {a}, {b}, {c}?'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        // Generate simple arithmetic pattern
        const a = Math.floor(Math.random() * 5) + 2;
        const b = a + 2;
        const c = b + 2;
        const answer = c + 2;
        
        return {
            type: 'patterns',
            title: this.translate('problem.help_owls'),
            text: template.replace('{a}', a).replace('{b}', b).replace('{c}', c),
            answer: answer,
            visual: ['🔢', '🦉', '📊'],
            operation: `${a}, ${b}, ${c}, ?`,
            explanation: `Pattern: +2 each time, so ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateAdvancedEquationProblem() {
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.advanced_equations || ['Solve: {a}x + {b} = {c}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        // Generate equation ax + b = c
        const a = Math.floor(Math.random() * 5) + 2;
        const x = Math.floor(Math.random() * 8) + 1;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = a * x + b;
        
        return {
            type: 'advanced_equations',
            title: this.translate('problem.help_dragons'),
            text: template.replace('{a}', a).replace('{b}', b).replace('{c}', c),
            answer: x,
            visual: ['🐉', '🔥', '⚡'],
            operation: `${a}x + ${b} = ${c}`,
            explanation: `x = (${c} - ${b}) ÷ ${a} = ${x}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateAllConceptsProblem() {
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.all_concepts || ['Calculate: {a}² + {b} × {c}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        // Generate mixed operations problem
        const a = Math.floor(Math.random() * 4) + 2;
        const b = Math.floor(Math.random() * 6) + 3;
        const c = Math.floor(Math.random() * 5) + 2;
        const answer = (a * a) + (b * c);
        
        return {
            type: 'all_concepts',
            title: this.translate('problem.challenge'),
            text: template.replace('{a}', a).replace('{b}', b).replace('{c}', c),
            answer: answer,
            visual: ['🌈', '⭐', '🎯'],
            operation: `${a}² + ${b} × ${c}`,
            explanation: `${a}² + ${b} × ${c} = ${a*a} + ${b*c} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateChallengeProblem() {
        // Use the selected template for the level
        const questionTemplates = this.getQuestionTemplates();
        const templates = questionTemplates.challenge_problems || ['Ultimate challenge: ({a} + {b}) × {c} - {d}'];
        const template = this.selectedQuestionTemplate || templates[Math.floor(Math.random() * templates.length)];
        
        // Generate complex operation
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 6) + 1;
        const c = Math.floor(Math.random() * 4) + 2;
        const d = Math.floor(Math.random() * 10) + 5;
        const answer = (a + b) * c - d;
        
        return {
            type: 'challenge_problems',
            title: this.translate('problem.challenge'),
            text: template.replace('{a}', a).replace('{b}', b).replace('{c}', c).replace('{d}', d),
            answer: answer,
            visual: ['🏆', '🌈', '💫'],
            operation: `(${a} + ${b}) × ${c} - ${d}`,
            explanation: `(${a} + ${b}) × ${c} - ${d} = ${a+b} × ${c} - ${d} = ${(a+b)*c} - ${d} = ${answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    // Visual generation methods
    generateAdditionVisual(a, b) {
        const visual = [];
        for (let i = 0; i < a; i++) {
            visual.push('🥕');
        }
        visual.push('+');
        for (let i = 0; i < b; i++) {
            visual.push('🥕');
        }
        return visual;
    }

    generateSubtractionVisual(a, b) {
        const visual = [];
        for (let i = 0; i < a; i++) {
            visual.push(i < b ? '🥕' : '🥕');
        }
        return visual;
    }

    generateMultiplicationVisual(a, b) {
        const visual = [];
        for (let i = 0; i < a; i++) {
            const row = [];
            for (let j = 0; j < b; j++) {
                row.push('🐧');
            }
            visual.push(row.join(' '));
        }
        return visual;
    }

    generateDivisionVisual(dividend, divisor) {
        const visual = [];
        for (let i = 0; i < dividend; i++) {
            visual.push('🐘');
        }
        visual.push('÷');
        for (let i = 0; i < divisor; i++) {
            visual.push('👥');
        }
        return visual;
    }

    generateFractionVisual(numerator, denominator) {
        const visual = [];
        for (let i = 0; i < denominator; i++) {
            visual.push(i < numerator ? '🍌' : '⚪');
        }
        return visual;
    }

    generateEquationVisual(a, b) {
        return [`${a} × ? = ${b}`, '🦁', '🥩'];
    }

    generateExponentialVisual(base, exponent) {
        const visual = [];
        for (let i = 0; i < base; i++) {
            const row = [];
            for (let j = 0; j < base; j++) {
                row.push('💎');
            }
            visual.push(row.join(' '));
        }
        return visual;
    }

    generateMixedOperationVisual(operation) {
        return ['🧮', operation, '✏️'];
    }

    generateDoublesVisual(number) {
        const visual = [];
        for (let i = 0; i < number; i++) {
            // Create pairs of penguins
            visual.push('🐧🐧');
        }
        return visual;
    }

    checkAnswer(userAnswer) {
        if (!this.currentProblem) {
            return false;
        }
        
        const correct = Math.abs(userAnswer - this.currentProblem.answer) < 0.01;
        
        if (correct) {
            this.currentProblem.userAnswer = userAnswer;
            this.currentProblem.correct = true;
            this.currentProblem.timestamp = Date.now();
        }
        
        return correct;
    }

    getCurrentProblem() {
        return this.currentProblem;
    }

    getHint() {
        if (!this.currentProblem) {
            return "No problem to give a hint for!";
        }
        
        const hints = {
            addition: "Try counting all the items together!",
            subtraction: "Count how many are left after taking some away!",
            doubles: "Think about pairs! Count by twos or double the number!",
            doubles_word_problems: "Look for the word 'pairs' or 'each has 2'. Double the number!",
            multiplication: "Count the groups and multiply!",
            division: "Try sharing equally among the groups!",
            fractions: "Think about parts of a whole!",
            equations: "What number makes this equation true?",
            exponentials: "Multiply the number by itself!",
            mixed_operations: "Follow the order of operations!",
            word_problems: "Break down the problem step by step!"
        };
        
        return hints[this.currentProblem.type] || "Think carefully about the problem!";
    }

    getProgressStats() {
        const correct = this.problemHistory.filter(p => p.correct).length;
        const total = this.problemHistory.length;
        const accuracy = total > 0 ? (correct / total) * 100 : 0;
        
        return {
            correct,
            total,
            accuracy: Math.round(accuracy),
            currentStreak: this.getCurrentStreak()
        };
    }

    getCurrentStreak() {
        let streak = 0;
        for (let i = this.problemHistory.length - 1; i >= 0; i--) {
            if (this.problemHistory[i].correct) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    reset() {
        this.currentProblem = null;
        this.problemHistory = [];
        this.difficultyLevel = 1;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathEngine;
}