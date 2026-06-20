const express = require('express');
const ratingController = require('../controllers/rating.controller');
const { authenticate, authorize } = require('../../../middleware/authenticate');

const router = express.Router();

router.use(authenticate, authorize(['user']));

router.post('/', ratingController.submitRating);
router.patch('/:storeId', ratingController.updateRating);

module.exports = router;
