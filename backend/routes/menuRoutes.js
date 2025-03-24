const express = require('express');
const { getMenuByRestaurant, addDishToMenu, removeDishFromMenu, createDish, uploadImage, downloadImage } = require('../controllers/menuController');

const router = express.Router();
router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', addDishToMenu);
router.delete('/:restaurantId/:dishId', removeDishFromMenu);
router.post('/dish', createDish);
router.post('/:dishId/upload', uploadImage);
router.post('/:dishId/download', downloadImage);

module.exports = router;
