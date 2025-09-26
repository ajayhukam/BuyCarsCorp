const InventoryCar = require('../models/InventoryCar');
const mongoose = require('mongoose');

// @desc    Add a new car to inventory
// @route   POST /api/inventory
// @access  Private (Protected)
exports.addCar = async (req, res) => {
    try {
        // Associate the new car with the logged-in dealer (req.user is from 'protect' middleware)
        const carData = { ...req.body, dealer: req.user._id, oemSpec: req.body.oemSpecId };
        const newCar = await InventoryCar.create(carData);
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ message: 'Failed to add car', error: error.message });
    }
};

// @desc    Get all cars for the logged-in dealer
// @route   GET /api/inventory/mycars
// @access  Private (Protected)
exports.getMyCars = async (req, res) => {
    try {
        const cars = await InventoryCar.find({ dealer: req.user._id }).populate('oemSpec').sort({ createdAt: -1 });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single car by ID (for editing)
// @route   GET /api/inventory/:id
// @access  Private (Protected)
exports.getCarById = async (req, res) => {
    try {
        const car = await InventoryCar.findById(req.params.id).populate('oemSpec');
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        // Security check: Ensure the dealer owns this car
        if (car.dealer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this car' });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a car's details
// @route   PUT /api/inventory/:id
// @access  Private (Protected)
exports.updateCar = async (req, res) => {
    try {
        let car = await InventoryCar.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        if (car.dealer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this car' });
        }
        car = await InventoryCar.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update car', error: error.message });
    }
};

// @desc    Delete a single car entry
// @route   DELETE /api/inventory/:id
// @access  Private (Protected)
exports.deleteCar = async (req, res) => {
    try {
        const car = await InventoryCar.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        if (car.dealer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this car' });
        }
        await car.deleteOne();
        res.status(200).json({ message: 'Car removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete multiple car entries
// @route   POST /api/inventory/delete-many
// @access  Private (Protected)
exports.deleteManyCars = async (req, res) => {
    const { carIds } = req.body;
    if (!carIds || !Array.isArray(carIds) || carIds.length === 0) {
        return res.status(400).json({ message: 'Please provide an array of car IDs' });
    }
    try {
        const result = await InventoryCar.deleteMany({
            _id: { $in: carIds },
            dealer: req.user._id // Crucial security check
        });

        if (result.deletedCount > 0) {
            res.json({ message: `${result.deletedCount} cars deleted successfully` });
        } else {
            res.status(404).json({ message: 'No matching cars found to delete for this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// -------------------------------------------------------------------
// --- NEW PUBLIC MARKETPLACE FUNCTION ---
// -------------------------------------------------------------------

// @desc    Get all publicly listed cars with filtering, sorting, and pagination
// @route   GET /api/inventory
// @access  Public
exports.getPublicInventory = async (req, res) => {
    try {
        const queryObj = { ...req.query };

        // 1. Build the base query from filters
        const query = {};

        // --- FILTERING ---
        if (queryObj.minPrice || queryObj.maxPrice) {
            query.askingPrice = {};
            if (queryObj.minPrice) query.askingPrice.$gte = parseInt(queryObj.minPrice);
            if (queryObj.maxPrice) query.askingPrice.$lte = parseInt(queryObj.maxPrice);
        }
        if (queryObj.maxMileage) {
            query.kmsOnOdometer = { $lte: parseInt(queryObj.maxMileage) };
        }
        if (queryObj.color) {
            query.color = { $regex: queryObj.color, $options: 'i' };
        }
        if (queryObj.search) {
            query.title = { $regex: queryObj.search, $options: 'i' };
        }

        // 2. Build the Mongoose query
        let result = InventoryCar.find(query).populate('oemSpec');

        // --- SORTING ---
        if (req.query.sort) {
            const [field, order] = req.query.sort.split('_');
            let sortField;
            if (field === 'price') sortField = 'askingPrice';
            if (field === 'kms') sortField = 'kmsOnOdometer';
            if (field === 'createdAt') sortField = 'createdAt';
            
            if (sortField) {
                 const sortOrder = order === 'desc' ? -1 : 1;
                 result = result.sort({ [sortField]: sortOrder });
            }
        } else {
            result = result.sort({ createdAt: -1 }); // Default sort
        }

        // --- PAGINATION ---
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await InventoryCar.countDocuments(query);
        result = result.skip(startIndex).limit(limit);

        const cars = await result;

        const pagination = {};
        if (endIndex < total) pagination.next = { page: page + 1, limit };
        if (startIndex > 0) pagination.prev = { page: page - 1, limit };

        res.status(200).json({
            success: true,
            total,
            count: cars.length,
            pagination,
            data: cars
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};