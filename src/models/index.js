const mongoose = require('mongoose');
const User = require('./User');
const Company = require('./Company');
const Job = require('./Job');
const Application = require('./Application');

const initializeRelations = () => {
    console.log('✅ Model relationships initialized');
};

const getModel = (modelName) => {
    const models = {
        User,
        Company,
        Job,
        Application
    };
    return models[modelName];
};

const connect = async (MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully');
        initializeRelations();
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
};

module.exports = {
    User,
    Company,
    Job,
    Application,
    getModel,
    connect,
    initializeRelations
};