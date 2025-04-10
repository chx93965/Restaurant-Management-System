import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import Navbar from '../components/navBar';

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
            <Navbar />

            <h1 className="text-3xl font-bold text-gray-800">Welcome to the Restaurant App</h1>
            <p className="text-gray-600 mt-2">Your one-stop solution to manage and explore restaurants!</p>

            {/* Show restaurant image if selectedRestaurant exists */}
            {selectedRestaurant && restaurantImage && (
                <div className="mt-6">
                    {/*<h2 className="text-lg font-semibold text-gray-800">Selected Restaurant Image:</h2>*/}
                    {/*TODO: replace with restaurant name*/}
                    <img src={restaurantImage} alt="Restaurant" className="w-48 h-48 object-cover rounded-md shadow-md mt-2" />
                </div>
            )}
        </div>
    );
}

export default Home;
