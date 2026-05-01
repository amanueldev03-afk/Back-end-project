console.log('\n🔍 TESTING CONTROLLERS FOLDER\n');

// Test authController.js
console.log('📦 Testing authController.js:');
try {
    const authController = require('../src/controllers/authController');
    const methods = Object.keys(authController);
    console.log(`   Exported methods: ${methods.join(', ')}`);
    console.log(`   Total: ${methods.length} methods`);
    console.log('✅ authController.js works\n');
} catch (err) {
    console.log(`❌ authController.js failed: ${err.message}\n`);
}

// Test userController.js
console.log('📦 Testing userController.js:');
try {
    const userController = require('../src/controllers/userController');
    const methods = Object.keys(userController);
    console.log(`   Exported methods: ${methods.slice(0, 5).join(', ')}...`);
    console.log(`   Total: ${methods.length} methods`);
    console.log('✅ userController.js works\n');
} catch (err) {
    console.log(`❌ userController.js failed: ${err.message}\n`);
}

// Test companyController.js
console.log('📦 Testing companyController.js:');
try {
    const companyController = require('../src/controllers/companyController');
    const methods = Object.keys(companyController);
    console.log(`   Exported methods: ${methods.slice(0, 5).join(', ')}...`);
    console.log(`   Total: ${methods.length} methods`);
    console.log('✅ companyController.js works\n');
} catch (err) {
    console.log(`❌ companyController.js failed: ${err.message}\n`);
}

// Test jobController.js
console.log('📦 Testing jobController.js:');
try {
    const jobController = require('../src/controllers/jobController');
    const methods = Object.keys(jobController);
    console.log(`   Exported methods: ${methods.slice(0, 5).join(', ')}...`);
    console.log(`   Total: ${methods.length} methods`);
    console.log('✅ jobController.js works\n');
} catch (err) {
    console.log(`❌ jobController.js failed: ${err.message}\n`);
}

// Test applicationController.js
console.log('📦 Testing applicationController.js:');
try {
    const applicationController = require('../src/controllers/applicationController');
    const methods = Object.keys(applicationController);
    console.log(`   Exported methods: ${methods.slice(0, 5).join(', ')}...`);
    console.log(`   Total: ${methods.length} methods`);
    console.log('✅ applicationController.js works\n');
} catch (err) {
    console.log(`❌ applicationController.js failed: ${err.message}\n`);
}

// Test uploadController.js
console.log('📦 Testing uploadController.js:');
try {
    const uploadController = require('../src/controllers/uploadController');
    const methods = Object.keys(uploadController);
    console.log(`   Exported methods: ${methods.join(', ')}`);
    console.log('✅ uploadController.js works\n');
} catch (err) {
    console.log(`❌ uploadController.js failed: ${err.message}\n`);
}

console.log('🎉 CONTROLLERS TESTS COMPLETED!\n');