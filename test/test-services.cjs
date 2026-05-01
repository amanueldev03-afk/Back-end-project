console.log('\n🔍 TESTING SERVICES FOLDER\n');

// Test emailService.js
console.log('📦 Testing emailService.js:');
try {
    const emailService = require('../src/services/emailService');
    const methods = Object.keys(emailService);
    console.log(`   Exported methods: ${methods.join(', ')}`);
    console.log('✅ emailService.js works\n');
} catch (err) {
    console.log(`❌ emailService.js failed: ${err.message}\n`);
}

// Test tokenService.js
console.log('📦 Testing tokenService.js:');
try {
    const tokenService = require('../src/services/tokenService');
    const methods = Object.keys(tokenService);
    console.log(`   Exported methods: ${methods.join(', ')}`);
    console.log('✅ tokenService.js works\n');
} catch (err) {
    console.log(`❌ tokenService.js failed: ${err.message}\n`);
}

// Test emailValidationService.js
console.log('📦 Testing emailValidationService.js:');
try {
    const validation = require('../src/services/emailValidationService');
    const methods = Object.keys(validation);
    console.log(`   Exported methods: ${methods.join(', ')}`);
    console.log('✅ emailValidationService.js works\n');
} catch (err) {
    console.log(`❌ emailValidationService.js failed: ${err.message}\n`);
}

console.log('🎉 SERVICES TESTS COMPLETED!\n');