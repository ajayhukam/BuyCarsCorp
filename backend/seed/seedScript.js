const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // <-- ADD THIS LINE to import the 'path' module

const { oemSpecs } = require('./dummyData');
const OemSpec = require('../models/OemSpec');
const InventoryCar = require('../models/InventoryCar');
const User = require('../models/User');

// --- THIS IS THE FIX ---
// Tell dotenv to look for the .env file in the PARENT directory (the backend root)
dotenv.config({ path: path.resolve(__dirname, '../.env') }); 
// --- END OF FIX ---

const connectDB = async () => {
    try {
        // Now process.env.MONGO_URI will be correctly loaded
        await mongoose.connect(process.env.MONGO_URI); 
        console.log('MongoDB Connected for Seeding...');
    } catch (error) {
        console.error(`Error connecting to DB: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        console.log('Clearing old data...');
        // Clear existing data
        await OemSpec.deleteMany();
        await InventoryCar.deleteMany();
        await User.deleteMany(); // WARNING: This deletes all users.

        console.log('Importing OEM Specs...');
        await OemSpec.insertMany(oemSpecs);
        
        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error during data import: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
     try {
        await OemSpec.deleteMany();
        await InventoryCar.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};


// Connect to DB first, then run import/destroy
connectDB().then(() => {
    // To run import: node seed/seedScript.js
    // To run destroy: node seed/seedScript.js -d
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
});