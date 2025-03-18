const db = require('../config/db');

// Create a new restaurant
const createRestaurant = (req, res) => {
    const { restaurantName, address, postCode } = req.body;

    if (!restaurantName || !address) {
        return res.status(400).json({ message: 'restaurantName and address are required' });
    }

    const query = `INSERT INTO restaurants (restaurantName, address, postcode) VALUES (?, ?, ?)`;

    db.run(query, [restaurantName, address, postCode], function (err) {
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
    const { restaurantName, address, postCode } = req.body;

    if (!restaurantName && !address && !postCode) {
        return res.status(400).json({ message: 'restaurantName, address and postCode fields are required' });
    }

    let query = `UPDATE restaurants SET`;
    const params = [];

    if (restaurantName) {
        query += ` restaurantName = ?,`;
        params.push(restaurantName);
    }
    if (address) {
        query += ` address = ?,`;
        params.push(address);
    }
    if (postCode) {
        query += ` postCode = ?,`;
        params.push(postCode);
    }
    query = query.slice(0, -1); 
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
const createTablesForRestaurant = (req, res) => {
    const { id } = req.params;
    const { tables } = req.body;
    console.log(id, tables);
    if (!id || !Array.isArray(tables) || tables.length === 0) {
        return res.status(400).json({ message: "id and an array of table sizes are required." });
    }

    const query = `INSERT INTO tables (size, restaurantId) VALUES (?, ?)`;

    tables.forEach(size => {
        db.run(query, [size, id], err => {
            if (err) {
                console.error("Error inserting table:", err.message);
                return res.status(500).json({ message: "Error creating tables" });
            }
        });
    });

    res.status(201).json({ message: "Tables created successfully" });
};

// Add a single table to a restaurant
const addTable = (req, res) => {
    const { id, size } = req.params;

    if (!id || !size) {
        return res.status(400).json({ message: "restaurantId and size are required." });
    }

    const query = `INSERT INTO tables (size, restaurantId) VALUES (?, ?)`;

    db.run(query, [size, id], function (err) {
        if (err) {
            console.error("Error adding table:", err.message);
            return res.status(500).json({ message: "Error adding table" });
        }
        res.status(201).json({ message: "Table added successfully", tableId: this.lastID });
    });
};

// Delete a table by its ID
const deleteTable = (req, res) => {
    const { tableId } = req.params;

    if (!tableId) {
        return res.status(400).json({ message: "Table ID is required." });
    }

    const query = `DELETE FROM tables WHERE id = ?`;

    db.run(query, [tableId], function (err) {
        if (err) {
            console.error("Error deleting table:", err.message);
            return res.status(500).json({ message: "Error deleting table" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Table not found" });
        }

        res.status(200).json({ message: "Table deleted successfully" });
    });
};

const getTablesByRestaurant = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Restaurant ID is required." });
    }

    const query = `SELECT id, size FROM tables WHERE restaurantId = ?`;

    db.all(query, [id], (err, rows) => {
        if (err) {
            console.error("Error fetching tables:", err.message);
            return res.status(500).json({ message: "Error fetching tables" });
        }

        res.status(200).json(rows);
    });
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    createTablesForRestaurant,
    addTable,
    deleteTable,
    getTablesByRestaurant
};
