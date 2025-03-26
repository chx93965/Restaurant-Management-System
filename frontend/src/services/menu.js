import axios from 'axios';

// TODO: define URL in config files
const BACKEND_URL = 'http://localhost:5000/api/menus';

export const getMenuByRestaurant = async (restaurantId) => {
    const response = await axios.get(`${BACKEND_URL}/${restaurantId}`);
    return response.data;
};

export const addDishToMenu = async (restaurantId, dishId) => {
    const response = await axios.post(`${BACKEND_URL}`, { restaurantId, dishId });
    return response.data;
};

export const createDish = async (dishData) => {
    const response = await axios.post(`${BACKEND_URL}/dish`, dishData);
    return response.data;
};

export const uploadImage = async (dishId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post(`${BACKEND_URL}/${dishId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
