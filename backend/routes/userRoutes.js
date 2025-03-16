const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;
