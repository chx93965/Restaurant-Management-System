import axios from 'axios';

// TODO: define URL in config files
const apiUrl = 'http://localhost:5000/api/orders';

export const addOrder = async (restaurantId, orderType, tableId, dishes) => {
    const response = await axios.post(apiUrl, {
        restaurantId,
        orderType,
        tableId,
        dishes
    });
    return response.data;
};

export const addItemsToOrder = async (orderId, dishes) => {
    const response = await axios.post(`${apiUrl}/${orderId}/items`, { dishes });
    return response.data;
};

export const getOrders = async (restaurantId) => {
    const response = await axios.get(`${apiUrl}/${restaurantId}`);
    return response.data;
};

export const markOrderAsCompleted = async (orderId) => {
    const response = await axios.patch(`${apiUrl}/${orderId}/complete`);
    return response.data;
};
