const db = require('../config/db');


const createDish = (req, res) => {
    const { dishName, dishDescription, dishPrice, restaurantId } = req.body;
    if (!dishName || !dishDescription || !dishPrice ) {
        return res.status(400).json({ message: 'dishName, dishDescription, and dishPrice are required' });
    }

    const query = `
        INSERT INTO dishes(dishName, dishDescription, price)
        VALUES (?, ?, ?);
    `;
    db.run(query, [dishName, dishDescription, dishPrice ], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error creating Dishes' });
        }
        res.status(201).json({ id: this.lastID, dishName, dishPrice });
    });
};


// Get all dishes for a specific restaurant
const getMenuByRestaurant = (req, res) => {
    const { restaurantId } = req.params;
    const query = `
        SELECT d.id, d.dishName, d.dishDescription, d.price, d.imageLocation
        FROM menus m 
        INNER JOIN dishes d on m.dishId = d.id
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
    removeDishFromMenu,
    createDish,
};
