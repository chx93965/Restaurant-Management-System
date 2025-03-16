const express = require('express');
const { createOrder, addOrderItem, getAllOrders, getOrderById, completeOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.post('/items', addOrderItem);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/complete', completeOrder);

module.exports = router;
