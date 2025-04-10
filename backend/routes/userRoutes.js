const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteUser, ownRestaurant, getOwnedRestaurants, updateUserProfile } = require('../controllers/userController');

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.post('/:userId/:restaurantId', ownRestaurant);
router.get('/:userId', getOwnedRestaurants);
router.put('/:userId', updateUserProfile);

module.exports = router;
