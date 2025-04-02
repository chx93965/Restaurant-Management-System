import React, { useState, useEffect } from 'react';
import { createRestaurant, updateRestaurant } from '../../services/restaurant';
import { useAuth } from "../../context/AuthContext";

const RestaurantForm = ({ restaurantId, existingData, onSuccess }) => {
    const [restaurantName, setRestaurantName] = useState(existingData?.restaurantName || '');
    const [address, setAddress] = useState(existingData?.address || '');
    const [postCode, setPostCode] = useState(existingData?.postCode || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (existingData) {
            setRestaurantName(existingData.restaurantName);
            setAddress(existingData.address);
            setPostCode(existingData.postCode);
        }
    }, [existingData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (restaurantId) {
                await updateRestaurant(restaurantId, { restaurantName, address, postCode });
            } else {
                await createRestaurant({ restaurantName, address, postCode, ownerId: user.id });
                setRestaurantName('');
                setAddress('');
                setPostCode('');
            }
            setSuccess(true);
            if (onSuccess) onSuccess(); // Callback to refresh restaurant list
        } catch (err) {
            setError('Failed to submit restaurant details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
                {restaurantId ? 'Update Restaurant' : 'Create a New Restaurant'}
            </h2>
            
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-3">Restaurant saved successfully!</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Restaurant Name */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Restaurant Name</label>
                    <input
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter restaurant name"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter address"
                    />
                </div>

                {/* Postcode */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Postcode</label>
                    <input
                        type="text"
                        value={postCode}
                        onChange={(e) => setPostCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter postcode"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full py-2 rounded-lg font-semibold text-white transition duration-200 ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : restaurantId ? 'Update Restaurant' : 'Create Restaurant'}
                </button>
            </form>
        </div>
    );
};

export default RestaurantForm;
