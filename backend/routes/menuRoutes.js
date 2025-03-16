const express = require('express');
const { getMenuByRestaurant, addDishToMenu, removeDishFromMenu, createDish, getAllDishes } = require('../controllers/menuController');

const router = express.Router();
router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', addDishToMenu);
router.delete('/:restaurantId/:dishId', removeDishFromMenu);
router.post('/dish', createDish);

module.exports = router;
