import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { handleImageUpload, deleteRestaurant } from '../../services/restaurant'; // Import the function

const RestaurantList = ({ restaurants, setRestaurants, loading, error }) => {
    const { user, selectedRestaurant, setSelectedRestaurant } = useAuth();
    const navigate = useNavigate();
    const [image, setImage] = useState(null); // State for the uploaded image
    const [uploading, setUploading] = useState(false); // State to track if the image is being uploaded

    useEffect(() => {
        console.log("User in RestaurantList:", user);
        if (!user || !user.username) {
            navigate('/login');
            return;
        }

        // const fetchRestaurants = async () => {
        //     try {
        //         const fetchedRestaurants = await getOwnedRestaurants(user.id);
        //         console.log("Fetched Restaurants:", fetchedRestaurants);
        //         setRestaurants(Array.isArray(fetchedRestaurants) ? fetchedRestaurants : [fetchedRestaurants]);
        //     } catch (err) {
        //         console.error("Error fetching restaurants:", err);
        //         setError('Error fetching owned restaurants');
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchRestaurants();
    }, [user, navigate]);

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
             handleImageUpload(image, selectedRestaurant.id, setUploading, setError); // Pass necessary parameters to the function
         }
     };


    const handleRemove = async (restId) => {
        try {
            await deleteRestaurant(restId);
            setRestaurants((prevRestaurants) => prevRestaurants.filter(r => r.id !== restId));

        } catch (error) {
            console.error("Error removing dish:", error);
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
                                selectedRestaurant?.id === restaurant.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'
                            }`}
                        >
                            {/* Restaurant Info */}
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">{restaurant.restaurantName}</h3>
                                <p className="text-gray-600">{restaurant.address}, {restaurant.postcode}</p>
                            </div>

                            {/* Image Preview */}
                            {restaurant.imageLocation && (
                                <img  src={`http://localhost:5000/api/restaurants/${restaurant.id}/download`}
                                alt={restaurant.id} className="w-40 h-40 object-cover rounded-md mt-2" />
                            )}

                            {/* Image Upload */}
                            <label className="block mb-4">
                                <span className="text-gray-700 font-medium">Upload Restaurant Image:</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mb-4 p-2 border border-gray-300 rounded-md"
                                />
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className={`px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
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

                            <button
                                onClick={() => handleRemove(restaurant.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg transition duration-200 hover:bg-red-700 mx-1 shadow-md"
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
