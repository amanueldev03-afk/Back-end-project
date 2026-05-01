console.log('\n🔍 TESTING MIDDLEWARE FOLDER\n');

// Test authMiddleware.js
console.log('📦 Testing authMiddleware.js:');
try {
    const authMiddleware = require('../src/middleware/authMiddleware');
    console.log(`   protect: ${typeof authMiddleware.protect}`);
    console.log(`   authorize: ${typeof authMiddleware.authorize}`);
    console.log(`   checkOwnership: ${typeof authMiddleware.checkOwnership}`);
    console.log(`   requireCompanyProfile: ${typeof authMiddleware.requireCompanyProfile}`);
    console.log('✅ authMiddleware.js works\n');
} catch (err) {
    console.log(`❌ authMiddleware.js failed: ${err.message}\n`);
}

// Test validationMiddleware.js
console.log('📦 Testing validationMiddleware.js:');
try {
    const validation = require('../src/middleware/validationMiddleware');
    console.log(`   validateRegister: ${typeof validation.validateRegister}`);
    console.log(`   validateLogin: ${typeof validation.validateLogin}`);
    console.log(`   validateJob: ${typeof validation.validateJob}`);
    console.log(`   validateCompany: ${typeof validation.validateCompany}`);
    console.log(`   validateApplication: ${typeof validation.validateApplication}`);
    console.log('✅ validationMiddleware.js works\n');
} catch (err) {
    console.log(`❌ validationMiddleware.js failed: ${err.message}\n`);
}

// Test errorHandler.js
console.log('📦 Testing errorHandler.js:');
try {
    const errorHandler = require('../src/middleware/errorHandler');
    console.log(`   errorHandler: ${typeof errorHandler.errorHandler}`);
    console.log(`   notFound: ${typeof errorHandler.notFound}`);
    console.log(`   asyncHandler: ${typeof errorHandler.asyncHandler}`);
    console.log('✅ errorHandler.js works\n');
} catch (err) {
    console.log(`❌ errorHandler.js failed: ${err.message}\n`);
}

// Test rateLimiter.js
console.log('📦 Testing rateLimiter.js:');
try {
    const rateLimiter = require('../src/middleware/rateLimiter');
    console.log(`   loginLimiter: ${typeof rateLimiter.loginLimiter}`);
    console.log(`   registerLimiter: ${typeof rateLimiter.registerLimiter}`);
    console.log(`   jobPostLimiter: ${typeof rateLimiter.jobPostLimiter}`);
    console.log(`   applicationLimiter: ${typeof rateLimiter.applicationLimiter}`);
    console.log('✅ rateLimiter.js works\n');
} catch (err) {
    console.log(`❌ rateLimiter.js failed: ${err.message}\n`);
}

// Test uploadMiddleware.js
console.log('📦 Testing uploadMiddleware.js:');
try {
    const upload = require('../src/middleware/uploadMiddleware');
    console.log(`   uploadAvatar: ${typeof upload.uploadAvatar}`);
    console.log(`   uploadLogo: ${typeof upload.uploadLogo}`);
    console.log(`   uploadResume: ${typeof upload.uploadResume}`);
    console.log(`   handleUploadError: ${typeof upload.handleUploadError}`);
    console.log('✅ uploadMiddleware.js works\n');
} catch (err) {
    console.log(`❌ uploadMiddleware.js failed: ${err.message}\n`);
}

console.log('🎉 MIDDLEWARE TESTS COMPLETED!\n');