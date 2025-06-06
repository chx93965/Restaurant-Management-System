import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import Navbar from '../components/navBar';
import { getAllRestaurants } from "../services/restaurant";
import { getMenuByRestaurant } from '../services/menu';

function Home() {
    const { user, selectedRestaurant, setSelectedRestaurant } = useAuth(); // Destructure user, setUser, and selectedRestaurant from the context
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [restaurantImage, setRestaurantImage] = useState(null); // State to store the restaurant's image
    const [allDishes, setAllDishes] = useState([]);
    const [dailySpecial, setDailySpecial] = useState(null);
    const [dailySpecialImage, setDailySpecialImage] = useState(null);

    // Fetch all restaurants for customers and servers
    useEffect(() => {
        if (user && (user.role === 'customer' || user.role === 'server')) {
            getAllRestaurants()
                .then(setAllRestaurants)
                .catch((err) => console.error(err));
        }
    }, [user]);

    // Fetch menu for the selected restaurant
    useEffect(() => {
        if (!selectedRestaurant) return;
        getMenuByRestaurant(selectedRestaurant.id)
            .then(setAllDishes)
            .catch((err) => console.error(err));
    }, [selectedRestaurant]);

    // Fetch restaurant image when a restaurant is selected
    useEffect(() => {
        if (!selectedRestaurant) return;
        setRestaurantImage(`http://localhost:5000/api/restaurants/${selectedRestaurant.id}/download`); // Reset image state before fetching new one
    }, [selectedRestaurant]); // Re-run when selectedRestaurant changes

    // Display daily specials
    useEffect(() => {
        if (!setSelectedRestaurant) return;

        const dailySpecialId = localStorage.getItem('dailySpecial');
        if (!dailySpecialId) return;

        if (!allDishes) return;
        const specialDish = allDishes.find(dish => String(dish.id) === String(dailySpecialId));
        if (!specialDish) return;
        setDailySpecial(specialDish);
        setDailySpecialImage(`http://localhost:5000/api/menus/${specialDish.id}/download`);

    }, [selectedRestaurant, allDishes, dailySpecial, dailySpecialImage]);

    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Navbar/>

            <h1 className="text-3xl font-bold text-gray-800">Welcome to the Restaurant App</h1>
            <p className="text-gray-600 mt-2">Your one-stop solution to manage and explore restaurants!</p>

            {/* For customers or servers, show restaurant selection bar */}
            {user && (user.role === 'customer' || user.role === 'server') && !selectedRestaurant && (
                <div className="flex flex-wrap gap-6 justify-center mt-16">
                    {allRestaurants.map((restaurant) => (
                        <button
                            key={restaurant.id}
                            onClick={() => handleRestaurantSelect(restaurant)}
                            className="bg-white shadow-md rounded-md px-4 py-3 w-48 flex flex-col items-center hover:bg-gray-100 transition"
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

            {/* Show restaurant image */}
            {selectedRestaurant && restaurantImage && (
                <div className="absolute top-16 left-4 text-left bg-gray-100 p-2 rounded z-10">
                    <img
                        src={restaurantImage}
                        alt="Restaurant"
                        className="w-24 h-24 object-cover rounded-md shadow-md"/>
                    <h2 className="text-lg font-semibold text-gray-800 text-center mt-3">{selectedRestaurant.restaurantName}</h2>
                </div>
            )}

            {/* Show daily special */}
            {selectedRestaurant && dailySpecial && dailySpecialImage && (
                <div className="container isolate text-center mt-32">
                    <div className="mx-auto flex w-full max-w-125 items-center">
                        <img
                            alt="Daily Special" fetchPriority="high"
                            width="900" height="600"
                            src={dailySpecialImage}
                        />
                        <h2 className="text-4xl font-bold ml-32 text-left text-yellow-600">
                            {dailySpecial?.dishName.toUpperCase()}
                            <br></br><br></br>
                            Only ${dailySpecial?.price}</h2>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-2.5 md:items-center w-full justify-start">
                        <a target="_self" data-sb_label="web Info=View Menu"
                           className="inline-flex text-center font-extrabold border border-orange-200 bg-yellow-300 text-black py-3.5 px-10 text-lg"
                           href="/order">View Menu</a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
