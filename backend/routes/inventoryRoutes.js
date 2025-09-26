const express = require('express');
const router = express.Router();
const {
    addCar,
    getMyCars,
    getCarById,
    updateCar,
    deleteCar,
    deleteManyCars,
    getPublicInventory 
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');



router.route('/').get(getPublicInventory);



router.use(protect);

router.route('/').post(addCar);

router.route('/mycars').get(getMyCars);

router.route('/delete-many').post(deleteManyCars);

router.route('/:id')
    .get(getCarById)
    .put(updateCar)
    .delete(deleteCar);

module.exports = router;