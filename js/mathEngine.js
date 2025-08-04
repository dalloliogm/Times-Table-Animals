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
        
        // Question template pools for consistent questioning within levels
        this.questionTemplates = {
            addition: [
                'There are {a} carrots in one basket and {b} carrots in another. How many carrots total?',
                'If {a} bunnies hop into the meadow and {b} more join them, how many bunnies are there?',
                'The caretaker gives {a} lettuce leaves to one group and {b} to another. How many leaves total?',
                'The sanctuary has {a} baby bunnies and {b} adult bunnies. How many bunnies in total?',
                'In the morning there were {a} carrots, and the caretaker brought {b} more. How many carrots now?',
                'Albert saw {a} bunnies playing and {b} bunnies sleeping. How many bunnies did he see?'
            ],
            subtraction: [
                'There were {a} carrots, but the bunnies ate {b} of them. How many carrots are left?',
                'If {a} bunnies were in the meadow and {b} hopped away, how many bunnies remain?',
                'The caretaker had {a} lettuce leaves and gave away {b}. How many are left?',
                'From {a} bunny treats, {b} were eaten. How many treats remain?',
                'Albert counted {a} flowers, but {b} wilted overnight. How many flowers are still blooming?',
                'There were {a} bunnies in the burrow, then {b} went out to play. How many stayed inside?'
            ],
            doubles: [
                'Each penguin needs a partner for the ice parade. If there are {n} penguins, how many penguins total?',
                'The penguins slide down the ice slide in pairs. How many penguins in {n} pairs?',
                'Each penguin catches {n} fish. How many fish do 2 penguins catch?',
                'There are {n} penguin pairs playing together. How many penguins are playing?',
                'Each ice block can hold 2 penguins. How many penguins can {n} blocks hold?',
                'In the penguin parade, they march 2 by 2. How many penguins are in {n} rows?'
            ],
            doubles_word_problems: [
                'At the penguin nursery, there are {n} baby penguins. Each baby penguin has exactly 2 flippers. How many flippers are there in total?',
                'The penguin chef is making fish soup. Each bowl needs 2 fish. How many fish are needed for {n} bowls?',
                'For the ice skating show, penguins perform in pairs. If there are {n} pairs, how many penguins are performing?',
                'Each penguin family has 2 parents. How many parent penguins are there in {n} families?',
                'The penguins collect ice cubes for their igloo. Each trip, they bring back 2 ice cubes. How many ice cubes after {n} trips?',
                'Each sled needs 2 penguin pullers. How many penguins are needed to pull {n} sleds?'
            ]
        };
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
        
        // Get available templates for the selected problem type
        const availableTemplates = this.questionTemplates[this.selectedQuestionType];
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
        const template = this.selectedQuestionTemplate || this.questionTemplates.addition[0];
        const text = template.replace('{a}', a).replace('{b}', b);
        
        return {
            type: 'addition',
            title: 'Help the Bunnies!',
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
        const template = this.selectedQuestionTemplate || this.questionTemplates.subtraction[0];
        const text = template.replace('{a}', a).replace('{b}', b);
        
        return {
            type: 'subtraction',
            title: 'Help the Bunnies!',
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
        const contexts = [
            'Each penguin family needs {a} fish. How many fish do {b} families need?',
            'There are {a} fish in each ice hole. How many fish in {b} holes?',
            'If {a} penguins each catch {b} fish, how many fish total?',
            'The caretaker gives {a} groups of penguins {b} fish each. How many fish total?'
        ];
        
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
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        const text = context.replace('{a}', a).replace('{b}', b);
        
        return {
            type: 'multiplication',
            title: 'Help the Penguins!',
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
        const template = this.selectedQuestionTemplate || this.questionTemplates.doubles[0];
        const text = template.replace('{n}', number);
        
        return {
            type: 'doubles',
            title: 'Penguin Pairs!',
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
        const template = this.selectedQuestionTemplate || this.questionTemplates.doubles_word_problems[0];
        const text = template.replace('{n}', number);
        const operation = `${number} × 2 = ?`;
        
        return {
            type: 'doubles_word_problems',
            title: 'Penguin Story Problem!',
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
        const contexts = [
            '{a} fish need to be shared equally among {b} penguins. How many fish per penguin?',
            'If {a} ice cubes are divided into {b} equal groups, how many in each group?',
            'The caretaker has {a} fish to give to {b} penguin families equally. How many per family?'
        ];
        
        const divisor = Math.floor(Math.random() * 8) + 2;
        const quotient = Math.floor(Math.random() * 10) + 1;
        const dividend = divisor * quotient;
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        const text = context.replace('{a}', dividend).replace('{b}', divisor);
        
        return {
            type: 'division',
            title: 'Help the Penguins!',
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
        const contexts = [
            '{a} water buckets need to be shared equally among {b} elephants. How many buckets per elephant?',
            'If {a} peanuts are divided equally among {b} elephants, how many peanuts each?',
            'The caretaker has {a} hay bales for {b} elephants. How many bales per elephant?'
        ];
        
        const divisor = Math.floor(Math.random() * 10) + 2;
        const quotient = Math.floor(Math.random() * 15) + 1;
        const dividend = divisor * quotient;
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        const text = context.replace('{a}', dividend).replace('{b}', divisor);
        
        return {
            type: 'division',
            title: 'Help the Elephants!',
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
        const contexts = [
            'Each monkey gets {n}/{d} of a banana bunch. How many banana bunches for {count} monkeys?',
            'If {n}/{d} of the jungle is for sleeping, what fraction is for playing?',
            'The caretaker gives {n}/{d} of the fruit to the monkeys. What fraction is left?'
        ];
        
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
        
        if (problemType === 0) {
            // Addition of fractions
            const count = Math.floor(Math.random() * 5) + 2;
            answer = Math.round((n * count / d) * 100) / 100;
            text = contexts[0].replace('{n}', n).replace('{d}', d).replace('{count}', count);
        } else if (problemType === 1) {
            // Complement fraction
            answer = d - n;
            text = contexts[1].replace('{n}', n).replace('{d}', d);
        } else {
            // Remainder fraction
            answer = d - n;
            text = contexts[2].replace('{n}', n).replace('{d}', d);
        }
        
        return {
            type: 'fractions',
            title: 'Help the Monkeys!',
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
        const contexts = [
            'If x lions each need {a} pounds of meat, and we have {b} pounds total, how many lions can we feed?',
            'The pride has {a} lions. If we need {b} pounds of meat per lion, how much meat total?',
            'We have {a} lions and need {b} pounds of meat. How much meat per lion?'
        ];
        
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 50) + 10;
        const answer = Math.floor(b / a);
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        const text = context.replace('{a}', a).replace('{b}', b);
        
        return {
            type: 'equations',
            title: 'Help the Lions!',
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
        const contexts = [
            'The dragon has {base} treasure chests. Each chest has {base} compartments. How many compartments total?',
            'If {base} dragons each guard {base} treasures, how many treasures total?',
            'The magic crystal grows by {base} times each day. After 2 days, how many times bigger?'
        ];
        
        const base = Math.floor(Math.random() * 5) + 2;
        const exponent = 2; // Keep it simple for 8-year-olds
        const answer = Math.pow(base, exponent);
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        const text = context.replace(/{base}/g, base);
        
        return {
            type: 'exponentials',
            title: 'Help the Dragons!',
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
        
        return {
            type: 'mixed_operations',
            title: 'Challenge Problem!',
            text: `Calculate: ${operation.text}`,
            answer: operation.answer,
            visual: this.generateMixedOperationVisual(operation.text),
            operation: operation.text,
            explanation: `${operation.text} = ${operation.answer}`,
            habitat: this.currentHabitat,
            difficulty: this.difficultyLevel
        };
    }

    generateWordProblem() {
        const problems = [
            {
                text: 'The animal sanctuary has 15 animals. If 8 are mammals and the rest are birds, how many birds are there?',
                answer: 7,
                operation: '15 - 8 = ?'
            },
            {
                text: 'Each animal needs 3 meals per day. How many meals do 6 animals need per day?',
                answer: 18,
                operation: '6 × 3 = ?'
            },
            {
                text: 'The caretaker works 8 hours a day for 5 days. How many hours total?',
                answer: 40,
                operation: '8 × 5 = ?'
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        
        return {
            type: 'word_problems',
            title: 'Story Problem!',
            text: problem.text,
            answer: problem.answer,
            visual: ['📚', '🧮', '✏️'],
            operation: problem.operation,
            explanation: `${problem.operation.replace('?', problem.answer)}`,
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