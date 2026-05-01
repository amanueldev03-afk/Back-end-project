const mongoose = require('mongoose');
const env = require('../src/config/env');
const { User, Company, Job, Application, connect } = require('../src/models');

const testModels = async () => {
    console.log('🔍 TESTING MODELS FOLDER\n');

    await connect(env.MONGO_URI);

    // Test User Model
    console.log('📦 Testing User Model:');
    const testUser = await User.create({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
        role: 'candidate'
    });
    console.log(`   User created: ${testUser.email} (ID: ${testUser._id})`);
    
    const foundUser = await User.findById(testUser._id);
    console.log(`   User found: ${foundUser.name}`);
    console.log('✅ User Model works\n');

    // Test Company Model
    console.log('📦 Testing Company Model:');
    const testCompany = await Company.create({
        user: testUser._id,
        companyName: `Test Corp ${Date.now()}`,
        description: 'Test company description',
        location: { address: '123 Test St', city: 'Test City', country: 'USA' },
        industry: 'Technology'
    });
    console.log(`   Company created: ${testCompany.companyName}`);
    console.log('✅ Company Model works\n');

    // Test Job Model
    console.log('📦 Testing Job Model:');
    const testJob = await Job.create({
        company: testCompany._id,
        title: 'Test Developer',
        description: 'This is a test job description for verification purposes.',
        requirements: ['JavaScript', 'Testing'],
        location: 'Remote',
        compensation: { salaryMin: 50000, salaryMax: 80000 },
        employmentType: 'full-time',
        experienceLevel: 'junior',
        skills: ['javascript', 'testing'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    console.log(`   Job created: ${testJob.title}`);
    console.log('✅ Job Model works\n');

    // Test Application Model
    console.log('📦 Testing Application Model:');
    const testApp = await Application.create({
        job: testJob._id,
        candidate: testUser._id,
        documents: { resume: 'https://example.com/resume.pdf' }
    });
    console.log(`   Application created for job: ${testJob.title}`);
    console.log('✅ Application Model works\n');

    // Cleanup
    await Application.deleteMany({ candidate: testUser._id });
    await Job.deleteMany({ company: testCompany._id });
    await Company.deleteMany({ user: testUser._id });
    await User.deleteMany({ _id: testUser._id });
    
    console.log('🧹 Cleanup completed\n');
    console.log('🎉 ALL MODELS TESTS PASSED!');
    
    await mongoose.connection.close();
    process.exit(0);
};

testModels().catch(err => {
    console.error('❌ Model test failed:', err.message);
    process.exit(1);
});