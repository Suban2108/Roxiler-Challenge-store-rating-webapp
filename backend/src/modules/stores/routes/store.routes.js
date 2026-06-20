const express = require('express');
const storeController = require('../controllers/store.controller');
const { authenticate, authorize } = require('../../../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, authorize(['user']), storeController.listStores);

module.exports = router;
