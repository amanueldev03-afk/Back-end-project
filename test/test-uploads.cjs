const fs = require('fs');
const path = require('path');

console.log('\n🔍 TESTING UPLOADS FOLDER\n');

const uploadDirs = [
    '../uploads/avatars',
    '../uploads/resumes',
    '../uploads/logos',
    '../uploads/covers'
];

console.log('📦 Testing upload directories:');
uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${dir} exists`);
    } else {
        console.log(`   ⚠️  ${dir} does not exist (will be created automatically)`);
    }
});

console.log('\n🎉 UPLOADS TESTS COMPLETED!\n');