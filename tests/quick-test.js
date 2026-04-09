// Quick Test for Times Table Animals - Basic functionality check
// Run with: node tests/quick-test.js

const puppeteer = require('puppeteer');
const path = require('path');

async function quickTest() {
    console.log('🔧 Running Quick Game Test...\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`[BROWSER] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
        console.log(`[PAGEERROR] ${error.message}`);
    });
    
    try {
        // Load game
        const gamePath = path.join(__dirname, '../index.html');
        await page.goto(`file://${gamePath}`, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.gameController, { timeout: 5000 });
        
        console.log('✅ Game loads successfully');

        const ensureScreen = async (buttonSelector, expectedScreen, label) => {
            await page.click(buttonSelector);
            await page.waitForFunction(
                (screenId) => {
                    const target = document.getElementById(screenId);
                    return target && target.classList.contains('active');
                },
                { timeout: 3000 },
                expectedScreen
            );
            console.log(`✅ ${label} works`);
        };
        
        await page.evaluate(() => {
            if (window.gameController) {
                window.gameController.forceOpenMainMenu();
            }
        });
        await page.waitForFunction(() => document.getElementById('mainMenu')?.classList.contains('active'));

        await ensureScreen('#settingsBtn', 'settingsMenu', 'Settings');
        await ensureScreen('#backToMenuBtn', 'mainMenu', 'Back to Menu from Settings');
        await ensureScreen('#achievementsBtn', 'achievementsScreen', 'Achievements');
        await ensureScreen('#backToMenuFromAchievements', 'mainMenu', 'Back to Menu from Achievements');
        await ensureScreen('#creditsBtn', 'creditsScreen', 'Credits');
        await ensureScreen('#backToMenuFromCredits', 'mainMenu', 'Back to Menu from Credits');
        await ensureScreen('#startGameBtn', 'habitatSelect', 'Start Adventure');
        
        // Test habitat selection
        await page.waitForSelector('.habitat-card', { timeout: 3000 });
        const bunnyMeadow = await page.$('[data-habitat="bunnyMeadow"]');
        await bunnyMeadow.click();
        
        console.log('✅ Habitat selection works');
        
        // Test math problem
        await page.waitForSelector('.answer-option', { timeout: 3000 });
        const firstOption = await page.$('.answer-option');
        await firstOption.click();
        
        console.log('✅ Answer clicking works');
        
        // Wait for feedback
        await page.waitForTimeout(1000);
        
        console.log('\n🎉 Quick test PASSED! Basic functionality is working.');
        
    } catch (error) {
        console.error('❌ Quick test FAILED:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

// Check if puppeteer is installed
try {
    require('puppeteer');
    quickTest();
} catch (error) {
    console.log('❌ Puppeteer not found. Run: npm run test:install');
    process.exit(1);
}
