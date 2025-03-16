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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
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

module.exports = { registerUser, loginUser, getAllUsers, deleteUser };
