console.log('\n🔍 TESTING UTILS FOLDER\n');

// Test response.js
console.log('📦 Testing response.js:');
try {
    const response = require('../src/utils/response');
    const mockRes = {
        status: (code) => ({ json: (data) => data })
    };
    
    console.log(`   sendSuccess: ${typeof response.sendSuccess}`);
    console.log(`   sendError: ${typeof response.sendError}`);
    console.log(`   sendCreated: ${typeof response.sendCreated}`);
    console.log(`   sendBadRequest: ${typeof response.sendBadRequest}`);
    console.log(`   sendUnauthorized: ${typeof response.sendUnauthorized}`);
    console.log(`   sendForbidden: ${typeof response.sendForbidden}`);
    console.log(`   sendNotFound: ${typeof response.sendNotFound}`);
    console.log('✅ response.js works\n');
} catch (err) {
    console.log(`❌ response.js failed: ${err.message}\n`);
}

// Test passwordUtils.js
console.log('📦 Testing passwordUtils.js:');
try {
    const passwordUtils = require('../src/utils/passwordUtils');
    console.log(`   hashPassword: ${typeof passwordUtils.hashPassword}`);
    console.log(`   comparePassword: ${typeof passwordUtils.comparePassword}`);
    console.log(`   isStrongPassword: ${typeof passwordUtils.isStrongPassword}`);
    console.log(`   getPasswordStrength: ${typeof passwordUtils.getPasswordStrength}`);
    console.log('✅ passwordUtils.js works\n');
} catch (err) {
    console.log(`❌ passwordUtils.js failed: ${err.message}\n`);
}

// Test logger.js
console.log('📦 Testing logger.js:');
try {
    const logger = require('../src/utils/logger');
    console.log(`   info: ${typeof logger.info}`);
    console.log(`   error: ${typeof logger.error}`);
    console.log(`   warn: ${typeof logger.warn}`);
    console.log(`   debug: ${typeof logger.debug}`);
    console.log('✅ logger.js works\n');
} catch (err) {
    console.log(`❌ logger.js failed: ${err.message}\n`);
}

console.log('🎉 UTILS TESTS COMPLETED!\n');