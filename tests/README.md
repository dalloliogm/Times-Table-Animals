# Times Table Animals - Automated Testing System

This directory contains automated tests to verify game functionality before deployment.

## Overview

The testing system ensures that:
- ✅ Game loads correctly
- ✅ Answer clicking works
- ✅ Level progression system functions properly
- ✅ Keyboard input responds
- ✅ All habitats are accessible
- ✅ Math problems generate correctly

## Setup

1. **Install test dependencies:**
   ```bash
   npm run test:install
   ```
   This installs Puppeteer for browser automation.

2. **Verify installation:**
   ```bash
   npm run test:quick
   ```

## Available Tests

### 🚀 Full Test Suite
```bash
npm test
```
- Comprehensive testing of all game features
- Takes 2-3 minutes to complete
- Generates detailed JSON report
- **Use this before major releases**

### ⚡ Quick Test
```bash
npm run test:quick
```
- Basic functionality check
- Takes 30 seconds
- **Use this during development**

### 📋 Deployment Check
```bash
npm run deploy:check
```
- Verifies all required files exist
- Checks if progression fixes are applied
- **Use this before deployment**

### 🎯 Complete Deployment Verification
```bash
npm run deploy:test
```
- Runs full test suite + deployment check
- **Use this for final release verification**

## Test Results

### Success Output
```
✅ All tests passed! Game is ready for deployment.
```

### Failure Output
```
❌ Some tests failed. Please review the issues above.
```

### Test Report
After running `npm test`, check `tests/test-report.json` for detailed results:

```json
{
  "summary": {
    "total": 8,
    "passed": 8,
    "failed": 0,
    "passRate": "100.0%"
  },
  "timestamp": "2025-01-06T18:30:00.000Z",
  "results": [...]
}
```

## What Gets Tested

### 1. Game Loading
- ✅ index.html loads without errors
- ✅ All JavaScript files load correctly
- ✅ Game initializes properly

### 2. Navigation
- ✅ Main menu buttons work
- ✅ Habitat selection works
- ✅ Entering habitats works

### 3. Math Functionality
- ✅ Problems generate correctly
- ✅ Answer options display
- ✅ Clicking answers works
- ✅ Feedback shows correctly

### 4. Progression System
- ✅ Progress counters update
- ✅ Habitats track completion
- ✅ Level unlocking works
- ✅ **Fixed issue where progress wasn't saving**

### 5. User Input
- ✅ Mouse clicking works
- ✅ Keyboard shortcuts (q,w,e,r) work
- ✅ Touch input (mobile) works

## Integration with CI/CD

You can integrate these tests into your deployment pipeline:

### GitHub Actions Example
```yaml
name: Test Game
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm run test:install
      - run: npm run deploy:test
```

### Manual Deployment Checklist
Before deploying a new version:

1. ✅ `npm run deploy:check` - Verify all files
2. ✅ `npm run test` - Run full test suite  
3. ✅ Manual testing in different browsers
4. ✅ Test on mobile devices
5. ✅ Verify audio works
6. ✅ Deploy to staging first
7. ✅ Final verification on staging

## Troubleshooting

### Common Issues

**"Puppeteer not found"**
```bash
npm run test:install
```

**"Timeout waiting for selector"**
- Game might be loading slowly
- Check console errors in browser
- Increase timeout in test files

**"Tests pass locally but fail in CI"**
- Add `--no-sandbox` flag to Puppeteer
- Ensure headless mode is enabled

### Debug Mode

To see the browser during tests (helpful for debugging):

1. Edit `tests/automated-game-tests.js`
2. Change `headless: true` to `headless: false`
3. Run tests - browser window will open

### Performance Tips

- Tests run faster with `headless: true`
- Use `npm run test:quick` during development
- Run full tests only before releases

## File Structure

```
tests/
├── README.md                 # This documentation
├── automated-game-tests.js   # Main test suite
├── quick-test.js            # Fast development tests
├── deployment-check.js      # Pre-deployment verification
└── test-report.json         # Generated test results
```

## Contributing

When adding new features to the game:

1. **Add corresponding tests** to `automated-game-tests.js`
2. **Test your changes** with `npm run test:quick`
3. **Verify full functionality** with `npm test`
4. **Update this README** if needed

## The Fixed Bug

This testing system was created after fixing a critical progression bug where:

- **Problem**: Completing Penguin Pairs didn't unlock Penguin Arctic
- **Root Cause**: Habitats weren't calling `gameController.updateProgress()`
- **Solution**: Added progress tracking to all 12 habitat files
- **Verification**: Tests now verify progression works correctly

## Support

If tests fail or you need help:

1. Check the console output for specific errors
2. Review `test-report.json` for detailed results
3. Run tests with debug mode enabled
4. Check the main game console for JavaScript errors

The testing system is designed to catch regressions and ensure a smooth player experience! 🎮