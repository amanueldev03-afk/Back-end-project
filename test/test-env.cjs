const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('\n🔍 TESTING .env FILE\n');

const envPath = path.join(__dirname, '../.env');
console.log(`📦 .env file path: ${envPath}`);

if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists\n');
    
    console.log('📦 Required environment variables:');
    const required = ['PORT', 'NODE_ENV', 'MONGO_URI', 'JWT_SECRET'];
    required.forEach(varName => {
        if (process.env[varName]) {
            console.log(`   ✅ ${varName}: ${varName === 'JWT_SECRET' ? '***hidden***' : process.env[varName]}`);
        } else {
            console.log(`   ❌ ${varName}: MISSING`);
        }
    });
    
    console.log('\n📦 Email configuration:');
    if (process.env.EMAIL_HOST) {
        console.log(`   ✅ EMAIL_HOST: ${process.env.EMAIL_HOST}`);
        console.log(`   ✅ EMAIL_USER: ${process.env.EMAIL_USER}`);
        console.log(`   ✅ EMAIL_PASS: ${process.env.EMAIL_PASS ? '***hidden***' : 'MISSING'}`);
    } else {
        console.log('   ⚠️  Email not configured');
    }
} else {
    console.log('❌ .env file MISSING!');
}

console.log('\n🎉 ENV TESTS COMPLETED!\n');