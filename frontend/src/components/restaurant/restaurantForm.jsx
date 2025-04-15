import React, { useState, useEffect } from 'react';
import { addTable, createRestaurant, updateRestaurant } from '../../services/restaurant';
import { useAuth } from "../../context/AuthContext";

const RestaurantForm = ({ restaurantId, existingData, onSuccess }) => {
    const [restaurantName, setRestaurantName] = useState(existingData?.restaurantName || '');
    const [address, setAddress] = useState(existingData?.address || '');
    const [postcode, setPostCode] = useState(existingData?.postcode || '');
    const [seatsPerTable, setSeatsPerTable] = useState(existingData?.tables || []); // array like [2, 4, 2]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (existingData) {
            setRestaurantName(existingData.restaurantName);
            setAddress(existingData.address);
            setPostCode(existingData.postCode);
            setSeatsPerTable(existingData.tables || []);
        }
        console.log("Existing Data:", existingData);
    }, [existingData]);

    const handleTableCountChange = (e) => {
        let tableCount = parseInt(e.target.value, 10);
        if (isNaN(tableCount)) return;
    
        if (tableCount > 10) tableCount = 10; // <-- Enforce max in logic
    
        const updatedTables = [...seatsPerTable];
        if (tableCount > updatedTables.length) {
            for (let i = updatedTables.length; i < tableCount; i++) {
                updatedTables.push(2);
            }
        } else {
            updatedTables.length = tableCount;
        }
        setSeatsPerTable(updatedTables);
    };
    

    const handleSeatChange = (index, value) => {
        const updatedSeats = [...seatsPerTable];
        updatedSeats[index] = parseInt(value, 10) || 0;
        setSeatsPerTable(updatedSeats);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                restaurantName,
                address,
                postcode,
                tables: seatsPerTable,
            };
            console.log("Payload:", payload);
            if (restaurantId) {
                await updateRestaurant(restaurantId, payload);
            } else {
                const response = await createRestaurant({ ...payload, ownerId: user.id });
                console.log("Created Restaurant:", response);
                await addTable(response.restaurantId, seatsPerTable);
                setRestaurantName('');
                setAddress('');
                setPostCode('');
                setSeatsPerTable([]);
            }

            setSuccess(true);
            if (onSuccess) onSuccess();
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
                {/* Basic Info */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Restaurant Name</label>
                    <input
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Postcode</label>
                    <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Tables */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Number of Tables</label>
                    <input
                        type="number"
                        min="0"
                        value={seatsPerTable.length}
                        onChange={handleTableCountChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        max="10"  // <-- Limit input UI
                    />
                </div>

                {seatsPerTable.map((seats, index) => (
                    <div key={index}>
                        <label className="block text-gray-600 text-sm mb-1">Seats for Table {index + 1}</label>
                        <input
                            type="number"
                            min="1"
                            value={seats}
                            onChange={(e) => handleSeatChange(index, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                ))}

                {/* Submit */}
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
