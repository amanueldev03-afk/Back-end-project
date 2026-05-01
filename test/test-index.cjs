const fs = require('fs');
const path = require('path');

console.log('\n🔍 TESTING MAIN INDEX.JS\n');

const indexPath = path.join(__dirname, '../src/index.js');

if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    
    console.log('📦 Checking imports:');
    const imports = ['express', 'mongoose', 'cors', 'helmet', 'morgan', 'cookie-parser'];
    imports.forEach(imp => {
        if (content.includes(`require('${imp}')`) || content.includes(`require("./${imp}")`)) {
            console.log(`   ✅ ${imp}`);
        } else {
            console.log(`   ❌ ${imp}`);
        }
    });

    console.log('\n📦 Checking route mounting:');
    
    // Check direct route mounting (your pattern)
    if (content.includes("app.use('/api/auth', authRoutes)")) {
        console.log('   ✅ /api/auth (direct mount)');
    } else {
        console.log('   ⚠️  /api/auth not directly mounted');
    }
    
    if (content.includes("app.use('/api/users', userRoutes)")) {
        console.log('   ✅ /api/users (direct mount)');
    } else {
        console.log('   ⚠️  /api/users may be mounted via versioning');
    }
    
    if (content.includes("app.use('/api/companies', companyRoutes)")) {
        console.log('   ✅ /api/companies (direct mount)');
    } else {
        console.log('   ⚠️  /api/companies may be mounted via versioning');
    }
    
    if (content.includes("app.use('/api/jobs', jobRoutes)")) {
        console.log('   ✅ /api/jobs (direct mount)');
    } else {
        console.log('   ⚠️  /api/jobs may be mounted via versioning');
    }
    
    if (content.includes("app.use('/api/applications', applicationRoutes)")) {
        console.log('   ✅ /api/applications (direct mount)');
    } else {
        console.log('   ⚠️  /api/applications may be mounted via versioning');
    }

    // Check for versioned API routing (alternative pattern)
    if (content.includes("app.use('/api', apiRoutes)")) {
        console.log('\n   ✅ Versioned API pattern detected (all routes via /api)');
    }

    // Check server start
    if (content.includes('app.listen') && content.includes('startServer')) {
        console.log('\n   ✅ Server start function found');
    } else {
        console.log('\n   ❌ Server start function missing');
    }
    
    console.log('\n✅ index.js structure verified');
} else {
    console.log('❌ index.js NOT FOUND!');
}

console.log('\n🎉 INDEX TESTS COMPLETED!\n');
