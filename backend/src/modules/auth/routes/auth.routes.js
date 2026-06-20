const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../../../middleware/authenticate');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.patch('/password', authenticate, authController.changePassword);

module.exports = router;
