const fs = require('fs');
const path = require('path');

console.log('\n🔍 TESTING CONFIG FOLDER\n');

// Test env.js
console.log('📦 Testing env.js:');
try {
    const env = require('../src/config/env');
    console.log(`   PORT: ${env.PORT}`);
    console.log(`   NODE_ENV: ${env.NODE_ENV}`);
    console.log(`   MONGO_URI: ${env.MONGO_URI}`);
    console.log(`   JWT_SECRET: ${env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`   CLIENT_URL: ${env.CLIENT_URL}`);
    console.log(`   EMAIL_HOST: ${env.EMAIL_HOST ? '✅ Set' : '❌ Missing'}`);
    console.log(`   EMAIL_USER: ${env.EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
    console.log('✅ env.js works\n');
} catch (err) {
    console.log(`❌ env.js failed: ${err.message}\n`);
}

// Test db.js
console.log('📦 Testing db.js:');
try {
    const connectDB = require('../src/config/db');
    console.log('   connectDB function exported');
    console.log('✅ db.js works\n');
} catch (err) {
    console.log(`❌ db.js failed: ${err.message}\n`);
}

// Test jwtConfig.js
console.log('📦 Testing jwtConfig.js:');
try {
    const jwtConfig = require('../src/config/jwtConfig');
    console.log(`   Secret: ${jwtConfig.secret ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ExpiresIn: ${jwtConfig.expiresIn}`);
    console.log(`   Cookie Options:`, jwtConfig.cookieOptions);
    console.log('✅ jwtConfig.js works\n');
} catch (err) {
    console.log(`❌ jwtConfig.js failed: ${err.message}\n`);
}

console.log('🎉 CONFIG TESTS COMPLETED!\n');