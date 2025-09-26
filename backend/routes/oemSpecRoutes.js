const express = require('express');
const router = express.Router();
const { getOemSpecCount, searchOemSpecs, getAllOemSpecs } = require('../controllers/oemSpecController');

router.get('/count', getOemSpecCount);
router.get('/search', searchOemSpecs);
router.get('/', getAllOemSpecs); 
module.exports = router;