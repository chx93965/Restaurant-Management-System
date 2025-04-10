import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantForm from '../components/restaurant/restaurantForm';
import RestaurantList from '../components/restaurant/restaurantList';
import { useParams } from 'react-router-dom';
import { getOwnedRestaurants } from '../services/user';
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/navBar";

const RestaurantPage = () => {
    const { id } = useParams();
    const restaurantId = id ? parseInt(id, 10) : null;
    const { user } = useAuth();
    const navigate = useNavigate();

    // State to store restaurants
    const [restaurants, setRestaurants] = useState([]);

    // Fetch restaurants
    const fetchRestaurants = async () => {
        if (!user) return;
        try {
            const fetchedRestaurants = await getOwnedRestaurants(user.id);
            setRestaurants(fetchedRestaurants);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    useEffect(() => {
        // authorization
        if (user.role !== "owner") {
            alert("Unauthorized access");
            navigate("/");
        }

        fetchRestaurants();
    }, [user]); // Fetch when user changes

    return (
        <div className="pt-20 min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <Navbar />

                <h1 className="text-3xl font-bold mb-4">Restaurant Management</h1>

                {/* Form for Creating/Updating Restaurants */}
                <RestaurantForm
                    restaurantId={restaurantId}
                    onSuccess={fetchRestaurants} // Refresh list after creation
                />

                {/* Restaurant List */}
                <RestaurantList restaurants={restaurants} setRestaurants={setRestaurants} />
            </div>
        </div>
    );
};

export default RestaurantPage;
