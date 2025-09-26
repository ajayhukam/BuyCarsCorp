const mongoose = require('mongoose');

const OemSpecSchema = new mongoose.Schema({
    make: { type: String, required: true, trim: true }, // e.g., "Honda"
    model: { type: String, required: true, trim: true }, // e.g., "City"
    year: { type: Number, required: true },
    listPrice: { type: Number, required: true },
    colors: [{ type: String }],
    mileage: { type: Number, required: true }, // As advertised by manufacturer (KMPL)
    powerBHP: { type: Number, required: true },
    maxSpeed: { type: Number, required: true },
});

// Create a compound index for efficient searching
OemSpecSchema.index({ make: 1, model: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('OemSpec', OemSpecSchema);