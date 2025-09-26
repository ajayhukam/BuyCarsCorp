const OemSpec = require('../models/OemSpec');

// @desc    Get count of all OEM models
// @route   GET /api/oem-specs/count
// @access  Public
exports.getOemSpecCount = async (req, res) => {
    try {
        const count = await OemSpec.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Search for OEM specs (e.g., Honda City 2015)
// @route   GET /api/oem-specs/search
// @access  Public
exports.searchOemSpecs = async (req, res) => {
    const { make, model, year } = req.query;
    if (!make || !model || !year) {
        return res.status(400).json({ success: false, message: 'Please provide make, model, and year parameters' });
    }
    try {
        const spec = await OemSpec.findOne({ 
            make: new RegExp(`^${make}$`, 'i'), // Case-insensitive exact match
            model: new RegExp(`^${model}$`, 'i'),
            year: parseInt(year)
        });

        if (!spec) {
            return res.status(404).json({ success: false, message: 'OEM Specification not found' });
        }
        res.status(200).json({ success: true, data: spec });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all OEM models for dropdowns
// @route   GET /api/oem-specs
// @access  Public
exports.getAllOemSpecs = async (req, res) => {
    try {
        const specs = await OemSpec.find({}).sort({ make: 1, model: 1, year: -1 });
        res.status(200).json(specs);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};