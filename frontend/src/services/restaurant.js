import axios from 'axios';

// TODO: define URL in config files
const apiUrl = 'http://localhost:5000/api/restaurants';

// Create a new restaurant
export const createRestaurant = async ({ restaurantName, address, postCode, ownerId }) => {
    const response = await axios.post(apiUrl, { restaurantName, address, postCode, ownerId });
    return response.data;
};

// Update restaurant details
export const updateRestaurant = async (restaurantId, { restaurantName, address, postCode }) => {
    const response = await axios.put(`${apiUrl}/${restaurantId}`, { restaurantName, address, postCode });
    return response.data;
};

// Get all restaurants
export const getAllRestaurants = async (username) => {
    const response = await axios.get(`${apiUrl}/${username}`);
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

export const deleteRestaurant = async (restaurantId) => {
    const response = await axios.delete(`${apiUrl}/${restaurantId}`);
    return response.data;
};


export const handleImageUpload = async (image, restaurantId, setUploading, setError) => {
    if (!image) {
        setError('Please select an image to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('restaurantId', restaurantId); // Attach the restaurant ID to the request

    try {
        setUploading(true);
        await axios.post(`${apiUrl}/${restaurantId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setUploading(false);
        alert('Image uploaded successfully!');
    } catch (err) {
        setUploading(false);
        setError('Error uploading image.');
    }
};
