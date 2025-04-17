const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Rotas públicas
router.get('/', productController.getAllProducts);

// Rotas protegidas (admin)
router.post('/', auth, admin, productController.createProduct);
router.put('/:id', auth, admin, productController.updateProduct);
router.delete('/:id', auth, admin, productController.deleteProduct);

module.exports = router;