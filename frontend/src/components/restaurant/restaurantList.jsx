import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { handleImageUpload, deleteRestaurant } from '../../services/restaurant';

const RestaurantList = ({ restaurants, setRestaurants, loading, error }) => {
    const { user, selectedRestaurant, setSelectedRestaurant } = useAuth();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [tableLayouts, setTableLayouts] = useState({}); // For storing table data per restaurant

    useEffect(() => {
        if (!user || !user.username) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchTables = async () => {
            if (!restaurants || restaurants.length === 0) return;

            const layouts = {};
            for (const restaurant of restaurants) {
                try {
                    const res = await fetch(`http://localhost:5000/api/restaurants/${restaurant.id}/tables`);
                    const data = await res.json();
                    layouts[restaurant.id] = data;
                } catch (err) {
                    console.error(`Failed to fetch tables for restaurant ${restaurant.id}`, err);
                    layouts[restaurant.id] = [];
                }
            }
            setTableLayouts(layouts);
        };

        fetchTables();
    }, [restaurants]);

    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleUpload = () => {
        if (selectedRestaurant) {
            handleImageUpload(image, selectedRestaurant.id, setUploading, (err) => {
                if (err) console.error("Image upload error:", err);
            });
        }
    };

    const handleRemove = async (restId) => {
        try {
            await deleteRestaurant(restId);
            setRestaurants((prevRestaurants) => prevRestaurants.filter(r => r.id !== restId));
        } catch (error) {
            console.error("Error removing restaurant:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Your Restaurants</h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : restaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            className={`p-5 border rounded-lg shadow-lg transition-all duration-300 ${
                                selectedRestaurant?.id === restaurant.id
                                    ? 'border-blue-500 bg-blue-100'
                                    : 'border-gray-300 bg-white'
                            }`}
                        >
                            {/* Restaurant Info */}
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">{restaurant.restaurantName}</h3>
                                <p className="text-gray-600">{restaurant.address}, {restaurant.postcode}</p>
                            </div>

                            {/* Restaurant Image */}
                            {restaurant.imageLocation && (
                                <img
                                    src={`http://localhost:5000/api/restaurants/${restaurant.id}/download`}
                                    alt={`Restaurant ${restaurant.id}`}
                                    className="w-40 h-40 object-cover rounded-md mt-2"
                                />
                            )}

                            {/* Table Info */}
                            {tableLayouts[restaurant.id]?.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium text-gray-700 mb-1">Tables:</p>
                                    <ul className="text-sm text-gray-600 list-disc list-inside">
                                        {tableLayouts[restaurant.id].map((table, idx) => (
                                            <li key={table.id}>Table {idx + 1}: {table.size} seats</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Image Upload */}
                            <label className="block mb-4 mt-4">
                                <span className="text-gray-700 font-medium">Upload Restaurant Image:</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mb-2 p-2 border border-gray-300 rounded-md block"
                                />
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className={`px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ${
                                        uploading ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                </button>
                            </label>

                            {/* Select Button */}
                            <button
                                onClick={() => handleRestaurantSelect(restaurant)}
                                className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
                                    selectedRestaurant?.id === restaurant.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {selectedRestaurant?.id === restaurant.id ? 'Selected' : 'Select'}
                            </button>

                            {/* Remove Button */}
                            <button
                                onClick={() => handleRemove(restaurant.id)}
                                className="mt-2 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">You don't own any restaurants yet.</p>
            )}
        </div>
    );
};

export default RestaurantList;
