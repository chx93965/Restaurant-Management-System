import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

function Home() {
    const { user, setUser, selectedRestaurant } = useAuth(); // Destructure user, setUser, and selectedRestaurant from the context
    const [restaurantImage, setRestaurantImage] = useState(null); // State to store the restaurant's image

    // Fetch restaurant image when a restaurant is selected
    useEffect(() => {
        if (selectedRestaurant) {
            setRestaurantImage(`http://localhost:5000/api/restaurants/${selectedRestaurant.id}/download`); // Reset image state before fetching new one
        }
    }, [selectedRestaurant]); // Re-run when selectedRestaurant changes

    const handleLogout = () => {
        setUser(null); // Clear user from context
        localStorage.removeItem('user'); // Optionally, clear user from localStorage
    };
    console.log(selectedRestaurant)
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100">
            {/* Top-right Navigation */}
            <div className="absolute top-4 right-4 flex space-x-2">
                {user ? (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Hello, {user.username}</span>
                        <button 
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <Link to="/login" className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Login</Link>
                        <Link to="/signup" className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Sign Up</Link>
                    </div>
                )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800">Welcome to the Restaurant App</h1>
            <p className="text-gray-600 mt-2">Your one-stop solution to manage and explore restaurants!</p>

            {/* Show restaurant image if selectedRestaurant exists */}
            {selectedRestaurant && restaurantImage && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800">Selected Restaurant Image:</h2>
                    <img src={restaurantImage} alt="Restaurant" className="w-48 h-48 object-cover rounded-md shadow-md mt-2" />
                </div>
            )}

            <div className="mt-6 flex space-x-4">
                <Link to="/menu" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Menu</Link>
                <Link to="/order" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Order</Link>
                {user && user.role === "owner" && (
                    <Link to="/restaurant" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
                        Restaurant
                    </Link>
                )}
                <Link to="/user" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Profile</Link>
                
            </div>
        </div>
    );
}

export default Home;
