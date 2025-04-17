const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.post('/checkout', auth, orderController.checkout);
router.get('/', auth, orderController.getOrders);

router.get('/all', auth, admin, orderController.getAllOrders);

module.exports = router;
