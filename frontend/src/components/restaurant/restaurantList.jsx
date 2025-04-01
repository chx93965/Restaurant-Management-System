import React, { useState, useEffect } from 'react';
import { getAllRestaurants } from '../../services/restaurant';
import { useAuth } from "../../context/AuthContext";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const { user } = useAuth();
    useEffect(() => {
        console.log("User in RestaurantList:", user);
        if (!user || !user.username) {
            console.log("User is not yet available, skipping restaurant fetch.");
            return;  // Exit early if user is not available
        }
        const fetchRestaurants = async () => {
            const fetchedRestaurants = await getAllRestaurants(user.username);
            setRestaurants(fetchedRestaurants);
        };
        fetchRestaurants();
    }, [user]);

    return (
        <div>
            <h2>Restaurants</h2>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id}>
                        <h3>{restaurant.restaurantName}</h3>
                        <p>{restaurant.address} - {restaurant.postCode}</p>
                        <button onClick={() => alert(`Edit ${restaurant.id}`)}>Edit</button>
                        <button onClick={() => alert(`Delete ${restaurant.id}`)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantList;
