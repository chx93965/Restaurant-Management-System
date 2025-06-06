const express = require('express');
const {
    createRestaurant,
    getAllRestaurants,
    getRestaurantByUsername,
    updateRestaurant,
    deleteRestaurant,
    addTable,
    deleteTable,
    createTablesForRestaurant,
    getTablesByRestaurant,
    uploadImage,
    downloadImage,
    updateTablesForRestaurant,
    getRestaurantById
} = require('../controllers/restaurantController');

const router = express.Router();

router.post('/', createRestaurant);
router.get('/', getAllRestaurants);
router.get('/:username', getRestaurantByUsername);
router.get('/:id/info', getRestaurantById);

router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);
router.post("/:id/tables/:size", addTable);
router.delete("/tables/:tableId", deleteTable);
router.post("/:id/tables", createTablesForRestaurant);
router.get("/:id/tables", getTablesByRestaurant);
router.get("/:restaurantId/download", downloadImage);
router.post("/:restaurantId/upload", uploadImage);
router.put("/:id/tables", updateTablesForRestaurant);

module.exports = router;
