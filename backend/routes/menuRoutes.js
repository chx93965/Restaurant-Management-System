const express = require('express');
const { getMenuByRestaurant, addDishToMenu, removeDishFromMenu, createDish, uploadImage, downloadImage, updateDish } = require('../controllers/menuController');

const router = express.Router();
router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', addDishToMenu);
router.delete('/:restaurantId/:dishId', removeDishFromMenu);
router.post('/dish', createDish);
router.post('/:dishId/upload', uploadImage);
router.get('/:dishId/download', downloadImage);
router.put('/:dishId/', updateDish);

module.exports = router;
