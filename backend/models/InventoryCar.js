const mongoose = require('mongoose');

const InventoryCarSchema = new mongoose.Schema({
    oemSpec: { type: mongoose.Schema.Types.ObjectId, ref: 'OemSpec', required: true },
    dealer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kmsOnOdometer: { type: Number, required: true },
    majorScratches: { type: Boolean, default: false },
    originalPaint: { type: Boolean, default: true },
    accidentsReported: { type: Number, default: 0 },
    previousBuyers: { type: Number, default: 1 },
    registrationPlace: { type: String, required: true, trim: true },
    askingPrice: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: [{
        type: String,
        validate: [val => val.length <= 500, 'Description bullet point is too long']
    }],
    color: { type: String, required: true, trim: true }
}, { timestamps: true });

InventoryCarSchema.path('description').validate(function(value) {
    return value.length <= 5;
}, 'You can add a maximum of 5 description bullet points.');

module.exports = mongoose.model('InventoryCar', InventoryCarSchema);