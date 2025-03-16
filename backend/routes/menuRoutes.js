const express = require('express');
const { getMenuByRestaurant, addDishToMenu, removeDishFromMenu } = require('../controllers/menuController');

const router = express.Router();

router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', addDishToMenu);
router.delete('/:restaurantId/:dishId', removeDishFromMenu);

module.exports = router;
