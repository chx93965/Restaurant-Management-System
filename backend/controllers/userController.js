const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // Change this in production

// Register a new user
const registerUser = async (req, res) => {

    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;

        db.run(query, [username, email, hashedPassword, role], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error registering user' });
            }
            res.status(201).json({ id: this.lastID, username, email, role });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error processing request' });
    }
};

// User login
const loginUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const query = `SELECT * FROM users WHERE username = ?`;

    db.get(query, [username], async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    });
};

// Get all users (Only for admin/owner)
const getAllUsers = (req, res) => {
    db.all(`SELECT id, username, email, role FROM users`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(rows);
    });
};

// Delete a user by ID (Owner only)
const deleteUser = (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting user' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
};

const ownRestaurant = (req, res) => {
    const { userId, restaurantId } = req.params; 
    // If restaurantId is provided, create an ownership entry
    const insertOwnerQuery = `
        INSERT INTO restaurantOwners (userId, restaurantId)
        VALUES (?, ?);
    `;

    db.run(insertOwnerQuery, [userId, restaurantId], function (err) {
        if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: err.message });
        }

        db.run("COMMIT");
        res.status(201).json({ message: "User registered and ownership created." });
    });
};

const getOwnedRestaurants = (req, res) => {
    const { userId } = req.params; 
    // If restaurantId is provided, create an ownership entry
    const selectQuery = `
        SELECT r.id, r.restaurantName, r.address, r.postcode, r.imageLocation
        FROM restaurants r
        JOIN restaurantOwners ro ON r.id = ro.restaurantId
        WHERE ro.userId = ?;
    `;

    db.all(selectQuery, [userId], (err, restaurants) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: restaurants});
    });
};
module.exports = { registerUser, loginUser, getAllUsers, deleteUser, ownRestaurant, getOwnedRestaurants };
