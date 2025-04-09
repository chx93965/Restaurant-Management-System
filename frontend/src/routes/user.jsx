import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming the AuthContext is set up
import { useNavigate } from 'react-router-dom'; // For redirection
import { getOwnedRestaurants } from '../services/user'; // Assuming getOwnedRestaurants is already defined
import { handleImageUpload } from '../services/restaurant'; // Import the function

function UserProfile() {
    const { user, selectedRestaurant, setSelectedRestaurant } = useAuth(); // Get user and setSelectedRestaurant from context
    const navigate = useNavigate(); // Hook to navigate to different pages
    const [restaurants, setRestaurants] = useState([]); // State to store owned restaurants
    const [loading, setLoading] = useState(true); // Loading state for async data
    const [error, setError] = useState(null); // State for handling errors
    const [image, setImage] = useState(null); // State for the uploaded image
    const [uploading, setUploading] = useState(false); // State to track if the image is being uploaded

    // Fetch owned restaurants based on the username from context
    useEffect(() => {
        if (!user) {
            // Redirect to login if no user is found in context
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

    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
    };

    const handleBackToHome = () => {
        navigate('/');
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">User Profile</h1>

            <div className="mb-4">
                <h2 className="text-xl font-semibold">Username: {user.username}</h2>
                <p className="text-gray-600">Role: {user.role}</p>
                <p className="text-gray-600">Email: {user.email}</p>
            </div>

            {user.role === "owner" && (<div>
                <h3 className="text-lg font-semibold mb-2">Restaurants Owned:</h3>
                {restaurants.length > 0 ? (
                    <ul className="list-disc pl-6">
                        {restaurants.map((restaurant, index) => (
                            <li
                                key={index}
                                className={`text-gray-700 flex justify-between items-center py-2 ${selectedRestaurant?.id === restaurant.id ? 'font-bold' : ''}`}
                            >
                                <div>
                                    <div><strong>{restaurant.restaurantName}</strong></div>
                                    <div>{restaurant.address}</div>
                                    <div>{restaurant.postcode}</div>
                                </div>
                                <button
                                    onClick={() => handleRestaurantSelect(restaurant)} // Select restaurant on button click
                                    className={`ml-4 px-4 py-2 rounded-full text-sm font-semibold 
                                        ${selectedRestaurant?.id === restaurant.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} 
                                        transition duration-200`}
                                >
                                    {selectedRestaurant?.id === restaurant.id ? 'Selected' : 'Select'}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">You don't own any restaurants yet.</p>
                )}
            </div>
            )}

            {/* Display selected restaurant details */}
            {user.role === "owner" && selectedRestaurant && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Selected Restaurant:</h3>
                    <div className="text-gray-700">
                        <div><strong>{selectedRestaurant.restaurantName}</strong></div>
                        <div>{selectedRestaurant.address}</div>
                        <div>{selectedRestaurant.postcode}</div>
                    </div>
                </div>
            )}

            {/* Image Upload */}
            {user.role === "owner" && selectedRestaurant && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Upload Restaurant Image:</h3>
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
                </div>
            )}

            {/* Back to Home Button */}
            <div className="mt-6">
                <button
                    onClick={handleBackToHome} // Navigate to the home page
                    className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default UserProfile;
