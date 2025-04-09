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

export const completeOrder = async (orderId) => {
    const response = await axios.patch(`${apiUrl}/${orderId}/complete`);
    return response.data;
};

export const allCompletedOrder = async (resaurantId, year) => {
    const response = await axios.get(`${apiUrl}/${resaurantId}/completed/${year}`);
    return response.data;
};


export const getOrders = async (restaurantId, status) => {
    const response = await axios.get(`${apiUrl}/${restaurantId}/${status}`);
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await axios.get(`${apiUrl}/order/${orderId}`);
    return response.data;
};

export const markOrderAsCompleted = async (orderId) => {
    const response = await axios.patch(`${apiUrl}/${orderId}/complete`);
    return response.data;
};

export const removeItemFromOrder = async (orderId, itemId) => {
    const response = await axios.delete(`${apiUrl}/${orderId}/item/${itemId}`);
    return response.data;
};

export const deleteOrder = async (orderId) => {
    const response = await axios.delete(`${apiUrl}/${orderId}`);
    return response.data;
};