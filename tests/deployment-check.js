// Deployment Check for Times Table Animals
// Verifies game is ready for production deployment

const fs = require('fs');
const path = require('path');

function checkDeploymentReadiness() {
    console.log('🚀 Checking deployment readiness for Times Table Animals\n');
    
    const checks = [
        checkRequiredFiles,
        checkGameStructure,
        checkHabitatFiles,
        checkAssets,
        checkConfiguration
    ];
    
    let allChecksPassed = true;
    
    for (const check of checks) {
        const result = check();
        if (!result) allChecksPassed = false;
    }
    
    console.log('\n' + '='.repeat(50));
    
    if (allChecksPassed) {
        console.log('✅ DEPLOYMENT READY - All checks passed!');
        console.log('📋 Recommended pre-deployment steps:');
        console.log('   1. Run: npm run test');
        console.log('   2. Test manually in different browsers');
        console.log('   3. Verify mobile responsiveness');
        console.log('   4. Check audio functionality');
        return true;
    } else {
        console.log('❌ DEPLOYMENT BLOCKED - Fix issues above first');
        return false;
    }
}

function checkRequiredFiles() {
    console.log('📁 Checking required files...');
    
    const requiredFiles = [
        'index.html',
        'js/main.js',
        'js/gameEngine.js',
        'js/mathEngine.js',
        'css/styles.css'
    ];
    
    let allFilesExist = true;
    
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            console.log(`   ✅ ${file}`);
        } else {
            console.log(`   ❌ ${file} - MISSING`);
            allFilesExist = false;
        }
    }
    
    return allFilesExist;
}

function checkGameStructure() {
    console.log('\n🏗️  Checking game structure...');
    
    const requiredDirs = ['js', 'css', 'js/habitats', 'tests'];
    let allDirsExist = true;
    
    for (const dir of requiredDirs) {
        if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
            console.log(`   ✅ ${dir}/`);
        } else {
            console.log(`   ❌ ${dir}/ - MISSING`);
            allDirsExist = false;
        }
    }
    
    return allDirsExist;
}

function checkHabitatFiles() {
    console.log('\n🏞️  Checking habitat files...');
    
    const habitatFiles = [
        'js/habitats/bunnyMeadow.js',
        'js/habitats/penguinPairsArctic.js',
        'js/habitats/penguinArctic.js',
        'js/habitats/elephantSavanna.js',
        'js/habitats/monkeyJungle.js',
        'js/habitats/lionPride.js',
        'js/habitats/dolphinCove.js',
        'js/habitats/bearForest.js',
        'js/habitats/giraffePlains.js',
        'js/habitats/owlObservatory.js',
        'js/habitats/dragonSanctuary.js',
        'js/habitats/rainbowReserve.js'
    ];
    
    let allHabitatsExist = true;
    
    for (const habitat of habitatFiles) {
        if (fs.existsSync(habitat)) {
            // Check if file contains progression fix
            const content = fs.readFileSync(habitat, 'utf8');
            if (content.includes('gameController.updateProgress()')) {
                console.log(`   ✅ ${path.basename(habitat)} (progression fix applied)`);
            } else {
                console.log(`   ⚠️  ${path.basename(habitat)} (missing progression fix)`);
                allHabitatsExist = false;
            }
        } else {
            console.log(`   ❌ ${path.basename(habitat)} - MISSING`);
            allHabitatsExist = false;
        }
    }
    
    return allHabitatsExist;
}

function checkAssets() {
    console.log('\n🎨 Checking assets...');
    
    const assetDirs = ['assets'];
    let assetsOk = true;
    
    for (const dir of assetDirs) {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            console.log(`   ✅ ${dir}/ (${files.length} files)`);
        } else {
            console.log(`   ⚠️  ${dir}/ - Optional, but recommended for better experience`);
        }
    }
    
    return assetsOk;
}

function checkConfiguration() {
    console.log('\n⚙️  Checking configuration...');
    
    let configOk = true;
    
    // Check if package.json exists for testing
    if (fs.existsSync('package.json')) {
        console.log('   ✅ package.json (testing setup available)');
    } else {
        console.log('   ⚠️  package.json - Missing, automated testing unavailable');
    }
    
    // Check if tests exist
    if (fs.existsSync('tests/automated-game-tests.js')) {
        console.log('   ✅ Automated tests available');
    } else {
        console.log('   ⚠️  Automated tests - Not found');
    }
    
    return configOk;
}

// Run check if called directly
if (require.main === module) {
    const ready = checkDeploymentReadiness();
    process.exit(ready ? 0 : 1);
}

module.exports = { checkDeploymentReadiness };