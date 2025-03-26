import axios, {AxiosError} from 'axios';

const BACKEND_URL = process.env.API_URL || 'http://localhost:5000';

// Register a new user
export const registerUser = async (userData: { username: string, email: string, password: string, role: string }) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/`, userData);
        return response.data;
    } catch (error) {
        console.log((error as AxiosError).message)
    }
};

// Login a user
export const loginUser = async (credentials: { username: string, password: string }) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/login`, credentials);
        return response.data; // Store JWT token here
    } catch (error) {
        console.log((error as AxiosError).message);
    }
};

// Get owned restaurants (requires JWT token)
export const getOwnedRestaurants = async (userId: string, token: string) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/restaurants/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.message;
    } catch (error) {
        console.log(((error as AxiosError).message))
    }
};

// Fetch all user info
export const getUserInfo = async (token: string) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.log((error as AxiosError).message);
    }
};
