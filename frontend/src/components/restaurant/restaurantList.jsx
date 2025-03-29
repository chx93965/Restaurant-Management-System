import React, { useState, useEffect } from 'react';
import { getAllRestaurants } from '../../services/restaurant';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            const fetchedRestaurants = await getAllRestaurants();
            setRestaurants(fetchedRestaurants);
        };
        fetchRestaurants();
    }, []);

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
