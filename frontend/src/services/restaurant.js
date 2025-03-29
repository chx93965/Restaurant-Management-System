import axios from 'axios';

// TODO: define URL in config files
const apiUrl = 'http://localhost:5000/api/restaurants';

// Create a new restaurant
export const createRestaurant = async ({ restaurantName, address, postCode }) => {
    const response = await axios.post(apiUrl, { restaurantName, address, postCode });
    return response.data;
};

// Update restaurant details
export const updateRestaurant = async (restaurantId, { restaurantName, address, postCode }) => {
    const response = await axios.put(`${apiUrl}/${restaurantId}`, { restaurantName, address, postCode });
    return response.data;
};

// Get all restaurants
export const getAllRestaurants = async () => {
    const response = await axios.get(apiUrl);
    return response.data;
};

// Add a single table to a restaurant
export const addTable = async (restaurantId, size) => {
    const response = await axios.post(`${apiUrl}/${restaurantId}/tables/${size}`);
    return response.data;
};

// Create multiple tables for a restaurant
export const createTablesForRestaurant = async (restaurantId, tableSizes) => {
    const response = await axios.post(`${apiUrl}/${restaurantId}/tables`, { tables: tableSizes });
    return response.data;
};
