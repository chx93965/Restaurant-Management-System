const db = require('../config/db');

// Get all dishes for a specific restaurant
const getMenuByRestaurant = (req, res) => {
    const { restaurantId } = req.params;
    const query = `
        SELECT d.id, d.dishName, d.price, d.imageLocation 
        FROM menus m 
        JOIN dishes d ON m.dishId = d.id 
        WHERE m.restaurantId = ?;
    `;
    db.all(query, [restaurantId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching menu' });
        }
        res.json(rows);
    });
};

// Add a dish to a restaurant's menu
const addDishToMenu = (req, res) => {
    const { restaurantId, dishId } = req.body;
    const query = `INSERT INTO menus (restaurantId, dishId) VALUES (?, ?)`;
    db.run(query, [restaurantId, dishId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error adding dish to menu' });
        }
        res.status(201).json({ id: this.lastID, restaurantId, dishId });
    });
};

// Remove a dish from a restaurant's menu
const removeDishFromMenu = (req, res) => {
    const { restaurantId, dishId } = req.params;
    const query = `DELETE FROM menus WHERE restaurantId = ? AND dishId = ?`;
    db.run(query, [restaurantId, dishId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error removing dish from menu' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Dish not found in menu' });
        }
        res.json({ message: 'Dish removed from menu' });
    });
};

module.exports = {
    getMenuByRestaurant,
    addDishToMenu,
    removeDishFromMenu
};
