console.log('\n🔍 TESTING ROUTES FOLDER\n');

// Test authRoutes.js
console.log('📦 Testing authRoutes.js:');
try {
    const router = require('../src/routes/authRoutes');
    console.log(`   router: ${typeof router}`);
    console.log('✅ authRoutes.js works\n');
} catch (err) {
    console.log(`❌ authRoutes.js failed: ${err.message}\n`);
}

// Test userRoutes.js
console.log('📦 Testing userRoutes.js:');
try {
    const router = require('../src/routes/userRoutes');
    console.log(`   router: ${typeof router}`);
    console.log('✅ userRoutes.js works\n');
} catch (err) {
    console.log(`❌ userRoutes.js failed: ${err.message}\n`);
}

// Test companyRoutes.js
console.log('📦 Testing companyRoutes.js:');
try {
    const router = require('../src/routes/companyRoutes');
    console.log(`   router: ${typeof router}`);
    console.log('✅ companyRoutes.js works\n');
} catch (err) {
    console.log(`❌ companyRoutes.js failed: ${err.message}\n`);
}

// Test jobRoutes.js
console.log('📦 Testing jobRoutes.js:');
try {
    const router = require('../src/routes/jobRoutes');
    console.log(`   router: ${typeof router}`);
    console.log('✅ jobRoutes.js works\n');
} catch (err) {
    console.log(`❌ jobRoutes.js failed: ${err.message}\n`);
}

// Test applicationRoutes.js
console.log('📦 Testing applicationRoutes.js:');
try {
    const router = require('../src/routes/applicationRoutes');
    console.log(`   router: ${typeof router}`);
    console.log('✅ applicationRoutes.js works\n');
} catch (err) {
    console.log(`❌ applicationRoutes.js failed: ${err.message}\n`);
}

console.log('🎉 ROUTES TESTS COMPLETED!\n');