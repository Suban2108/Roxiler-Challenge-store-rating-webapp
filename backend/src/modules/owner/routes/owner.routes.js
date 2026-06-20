const express = require('express');
const ownerController = require('../controllers/owner.controller');
const { authenticate, authorize } = require('../../../middleware/authenticate');

const router = express.Router();

router.use(authenticate, authorize(['store_owner']));

router.get('/dashboard', ownerController.getDashboard);

module.exports = router;
