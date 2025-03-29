import axios from 'axios';

// TODO: define URL in config files
const BACKEND_URL = 'http://localhost:5000/users';

// Register a new user
export const registerUser = async ({ username, email, password, role }) => {
    const response = await axios.post(BACKEND_URL, { username, email, password, role });
    return response.data;
};

// Login a user
export const loginUser = async ({ username, password }) => {
    const response = await axios.post(`${BACKEND_URL}/login`, { username, password });
    // Store token (you can use localStorage or any other method)
    localStorage.setItem('token', response.data.token);
    return response.data;
};

// Get all users (Only for admin/owner)
export const getAllUsers = async () => {
    const response = await axios.get(BACKEND_URL);
    return response.data;
};

// Get owned restaurants for a user
export const getOwnedRestaurants = async (userId) => {
    const response = await axios.get(`${BACKEND_URL}/${userId}`);
    return response.data.message;
};

