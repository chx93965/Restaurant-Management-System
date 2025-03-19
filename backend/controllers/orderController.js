const db = require('../config/db');

// Create a new order
const addOrder = (req, res) => {
    const { restaurantId, tableId, dishes } = req.body;

    if (!restaurantId || !Array.isArray(dishes) || dishes.length === 0) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    const orderType = tableId ? "dine-in" : "takeout"; // Defaulting to 'takeout' if no tableId

    // Insert order into orders table
    const insertOrderQuery = `INSERT INTO orders (restaurantId, orderType, tableId) VALUES (?, ?, ?)`;
    
    db.run(insertOrderQuery, [restaurantId, orderType, tableId || null], function (err) {
        if (err) {
            console.error("Error creating order:", err.message);
            return res.status(500).json({ message: "Failed to create order" });
        }

        const orderId = this.lastID; // Get the last inserted order ID

        // Insert items into order_items table
        const insertOrderItemsQuery = `INSERT INTO order_items (orderId, dishId) VALUES (?, ?)`;

        const statements = dishes.map(dish => {
            return new Promise((resolve, reject) => {
                db.run(insertOrderItemsQuery, [orderId, dish.dishId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

        Promise.all(statements)
            .then(() => res.status(201).json({ message: "Order created successfully", orderId }))
            .catch(err => {
                console.error("Error adding order items:", err.message);
                res.status(500).json({ message: "Failed to add order items" });
            });
    });
};

// Add items to an order
const addItemsToOrder = (req, res) => {
    const { orderId } = req.params;
    const { dishes } = req.body; // Expecting an array of { dishId, quantity }

    if (!Array.isArray(dishes) || dishes.length === 0) {
        return res.status(400).json({ message: "Invalid or empty dishes array" });
    }

    const insertQuery = `INSERT INTO order_items (orderId, dishId) VALUES (?, ?)`;

    db.serialize(() => {
        const stmt = db.prepare(insertQuery);

        dishes.forEach(({ dishId }) => {
            stmt.run(orderId, dishId, (err) => {
                if (err) {
                    console.error("Error adding item to order:", err.message);
                    return res.status(500).json({ message: "Error adding items to order" });
                }
            });
        });

        stmt.finalize((err) => {
            if (err) {
                console.error("Error finalizing statement:", err.message);
                return res.status(500).json({ message: "Failed to finalize item insertion" });
            }
            res.json({ message: "Items added to order successfully" });
        });
    });
};

const removeItemFromOrder = (req, res) => {
    const { orderId, itemId } = req.params;

    const deleteQuery = `DELETE FROM order_items WHERE orderId = ? AND id = ?`;

    db.run(deleteQuery, [orderId, itemId], function (err) {
        if (err) {
            console.error("Error removing item from order:", err.message);
            return res.status(500).json({ message: "Error removing item from order" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Item not found in order" });
        }

        res.json({ message: "Item removed from order successfully" });
    });
};

// Get all orders
const getOrders = (req, res) => {
    const { restaurantId, status } = req.params;

    let query = `
        SELECT o.id AS orderId, o.restaurantId, o.orderType, o.tableId, o.status, o.createdAt,
               oi.id AS orderItemId, oi.dishId, d.dishName, d.price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.orderId
        LEFT JOIN dishes d ON oi.dishId = d.id
        WHERE o.restaurantId = ?
    `;

    const queryParams = [restaurantId];

    if (status) {
        query += ` AND o.status = ?`;
        queryParams.push(status);
    }

    db.all(query, queryParams, (err, rows) => {
        if (err) {
            console.error("Error fetching orders:", err.message);
            return res.status(500).json({ message: "Error retrieving orders" });
        }

        // Group orders with their items
        const orders = {};
        rows.forEach(row => {
            if (!orders[row.orderId]) {
                orders[row.orderId] = {
                    orderId: row.orderId,
                    restaurantId: row.restaurantId,
                    orderType: row.orderType,
                    tableId: row.tableId,
                    status: row.status,
                    createdAt: row.createdAt,
                    items: []
                };
            }

            if (row.orderItemId) {
                orders[row.orderId].items.push({
                    orderItemId: row.orderItemId,
                    dishId: row.dishId,
                    dishName: row.dishName,
                    quantity: row.quantity,
                    price: row.price
                });
            }
        });

        res.json(Object.values(orders)); // Convert object to array
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
const markOrderAsCompleted = (req, res) => {
    const { orderId } = req.params;

    // Query to calculate total price of the order
    const totalPriceQuery = `
        SELECT SUM(d.price) AS totalPrice
        FROM order_items oi
        JOIN dishes d ON oi.dishId = d.id
        WHERE oi.orderId = ?;
    `;

    db.get(totalPriceQuery, [orderId], (err, row) => {
        if (err) {
            console.error("Error calculating total price:", err.message);
            return res.status(500).json({ message: "Error calculating total price" });
        }
        console.log(row);
        if (!row || row.totalPrice === null) {
            return res.status(404).json({ message: "Order not found or has no items" });
        }

        // Update the order status to completed
        const updateQuery = `UPDATE orders SET status = 'completed' WHERE id = ?`;

        db.run(updateQuery, [orderId], function (updateErr) {
            if (updateErr) {
                console.error("Error updating order status:", updateErr.message);
                return res.status(500).json({ message: "Error marking order as completed" });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: "Order not found or already completed" });
            }

            res.json({
                message: "Order marked as completed successfully",
                totalPrice: row.totalPrice
            });
        });
    });
};

// Delete an order by ID
const deleteOrder = (req, res) => {
    const { orderId } = req.params;

    // Start a transaction
    db.serialize(() => {
        db.run("DELETE FROM order_items WHERE orderId = ?", [orderId], function (err) {
            if (err) {
                console.error("Error deleting order items:", err.message);
                return res.status(500).json({ message: "Error deleting order items" });
            }

            db.run("DELETE FROM orders WHERE id = ?", [orderId], function (err) {
                if (err) {
                    console.error("Error deleting order:", err.message);
                    return res.status(500).json({ message: "Error deleting order" });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ message: "Order not found" });
                }

                res.json({ message: "Order and associated items deleted successfully" });
            });
        });
    });
};
module.exports = { addOrder, addItemsToOrder, getOrders, getOrderById, markOrderAsCompleted, deleteOrder, removeItemFromOrder };
