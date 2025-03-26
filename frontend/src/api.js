const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all restaurants
export const getRestaurants = async () => {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (!response.ok) throw new Error('Failed to fetch restaurants');
    return response.json();
};

// Fetch menu for a restaurant
export const getMenu = async (restaurantId) => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu');
    return response.json();
};

// Create an order
export const createOrder = async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
};

// Upload dish image
export const uploadDishImage = async (dishId, imageFile) => {
    const formData = new FormData();
    formData.append('dishImage', imageFile);

    const response = await fetch(`${API_BASE_URL}/dishes/${dishId}/upload`, {
        method: 'POST',
        body: formData, // No need to set Content-Type; the browser will handle it
    });

    if (!response.ok) throw new Error('Failed to upload dish image');
    return response.json();
};
