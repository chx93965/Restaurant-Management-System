const db = require('../config/db');
const fs = require('fs');

const multer = require("multer");
const path = require("path");

// Create a new restaurant
const createRestaurant = (req, res) => {
    const { restaurantName, address, postcode, ownerId } = req.body;

    // Check if required fields are provided
    if (!restaurantName || !address || !ownerId) {
        return res.status(400).json({ message: 'restaurantName, address, and ownerId are required' });
    }

    // Start a transaction to ensure both restaurant and ownership are inserted
    db.serialize(() => {
        // Insert restaurant into the restaurants table
        const restaurantQuery = `INSERT INTO restaurants (restaurantName, address, postcode) VALUES (?, ?, ?)`;
        db.run(restaurantQuery, [restaurantName, address, postcode], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error creating restaurant' });
            }

            // Get the last inserted restaurantId
            const restaurantId = this.lastID;

            // Insert into the restaurantOwners table to associate the owner with the restaurant
            const ownershipQuery = `INSERT INTO restaurantOwners (restaurantId, userId) VALUES (?, ?)`;
            db.run(ownershipQuery, [restaurantId, ownerId], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error assigning ownership' });
                }

                // Send success response
                res.status(201).json({
                    restaurantId,
                    message: 'Restaurant and ownership created successfully',
                });
            });
        });
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
const getRestaurantByUsername = (req, res) => {
    const { username } = req.params;

    const query = `
        SELECT r.*
        FROM restaurants r
        JOIN restaurantOwners ro ON r.id = ro.restaurantId
        JOIN users u ON ro.userId = u.id
        WHERE u.username = ?;
    `;

    db.get(query, [username], (err, restaurant) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching restaurant' });
        }
        if (!restaurant) {
            return res.status(404).json({ message: 'No restaurant found for this user' });
        }
        res.json(restaurant);
    });
};

const getRestaurantById = (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM restaurants WHERE id = ?`;

    db.get(query, [id], (err, restaurant) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching restaurant by ID' });
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
    const { restaurantName, address, postcode } = req.body;

    if (!restaurantName && !address && !postcode) {
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
    if (postcode) {
        query += ` postcode = ?,`;
        params.push(postcode);
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

        // Fetch updated restaurant
        db.get(`SELECT id, restaurantName, address, postcode, imageLocation FROM restaurants WHERE id = ?`, [id], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error retrieving updated restaurant' });
            }
            res.json(row);
        });
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

const updateTablesForRestaurant = (req, res) => {
    const { id } = req.params;
    const { tables } = req.body;

    if (!id || !Array.isArray(tables)) {
        return res.status(400).json({ message: "Restaurant ID and an array of tables are required." });
    }

    const deleteQuery = `DELETE FROM tables WHERE restaurantId = ?`;
    const insertQuery = `INSERT INTO tables (size, restaurantId) VALUES (?, ?)`;

    db.serialize(() => {
        db.run(deleteQuery, [id], (err) => {
            if (err) {
                console.error("Error deleting existing tables:", err.message);
                return res.status(500).json({ message: "Error updating tables" });
            }

            const insertStmt = db.prepare(insertQuery);

            for (const size of tables) {
                insertStmt.run([size, id], (err) => {
                    if (err) {
                        console.error("Error inserting new table:", err.message);
                    }
                });
            }

            insertStmt.finalize((err) => {
                if (err) {
                    console.error("Error finalizing insert statement:", err.message);
                    return res.status(500).json({ message: "Error finalizing table update" });
                }

                res.status(200).json({ message: "Tables updated successfully" });
            });
        });
    });
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/Restaurant"); // Store images in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed."), false);
    }
};
const upload = multer({ storage, fileFilter }).single('image');

const uploadImage = (req, res) => {
    const { restaurantId } = req.params; // Assuming restaurantId will be passed in the URL
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload an image' });
        }

        // Save image path in the database
        const imageUrl = `/uploads/Restaurant/${req.file.filename}`; // Update the path for restaurants
        const query = `UPDATE restaurants SET imageLocation = ? WHERE id = ?`; // Update query for restaurants

        db.run(query, [imageUrl, restaurantId], function (dbErr) {
            if (dbErr) {
                return res.status(500).json({ error: dbErr.message });
            }
            res.status(200).json({
                message: 'Image uploaded successfully',
                imageUrl: imageUrl
            });
        });
    });
};

const downloadImage = (req, res) => {
    const { restaurantId } = req.params; // Assuming restaurantId will be passed in the URL

    // Retrieve image filename from database
    const query = `SELECT imageLocation FROM restaurants WHERE id = ?`; // Query for restaurants

    db.get(query, [restaurantId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row || !row.imageLocation) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const imagePath = path.join(__dirname, '..', row.imageLocation); // Image path points to uploads/Restaurant/
        console.log(imagePath)
        // Check if file exists before attempting to send
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: 'Image file not found on server' });
        }

        // Send the file for download
        res.download(imagePath, row.imageLocation, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error downloading image' });
            }
        });
    });
};


const getImageUrl = (req, res) => {
    const { restaurantId } = req.params;

    // Retrieve image filename from database
    const query = `SELECT imageLocation FROM restaurants WHERE id = ?`;

    db.get(query, [restaurantId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row || !row.imageLocation) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const imagePath = path.join(__dirname, '..', row.imageLocation); // Image path points to uploads/Restaurant/
        return res.json({ imagePath });
    });
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantByUsername,
    updateRestaurant,
    deleteRestaurant,
    createTablesForRestaurant,
    addTable,
    deleteTable,
    getTablesByRestaurant,
    uploadImage,
    getImageUrl,
    downloadImage,
    updateTablesForRestaurant,
    getRestaurantById
};
