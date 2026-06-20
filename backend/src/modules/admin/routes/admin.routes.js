const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../../../middleware/authenticate');

const router = express.Router();

router.use(authenticate, authorize(['admin']));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.post('/users', adminController.createUser);
router.get('/stores', adminController.listStores);
router.post('/stores', adminController.createStore);

module.exports = router;
