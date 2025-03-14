const db = require('../config/db');

// Create a new restaurant
const createRestaurant = (req, res) => {
    const { name, location } = req.body;

    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required' });
    }

    const query = `INSERT INTO restaurants (name, location) VALUES (?, ?)`;

    db.run(query, [name, location], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error creating restaurant' });
        }
        res.status(201).json({ restaurantId: this.lastID, message: 'Restaurant created successfully' });
    });
};

// Get all restaurants
const getAllRestaurants = (req, res) => {
    db.all(`SELECT * FROM restaurants`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching restaurants' });
        }
        res.json(rows);
    });
};

// Get a specific restaurant by ID
const getRestaurantById = (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM restaurants WHERE id = ?`, [id], (err, restaurant) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching restaurant' });
        }
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    });
};

// Update restaurant details
const updateRestaurant = (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;

    if (!name && !location) {
        return res.status(400).json({ message: 'At least one field (name or location) must be provided for update' });
    }

    let query = `UPDATE restaurants SET`;
    const params = [];

    if (name) {
        query += ` name = ?,`;
        params.push(name);
    }
    if (location) {
        query += ` location = ?,`;
        params.push(location);
    }

    query = query.slice(0, -1); // Remove trailing comma
    query += ` WHERE id = ?`;
    params.push(id);

    db.run(query, params, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error updating restaurant' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant updated successfully' });
    });
};

// Delete a restaurant
const deleteRestaurant = (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM restaurants WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting restaurant' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant deleted successfully' });
    });
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};
