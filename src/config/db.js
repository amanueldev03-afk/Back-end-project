const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
    try {        
        await mongoose.connect(env.MONGO_URI);      
        console.log(`   MongoDB Connected: ${mongoose.connection.host}`);
        console.log(`   Database: ${mongoose.connection.name}`);      
    } catch (error) {
        console.error(' MongoDB Connection Error:', error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.error('   MongoDB is not running. Start it with:');
            console.error('   sudo systemctl start mongod');
            console.error('   OR');
            console.error('   mongod --dbpath ~/data/db');
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;