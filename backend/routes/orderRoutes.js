const express = require('express');
const { placeOrder, verifyPayment, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, placeOrder);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, getOrders);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
