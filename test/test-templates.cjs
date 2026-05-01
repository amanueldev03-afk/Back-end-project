const fs = require('fs');
const path = require('path');

console.log('\n🔍 TESTING TEMPLATES FOLDER\n');

const templatesDir = path.join(__dirname, '../src/templates');
const templates = ['verificationEmail.js', 'welcomeEmail.js', 'passwordResetEmail.js'];

console.log('📦 Testing templates:');
templates.forEach(template => {
    const templatePath = path.join(templatesDir, template);
    if (fs.existsSync(templatePath)) {
        console.log(`   ✅ ${template} exists`);
    } else {
        console.log(`   ❌ ${template} missing`);
    }
});

console.log('\n🎉 TEMPLATES TESTS COMPLETED!\n');