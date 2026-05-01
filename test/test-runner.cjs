const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════');
console.log('     RUNNING ALL BACKEND TESTS');
console.log('═══════════════════════════════════════════════════');

// Test files are in the same directory (test/ folder)
const testDir = __dirname;

const tests = [
    { name: 'config', file: 'test-config.cjs' },
    { name: 'models', file: 'test-models.cjs' },
    { name: 'utils', file: 'test-utils.cjs' },
    { name: 'middleware', file: 'test-middleware.cjs' },
    { name: 'controllers', file: 'test-controllers.cjs' },
    { name: 'routes', file: 'test-routes.cjs' },
    { name: 'services', file: 'test-services.cjs' },
    { name: 'env', file: 'test-env.cjs' },
    { name: 'index', file: 'test-index.cjs' }
];

let passed = 0;
let failed = 0;

for (const test of tests) {
    const testPath = path.join(testDir, test.file);
    
    if (!fs.existsSync(testPath)) {
        console.log(`\n⚠️  Test file not found: ${test.file}`);
        continue;
    }
    
    console.log(`\n▶ Running ${test.name} tests...`);
    try {
        execSync(`node "${testPath}"`, { stdio: 'inherit', timeout: 30000 });
        passed++;
        console.log(`✅ ${test.name} tests passed!`);
    } catch (error) {
        failed++;
        console.log(`❌ ${test.name} tests failed!`);
    }
}

console.log('\n═══════════════════════════════════════════════════');
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════');

process.exit(failed > 0 ? 1 : 0);
