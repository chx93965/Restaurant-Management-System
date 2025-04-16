import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import Navbar from '../components/navBar';
import { getAllRestaurants } from "../services/restaurant";

function Home() {
    const { user, setUser, selectedRestaurant, setSelectedRestaurant } = useAuth(); // Destructure user, setUser, and selectedRestaurant from the context
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [restaurantImage, setRestaurantImage] = useState(null); // State to store the restaurant's image

    // Fetch all restaurants for customers and servers
    useEffect(() => {
        if (user && (user.role === 'customer' || user.role === 'server')) {
            getAllRestaurants()
                .then(setAllRestaurants)
                .catch((err) => console.error(err));
        }
    }, [user]);

    // Fetch restaurant image when a restaurant is selected
    useEffect(() => {
        console.log("Selected restaurant:", localStorage); // Log the selected restaurant for debugging
        if (selectedRestaurant) {
            setRestaurantImage(`http://localhost:5000/api/restaurants/${selectedRestaurant.id}/download`); // Reset image state before fetching new one
        }
    }, [selectedRestaurant]); // Re-run when selectedRestaurant changes

    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
    };

    const handleLogout = () => {
        setUser(null); // Clear user from context
        setSelectedRestaurant(null);
        localStorage.clear();
    };
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Navbar />

            <h1 className="text-3xl font-bold text-gray-800">Welcome to the Restaurant App</h1>
            <p className="text-gray-600 mt-2">Your one-stop solution to manage and explore restaurants!</p>

            {/* For customers or servers, show restaurant selection bar */}
            {user && (user.role === 'customer' || user.role === 'server') && !selectedRestaurant && (
                <div className="flex flex-wrap gap-6 justify-center">
                    {allRestaurants.map((restaurant) => (
                        <button
                            key={restaurant.id}
                            onClick={() => handleRestaurantSelect(restaurant)}
                            className="bg-white shadow-md rounded-md px-4 py-3 w-48 flex flex-col items-center hover:bg-blue-100 transition"
                        >
                            <img
                                src={`http://localhost:5000/api/restaurants/${restaurant.id}/download`}
                                alt={restaurant.name}
                                className="w-32 h-32 object-cover rounded-md mb-2"
                            />
                            <span className="text-gray-800 font-semibold text-center">{restaurant.restaurantName}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Show restaurant image if selectedRestaurant exists */}
            {selectedRestaurant && restaurantImage && (
                <div className="mt-8 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">{selectedRestaurant.restaurantName}</h2>
                    <img src={restaurantImage} alt="Restaurant" className="w-48 h-48 object-cover rounded-md shadow-md mt-2" />
                </div>
            )}
        </div>
    );
}

export default Home;
