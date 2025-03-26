import React from 'react';
import RestaurantForm from '../components/RestaurantForm';
import RestaurantList from '../components/RestaurantList';
import { useParams } from 'react-router-dom';

const RestaurantPage = () => {
    const { id } = useParams();
    const restaurantId = id ? parseInt(id, 10) : null;

    return (
        <div>
            <h1>Restaurant Management</h1>
            {restaurantId ? (
                <RestaurantForm restaurantId={restaurantId} />
            ) : (
                <RestaurantForm />
            )}
            <RestaurantList />
        </div>
    );
};

export default RestaurantPage;
