const db = require('../config/db');
const fs = require('fs');

const multer = require("multer");
const path = require("path");
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/Image"); // Store images in 'uploads' folder
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
    const { dishId } = req.params;
    console.log('*************')
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload an image' });
        }

        // Save image path in the database
        const imageUrl = `/uploads/Image/${req.file.filename}`;
        const query = `UPDATE dishes SET imageLocation = ? WHERE id = ?`;

        db.run(query, [imageUrl, dishId], function (dbErr) {
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
    const { dishId } = req.params;

    // Retrieve image filename from database
    const query = `SELECT imageLocation FROM dishes WHERE id = ?`;

    db.get(query, [dishId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row || !row.imageLocation) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const imagePath = path.join(__dirname, '..', row.imageLocation);
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

module.exports = {
    getMenuByRestaurant,
    addDishToMenu,
    removeDishFromMenu,
    createDish,
    uploadImage,
    downloadImage
};
