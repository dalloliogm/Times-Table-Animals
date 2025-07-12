// Math Engine for Times Table Animals
// Generates math problems and validates answers

class MathEngine {
    constructor() {
        this.currentProblem = null;
        this.problemHistory = [];
        this.difficultyLevel = 1;
        this.currentHabitat = 'bunnyMeadow';
        this.problemTypes = {
            bunnyMeadow: ['addition', 'subtraction'],
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
    }

    setHabitat(habitat) {
        this.currentHabitat = habitat;
        this.difficultyLevel = this.getHabitatDifficulty(habitat);
    }

    getHabitatDifficulty(habitat) {
        const difficultyMap = {
            bunnyMeadow: 1,
            penguinArctic: 2,
            elephantSavanna: 3,
            monkeyJungle: 4,
            lionPride: 5,
            dolphinCove: 6,
            bearForest: 7,
            giraffePlains: 8,
            owlObservatory: 9,
            dragonSanctuary: 10,
            rainbowReserve: 11
        };
        return difficultyMap[habitat] || 1;
    }

    generateProblem() {
        const problemTypes = this.problemTypes[this.currentHabitat];
        const problemType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        
        let problem;
        switch (problemType) {
            case 'addition':
                problem = this.generateAdditionProblem();
                break;
            case 'subtraction':
                problem = this.generateSubtractionProblem();
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

        this.currentProblem = problem;
        this.problemHistory.push(problem);
        return problem;
    }

    generateAdditionProblem() {
        const contexts = [
            'There are {a} carrots in one basket and {b} carrots in another. How many carrots total?',
            'If {a} bunnies hop into the meadow and {b} more join them, how many bunnies are there?',
            'The caretaker gives {a} lettuce leaves to one group and {b} to another. How many leaves total?',
            'The sanctuary has {a} baby bunnies and {b} adult bunnies. How many bunnies in total?'
        ];
        
        const range = Math.min(10 + this.difficultyLevel * 5, 50);
        const a = Math.floor(Math.random() * range) + 1;
        const b = Math.floor(Math.random() * range) + 1;
        const answer = a + b;
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        const text = context.replace('{a}', a).replace('{b}', b);
        
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
        const contexts = [
            'There were {a} carrots, but the bunnies ate {b} of them. How many carrots are left?',
            'If {a} bunnies were in the meadow and {b} hopped away, how many bunnies remain?',
            'The caretaker had {a} lettuce leaves and gave away {b}. How many are left?',
            'From {a} bunny treats, {b} were eaten. How many treats remain?'
        ];
        
        const range = Math.min(10 + this.difficultyLevel * 5, 50);
        const a = Math.floor(Math.random() * range) + 10;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        const answer = a - b;
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        const text = context.replace('{a}', a).replace('{b}', b);
        
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
        
        const maxFactor = Math.min(5 + this.difficultyLevel, 12);
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
        
        const denominators = [2, 3, 4, 5, 6, 8, 10];
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