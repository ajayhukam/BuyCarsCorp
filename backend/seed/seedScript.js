const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); 

const { oemSpecs } = require('./dummyData');
const OemSpec = require('../models/OemSpec');
const InventoryCar = require('../models/InventoryCar');
const User = require('../models/User');


dotenv.config({ path: path.resolve(__dirname, '../.env') }); 


const connectDB = async () => {
    try {
        
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
        
        await OemSpec.deleteMany();
        await InventoryCar.deleteMany();
        await User.deleteMany(); 
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


connectDB().then(() => {
   
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
});