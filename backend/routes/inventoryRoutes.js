const express = require('express');
const router = express.Router();
const {
    addCar,
    getMyCars,
    getCarById,
    updateCar,
    deleteCar,
    deleteManyCars,
    getPublicInventory // <-- Make sure to import the new function
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');


// --- PUBLIC ROUTES ---
// This GET route is for the public marketplace and must be defined BEFORE 'protect'.
router.route('/').get(getPublicInventory);


// --- PROTECTED ROUTES ---
// Apply the 'protect' middleware to all routes defined BELOW this line.
router.use(protect);

// POST to '/' is a protected route for adding a car.
router.route('/').post(addCar);

router.route('/mycars').get(getMyCars);

router.route('/delete-many').post(deleteManyCars);

router.route('/:id')
    .get(getCarById)
    .put(updateCar)
    .delete(deleteCar);

module.exports = router;