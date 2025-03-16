const db = require('../config/db');

// Create a new order
const createOrder = (req, res) => {
    const { restaurantId, orderType, tableId } = req.body;

    if (!restaurantId || !orderType) {
        return res.status(400).json({ message: 'Restaurant ID and order type are required' });
    }

    const query = `INSERT INTO orders (restaurantId, orderType, tableId) VALUES (?, ?, ?)`;

    db.run(query, [restaurantId, orderType, tableId || null], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error creating order' });
        }
        res.status(201).json({ orderId: this.lastID, message: 'Order created successfully' });
    });
};

// Add items to an order
const addOrderItem = (req, res) => {
    const { orderId, dishId, quantity, price } = req.body;

    if (!orderId || !dishId || !quantity || !price) {
        return res.status(400).json({ message: 'Order ID, dish ID, quantity, and price are required' });
    }

    const query = `INSERT INTO order_items (orderId, dishId, quantity, price) VALUES (?, ?, ?, ?)`;

    db.run(query, [orderId, dishId, quantity, price], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error adding item to order' });
        }
        res.status(201).json({ orderItemId: this.lastID, message: 'Item added to order successfully' });
    });
};

// Get all orders
const getAllOrders = (req, res) => {
    db.all(`SELECT * FROM orders`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching orders' });
        }
        res.json(rows);
    });
};

// Get a specific order by ID
const getOrderById = (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM orders WHERE id = ?`, [id], (err, order) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching order' });
        }
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        db.all(`SELECT * FROM order_items WHERE orderId = ?`, [id], (err, items) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error fetching order items' });
            }
            res.json({ ...order, items });
        });
    });
};

// Mark an order as completed
const completeOrder = (req, res) => {
    const { id } = req.params;

    db.run(`UPDATE orders SET status = 'completed' WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error updating order status' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order marked as completed' });
    });
};

module.exports = { createOrder, addOrderItem, getAllOrders, getOrderById, completeOrder };
