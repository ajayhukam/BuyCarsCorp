const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const authRoutes = require('./routes/authRoutes');
const oemSpecRoutes = require('./routes/oemSpecRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/oem-specs', oemSpecRoutes);
app.use('/api/inventory', inventoryRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);