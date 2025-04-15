import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOwnedRestaurants } from '../services/user';
import { handleImageUpload } from '../services/restaurant';
import { updateUserProfile } from '../services/user'; // <- Create this API
import Navbar from "../components/navBar";

function UserProfile() {
    const { user, setUser, selectedRestaurant, setSelectedRestaurant } = useAuth();
    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchRestaurants = async () => {
            try {
                const fetchedRestaurants = await getOwnedRestaurants(user.id);
                setRestaurants(fetchedRestaurants);
            } catch (err) {
                setError('Error fetching owned restaurants');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        role: user?.role || '',
        password: '' // new password,
    });

    const handleBackToHome = () => navigate('/');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const handleUpload = () => {
        if (selectedRestaurant) {
            handleImageUpload(image, selectedRestaurant.id, setUploading, setError);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(null);
        try {
            const updatedUser = await updateUserProfile(user.id, formData);
            setUser(updatedUser);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError('Error updating profile');
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="pt-20 min-h-screen bg-gray-100 py-10 px-6">
            <Navbar />
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">User Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Username</label>
                        <input
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Role</label>
                        <input
                            name="role"
                            type="text"
                            value={formData.role}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">New Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Update Profile
                    </button>
                </form>

                {message && <p className="text-green-600 mt-4">{message}</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}

                <div className="mt-6">
                    <button
                        onClick={handleBackToHome}
                        className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
