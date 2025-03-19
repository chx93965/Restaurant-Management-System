const express = require('express');
const { addOrder, addItemsToOrder, getOrders, getOrderById, markOrderAsCompleted, deleteOrder, removeItemFromOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/', addOrder);
router.post('/:orderId/items', addItemsToOrder);
router.get("/:restaurantId/:status", getOrders);
router.get('/:id', getOrderById);
router.patch('/:orderId/complete', markOrderAsCompleted);
router.delete('/:orderId', deleteOrder);
router.delete('/:orderId/items/:itemId', removeItemFromOrder);

module.exports = router;
