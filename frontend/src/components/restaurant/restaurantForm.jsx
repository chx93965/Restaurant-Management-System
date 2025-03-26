import React, { useState, useEffect } from 'react';
import { createRestaurant, updateRestaurant } from '../../services/restaurant';

const RestaurantForm = ({ restaurantId, existingData }) => {
    const [restaurantName, setRestaurantName] = useState(existingData?.restaurantName || '');
    const [address, setAddress] = useState(existingData?.address || '');
    const [postCode, setPostCode] = useState(existingData?.postCode || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (restaurantId) {
            await updateRestaurant(restaurantId, { restaurantName, address, postCode });
        } else {
            await createRestaurant({ restaurantName, address, postCode });
        }
    };

    return (
        <div>
            <h2>{restaurantId ? 'Update Restaurant' : 'Create Restaurant'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Restaurant Name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Postcode"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                />
                <button type="submit">{restaurantId ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default RestaurantForm;
