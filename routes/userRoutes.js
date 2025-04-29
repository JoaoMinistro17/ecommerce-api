const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const userController = require('../controllers/userController');

// Public
router.post('/register', userController.register);
router.post('/login', userController.login);

// Private
router.put('/make-admin/:id', auth, admin, userController.makeAdmin);

module.exports = router;