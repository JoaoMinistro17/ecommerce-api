const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.put('/make-admin/:id', auth, admin, userController.makeAdmin);

module.exports = router;