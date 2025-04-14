import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { handleImageUpload, deleteRestaurant, updateRestaurant, updateTablesForRestaurant } from '../../services/restaurant';
import { allCompletedOrder } from '../../services/order';

const RestaurantList = ({ restaurants, setRestaurants, loading, error }) => {
    const { user, selectedRestaurant, setSelectedRestaurant } = useAuth();
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [tableLayouts, setTableLayouts] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [balanceSheet, setBalanceSheet] = useState(null);
    const [loadingBalance, setLoadingBalance] = useState(false);

    const [editingRestaurantId, setEditingRestaurantId] = useState(null);
    const [editedRestaurant, setEditedRestaurant] = useState({});
    const [editingTables, setEditingTables] = useState({});
    const [editedTables, setEditedTables] = useState({});

    useEffect(() => {
        if (!user || !user.username) navigate('/login');
    }, [user, navigate]);

    useEffect(() => {
        const fetchTables = async () => {
            if (!restaurants || restaurants.length === 0) return;

            const layouts = {};
            for (const restaurant of restaurants) {
                try {
                    const res = await fetch(`http://localhost:5000/api/restaurants/${restaurant.id}/tables`);
                    const data = await res.json();
                    layouts[restaurant.id] = data;
                } catch (err) {
                    console.error(`Failed to fetch tables for restaurant ${restaurant.id}`, err);
                    layouts[restaurant.id] = [];
                }
            }
            setTableLayouts(layouts);
        };

        fetchTables();
    }, [restaurants]);

    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const handleUpload = () => {
        if (selectedRestaurant) {
            handleImageUpload(image, selectedRestaurant.id, setUploading, (err) => {
                if (err) console.error("Image upload error:", err);
            });
        }
    };

    const handleRemove = async (restId) => {
        try {
            console.log("Removing restaurant:", restId);
            await deleteRestaurant(restId);
            setRestaurants(prev => prev.filter(r => r.id !== restId));
        } catch (error) {
            console.error("Error removing restaurant:", error);
        }
    };

    const handleEditClick = (restaurant) => {
        setEditingRestaurantId(restaurant.id);
        setEditedRestaurant({ ...restaurant });
    };
    const handleRestaurantSave = async () => {
        try {
            console.log("Saving restaurant:", editedRestaurant);
            
            // Update the restaurant
            const updated = await updateRestaurant(editedRestaurant.id, editedRestaurant);
    
            // Check if the image URL is returned and update the restaurant state accordingly
            const updatedRestaurant = {
                ...updated,  // Assuming updated data contains the imageLocation
                imageLocation: updated.imageLocation 
            };
    
            console.log("Updated restaurant:", updatedRestaurant);
    
            // Update the restaurant list with the new data
            setRestaurants(prev =>
                prev.map(r => r.id === editedRestaurant.id ? updatedRestaurant : r)
            );
            console.log("Restaurant list updated:", restaurants);
            setEditingRestaurantId(null);
            setEditedRestaurant({});
        } catch (err) {
            console.error("Error updating restaurant:", err);
        }
    };

    const handleSaveTables = async (restaurantId) => {
        try {
            const tables = editedTables[restaurantId];
            const sizes = tables.map(table => table.size);
            console.log("Saving tables for restaurant:", restaurantId, sizes);
            await updateTablesForRestaurant(restaurantId, sizes);
            setTableLayouts(prev => ({ ...prev, [restaurantId]: tables }));
            setEditingTables(prev => ({ ...prev, [restaurantId]: false }));
        } catch (err) {
            console.error("Error saving tables:", err);
        }
    };

    const generateBalanceSheetForRestaurant = async (restaurant) => {
        setLoadingBalance(true);
        setBalanceSheet(null);

        const csvRows = [];
        csvRows.push([
            'Restaurant Name', 'Order ID', 'Order Type', 'Status', 'Date',
            'Dish Name', 'Dish Price', 'Order Total'
        ].join(','));

        try {
            const data = await allCompletedOrder(restaurant.id, selectedYear);
            for (const order of data) {
                const orderTotal = order.items.reduce((sum, item) => sum + item.price, 0);
                for (const item of order.items) {
                    csvRows.push([
                        `"${restaurant.restaurantName}"`,
                        order.orderId,
                        order.orderType,
                        order.status,
                        order.createdAt,
                        `"${item.dishName.trim()}"`,
                        item.price.toFixed(2),
                        orderTotal.toFixed(2)
                    ].join(','));
                }
            }

            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `balance_sheet_${restaurant.restaurantName}_${selectedYear}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error(`Failed to fetch orders for restaurant ${restaurant.id}`, err);
        }
        setLoadingBalance(false);
    };
    console.log("Rendering restaurant list:", restaurants);
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Your Restaurants</h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : restaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {restaurants.map((restaurant) => {
                        const isEditing = editingRestaurantId === restaurant.id;

                        return (
                            <div
                                key={restaurant.id}
                                className={`p-5 border rounded-lg shadow-lg transition-all duration-300 ${
                                    selectedRestaurant?.id === restaurant.id
                                        ? 'border-blue-500 bg-blue-100'
                                        : 'border-gray-300 bg-white'
                                }`}
                            >
                                {/* Name and Address */}
                                <div className="mb-4 space-y-1">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedRestaurant.restaurantName || ''}
                                                onChange={(e) =>
                                                    setEditedRestaurant(prev => ({
                                                        ...prev,
                                                        restaurantName: e.target.value
                                                    }))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                            <input
                                                type="text"
                                                value={editedRestaurant.address || ''}
                                                onChange={(e) =>
                                                    setEditedRestaurant(prev => ({
                                                        ...prev,
                                                        address: e.target.value
                                                    }))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                            <input
                                                type="text"
                                                value={editedRestaurant.postcode || ''}
                                                onChange={(e) =>
                                                    setEditedRestaurant(prev => ({
                                                        ...prev,
                                                        postcode: e.target.value
                                                    }))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                            <button
                                                onClick={handleRestaurantSave}
                                                className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                                            >
                                                Save
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-semibold">{restaurant.restaurantName}</h3>
                                            <p className="text-gray-600">{restaurant.address}, {restaurant.postcode}</p>
                                            <button
                                                onClick={() => handleEditClick(restaurant)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Restaurant Image */}
                                {restaurant.imageLocation && (
                                    <img
                                        src={`http://localhost:5000/api/restaurants/${restaurant.id}/download`}
                                        alt={`Restaurant ${restaurant.id}`}
                                        className="w-40 h-40 object-cover rounded-md mt-2"
                                    />
                                )}

                                {/* Tables */}
                                <div className="mt-2">
                                    <p className="font-medium text-gray-700 mb-1">Tables:</p>
                                    {editingTables[restaurant.id] ? (
                                        <>
                                            {editedTables[restaurant.id]?.map((table, idx) => (
                                                <div key={table.id} className="flex items-center gap-2 mb-1">
                                                    <span>Table {idx + 1}:</span>
                                                    <input
                                                        type="number"
                                                        value={table.size}
                                                        onChange={(e) => {
                                                            const updated = [...editedTables[restaurant.id]];
                                                            updated[idx].size = parseInt(e.target.value);
                                                            setEditedTables(prev => ({
                                                                ...prev,
                                                                [restaurant.id]: updated
                                                            }));
                                                        }}
                                                        className="w-20 px-2 py-1 border rounded"
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => handleSaveTables(restaurant.id)}
                                                className="text-sm text-green-600 hover:underline"
                                            >
                                                Save Tables
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                                {tableLayouts[restaurant.id]?.map((table, idx) => (
                                                    <li key={table.id}>Table {idx + 1}: {table.size} seats</li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={() => {
                                                    setEditingTables(prev => ({ ...prev, [restaurant.id]: true }));
                                                    setEditedTables(prev => ({
                                                        ...prev,
                                                        [restaurant.id]: [...tableLayouts[restaurant.id]]
                                                    }));
                                                }}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Edit Tables
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <label className="block mb-4 mt-4">
                                    <span className="text-gray-700 font-medium">Upload Restaurant Image:</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mb-2 p-2 border border-gray-300 rounded-md block"
                                    />
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className={`px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ${
                                            uploading ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </button>
                                </label>

                                {/* Restaurant Selector */}
                                <button
                                    onClick={() => handleRestaurantSelect(restaurant)}
                                    className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
                                        selectedRestaurant?.id === restaurant.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {selectedRestaurant?.id === restaurant.id ? 'Selected' : 'Select'}
                                </button>

                                {/* Balance Sheet Generator */}
                                <div className="my-4 flex items-center gap-4 justify-center">
                                    <label className="text-gray-700 font-medium">Year:</label>
                                    <input
                                        type="number"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        className="border border-gray-300 rounded px-3 py-1 w-28"
                                        min="2000"
                                        max={new Date().getFullYear()}
                                    />
                                    <button
                                        onClick={() => generateBalanceSheetForRestaurant(restaurant)}
                                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Download Balance Sheet
                                    </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemove(restaurant.id)}
                                    className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-600">You don't own any restaurants yet.</p>
            )}
        </div>
    );
};

export default RestaurantList;
