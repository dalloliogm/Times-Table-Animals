// Quick Test for Times Table Animals - Basic functionality check
// Run with: node tests/quick-test.js

const puppeteer = require('puppeteer');
const path = require('path');

async function quickTest() {
    console.log('🔧 Running Quick Game Test...\n');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Load game
        const gamePath = path.join(__dirname, '../index.html');
        await page.goto(`file://${gamePath}`, { waitUntil: 'networkidle0' });
        
        console.log('✅ Game loads successfully');
        
        // Test main menu
        await page.waitForSelector('#startGameBtn', { timeout: 3000 });
        await page.click('#startGameBtn');
        
        console.log('✅ Main menu works');
        
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