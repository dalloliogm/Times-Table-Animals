// Automated Game Tests for Times Table Animals
// Run with: node tests/automated-game-tests.js

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class GameTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = [];
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: true, // Set to false for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        
        // Set viewport
        await this.page.setViewport({ width: 1200, height: 800 });
        
        // Enable console logging
        this.page.on('console', msg => {
            console.log(`[BROWSER] ${msg.text()}`);
        });
    }

    async loadGame() {
        const gamePath = path.join(__dirname, '../index.html');
        const gameUrl = `file://${gamePath}`;
        
        console.log(`Loading game from: ${gameUrl}`);
        await this.page.goto(gameUrl, { waitUntil: 'networkidle0' });
        
        // Wait for game to initialize
        await this.page.waitForSelector('#startGameBtn', { timeout: 5000 });
        
        this.logTest('Game Loading', 'PASS', 'Game loaded successfully');
    }

    async testMainMenu() {
        console.log('\n--- Testing Main Menu ---');
        
        // Check if main menu elements exist
        const startBtn = await this.page.$('#startGameBtn');
        const settingsBtn = await this.page.$('#settingsBtn');
        const achievementsBtn = await this.page.$('#achievementsBtn');
        const creditsBtn = await this.page.$('#creditsBtn');
        
        if (startBtn && settingsBtn && achievementsBtn && creditsBtn) {
            this.logTest('Main Menu Elements', 'PASS', 'All main menu buttons found');
        } else {
            this.logTest('Main Menu Elements', 'FAIL', 'Missing main menu buttons');
            return false;
        }
        
        // Test Start Adventure button
        await startBtn.click();
        await this.page.waitForSelector('.habitat-card', { timeout: 3000 });
        
        this.logTest('Start Adventure Button', 'PASS', 'Successfully navigated to habitat selection');
        return true;
    }

    async testHabitatSelection() {
        console.log('\n--- Testing Habitat Selection ---');
        
        // Check if habitat cards exist
        const habitatCards = await this.page.$$('.habitat-card');
        
        if (habitatCards.length >= 2) {
            this.logTest('Habitat Cards', 'PASS', `Found ${habitatCards.length} habitat cards`);
        } else {
            this.logTest('Habitat Cards', 'FAIL', `Only found ${habitatCards.length} habitat cards`);
            return false;
        }
        
        // Check if Bunny Meadow is unlocked
        const bunnyMeadow = await this.page.$('[data-habitat="bunnyMeadow"]');
        const isUnlocked = await bunnyMeadow.evaluate(el => el.classList.contains('unlocked'));
        
        if (isUnlocked) {
            this.logTest('Bunny Meadow Unlock', 'PASS', 'Bunny Meadow is unlocked');
        } else {
            this.logTest('Bunny Meadow Unlock', 'FAIL', 'Bunny Meadow should be unlocked');
            return false;
        }
        
        // Enter Bunny Meadow
        await bunnyMeadow.click();
        await this.page.waitForSelector('#mathProblem', { timeout: 3000 });
        
        this.logTest('Enter Habitat', 'PASS', 'Successfully entered Bunny Meadow');
        return true;
    }

    async testMathProblem() {
        console.log('\n--- Testing Math Problem Functionality ---');
        
        // Wait for problem to load
        await this.page.waitForSelector('.answer-option', { timeout: 3000 });
        
        // Check if problem elements exist
        const problemTitle = await this.page.$('#problemTitle');
        const problemText = await this.page.$('#problemText');
        const answerOptions = await this.page.$$('.answer-option');
        
        if (problemTitle && problemText && answerOptions.length === 4) {
            this.logTest('Problem Elements', 'PASS', 'All problem elements found');
        } else {
            this.logTest('Problem Elements', 'FAIL', 'Missing problem elements');
            return false;
        }
        
        // Get the problem text and answer options
        const problemTextContent = await problemText.evaluate(el => el.textContent);
        console.log(`Problem: ${problemTextContent}`);
        
        // Test clicking an answer
        const firstOption = answerOptions[0];
        await firstOption.click();
        
        // Wait for feedback
        await this.page.waitForTimeout(1000);
        
        // Check if answer was processed (should show feedback or celebration)
        const feedback = await this.page.$('#feedback');
        const feedbackVisible = await feedback.evaluate(el => !el.classList.contains('hidden'));
        
        if (feedbackVisible) {
            this.logTest('Answer Processing', 'PASS', 'Answer click was processed with feedback');
        } else {
            this.logTest('Answer Processing', 'FAIL', 'Answer click did not show feedback');
            return false;
        }
        
        return true;
    }

    async testProgressionSystem() {
        console.log('\n--- Testing Progression System ---');
        
        let problemsSolved = 0;
        const maxProblems = 3; // Test first 3 problems
        
        for (let i = 0; i < maxProblems; i++) {
            console.log(`Testing problem ${i + 1}/${maxProblems}`);
            
            // Wait for problem to load
            await this.page.waitForSelector('.answer-option', { timeout: 5000 });
            
            // Get progress text before answering
            const progressBefore = await this.page.$eval('#progressText', el => el.textContent);
            console.log(`Progress before: ${progressBefore}`);
            
            // Find and click the first option (we'll assume it's correct for testing)
            const answerOptions = await this.page.$$('.answer-option');
            if (answerOptions.length > 0) {
                await answerOptions[0].click();
                
                // Wait for processing
                await this.page.waitForTimeout(2000);
                
                // Check if progress updated
                try {
                    const progressAfter = await this.page.$eval('#progressText', el => el.textContent);
                    console.log(`Progress after: ${progressAfter}`);
                    
                    if (progressAfter !== progressBefore) {
                        problemsSolved++;
                        this.logTest(`Problem ${i + 1} Progress`, 'PASS', 'Progress updated correctly');
                    } else {
                        this.logTest(`Problem ${i + 1} Progress`, 'FAIL', 'Progress did not update');
                    }
                } catch (error) {
                    this.logTest(`Problem ${i + 1} Progress`, 'FAIL', `Error checking progress: ${error.message}`);
                }
                
                // Wait for next problem or celebration
                await this.page.waitForTimeout(3000);
            }
        }
        
        if (problemsSolved > 0) {
            this.logTest('Overall Progression', 'PASS', `Successfully solved ${problemsSolved}/${maxProblems} problems`);
            return true;
        } else {
            this.logTest('Overall Progression', 'FAIL', 'No problems were solved successfully');
            return false;
        }
    }

    async testKeyboardInput() {
        console.log('\n--- Testing Keyboard Input ---');
        
        // Wait for problem to load
        await this.page.waitForSelector('.answer-option', { timeout: 3000 });
        
        // Test keyboard input (q key should select first option)
        await this.page.keyboard.press('q');
        
        // Wait for processing
        await this.page.waitForTimeout(1000);
        
        // Check if option was selected
        const selectedOption = await this.page.$('.answer-option.selected');
        
        if (selectedOption) {
            this.logTest('Keyboard Input', 'PASS', 'Keyboard input (q key) works correctly');
            return true;
        } else {
            this.logTest('Keyboard Input', 'FAIL', 'Keyboard input did not select option');
            return false;
        }
    }

    logTest(testName, status, message) {
        const result = { testName, status, message, timestamp: new Date().toISOString() };
        this.testResults.push(result);
        
        const statusColor = status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
        const resetColor = '\x1b[0m';
        console.log(`${statusColor}[${status}]${resetColor} ${testName}: ${message}`);
    }

    async generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
        const failedTests = totalTests - passedTests;
        
        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                passRate: `${((passedTests / totalTests) * 100).toFixed(1)}%`
            },
            timestamp: new Date().toISOString(),
            results: this.testResults
        };
        
        // Save report to file
        const reportPath = path.join(__dirname, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('\n' + '='.repeat(50));
        console.log('TEST REPORT SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: \x1b[32m${passedTests}\x1b[0m`);
        console.log(`Failed: \x1b[31m${failedTests}\x1b[0m`);
        console.log(`Pass Rate: ${report.summary.passRate}`);
        console.log(`Report saved to: ${reportPath}`);
        console.log('='.repeat(50));
        
        return report.summary.passRate === '100.0%';
    }

    async runAllTests() {
        try {
            console.log('🚀 Starting Times Table Animals Automated Tests\n');
            
            await this.init();
            await this.loadGame();
            
            const tests = [
                () => this.testMainMenu(),
                () => this.testHabitatSelection(),
                () => this.testMathProblem(),
                () => this.testProgressionSystem(),
                () => this.testKeyboardInput()
            ];
            
            let allTestsPassed = true;
            
            for (const test of tests) {
                try {
                    const result = await test();
                    if (!result) allTestsPassed = false;
                } catch (error) {
                    console.error(`Test failed with error: ${error.message}`);
                    this.logTest('Test Execution', 'FAIL', error.message);
                    allTestsPassed = false;
                }
            }
            
            const reportPassed = await this.generateTestReport();
            
            await this.browser.close();
            
            if (allTestsPassed && reportPassed) {
                console.log('\n✅ All tests passed! Game is ready for deployment.');
                process.exit(0);
            } else {
                console.log('\n❌ Some tests failed. Please review the issues above.');
                process.exit(1);
            }
            
        } catch (error) {
            console.error('Fatal test error:', error);
            if (this.browser) await this.browser.close();
            process.exit(1);
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new GameTester();
    tester.runAllTests();
}

module.exports = GameTester;