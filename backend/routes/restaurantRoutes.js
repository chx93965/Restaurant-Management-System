const express = require('express');
const {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    addTable,
    deleteTable,
    createTablesForRestaurant,
    getTablesByRestaurant
} = require('../controllers/restaurantController');

const router = express.Router();

router.post('/', createRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);
router.post("/:id/tables/:size", addTable);
router.delete("/tables/:tableId", deleteTable);
router.post("/:id/tables", createTablesForRestaurant);
router.get("/:id/tables", getTablesByRestaurant);

module.exports = router;
