import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMenuByRestaurant,
    addDishToMenu,
    createDish,
    imageUpload,
    deleteDish,
    updateDish // You should have this API function in your services/menu.js
} from "../services/menu";
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/navBar";

const Menu = () => {
    const { user, setUser, selectedRestaurant } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const [dishes, setDishes] = useState([]);
    const [newDish, setNewDish] = useState({
        dishName: "",
        dishDescription: "",
        dishPrice: "",
    });
    const [file, setFile] = useState(null);
    const [editDishId, setEditDishId] = useState(null);
    const [editDishData, setEditDishData] = useState({
        dishName: '',
        dishDescription: '',
        dishPrice: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user.role !== "owner") {
            alert("Unauthorized access");
            navigate("/");
        }

        if (selectedRestaurant) {
            const fetchMenu = async () => {
                try {
                    const data = await getMenuByRestaurant(selectedRestaurant.id);
                    setDishes(data);
                } catch (error) {
                    console.error("Error fetching menu:", error);
                }
            };
            fetchMenu();
        }
    }, [selectedRestaurant]);

    const handleCreateDish = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const dishCreated = await createDish(newDish);
            dishCreated.price = dishCreated.dishPrice;
            await addDishToMenu(selectedRestaurant.id, dishCreated.id);
            setDishes((prevDishes) => [...prevDishes, dishCreated]);
            setNewDish({ dishName: "", dishDescription: "", dishPrice: "" });
            setMessage('Dish created successfully!');
        } catch (error) {
            console.error("Error creating dish:", error);
            setMessage('Error creating dish: ' + error.message);
        }
    };

    const handleImageUpload = async (dishId) => {
        if (file) {
            try {
                await imageUpload(dishId, file, setUploading, setError);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    const handleRemoveDish = async (dishId) => {
        try {
            await deleteDish(selectedRestaurant.id, dishId);
            setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId));
        } catch (error) {
            console.error("Error removing dish:", error);
        }
    };

    const handleUpdateDish = async (dishId) => {
        try {
            const updated = {
                dishName: editDishData.dishName,
                dishDescription: editDishData.dishDescription,
                dishPrice: parseFloat(editDishData.dishPrice)
            };

            await updateDish(dishId, updated); // Call your update API
            setDishes((prev) =>
                prev.map((dish) =>
                    dish.id === dishId ? { ...dish, ...updated, price: updated.dishPrice } : dish
                )
            );
            setEditDishId(null);
            setMessage("Dish updated successfully.");
        } catch (error) {
            console.error("Error updating dish:", error);
            setMessage("Failed to update dish.");
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-100 py-10 px-6">
            <Navbar />

            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-3xl font-bold mb-4">Restaurant Menu</h2>

                {/* Dish Creation Form */}
                <form onSubmit={handleCreateDish} className="bg-gray-50 p-4 rounded-md shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Dish Name"
                            value={newDish.dishName}
                            onChange={(e) => setNewDish({ ...newDish, dishName: e.target.value })}
                            className="border p-2 rounded-md w-full"
                        />
                        <input
                            type="text"
                            placeholder="Dish Description"
                            value={newDish.dishDescription}
                            onChange={(e) => setNewDish({ ...newDish, dishDescription: e.target.value })}
                            className="border p-2 rounded-md w-full"
                        />
                        <input
                            type="number"
                            step="any"
                            placeholder="Dish Price"
                            value={newDish.dishPrice}
                            onChange={(e) => setNewDish({ ...newDish, dishPrice: e.target.value })}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Add Dish
                    </button>
                </form>

                {/* Dishes List */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dishes.map((dish) => (
                        <div key={dish.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                            {editDishId === dish.id ? (
                                <div className="w-full space-y-1">
                                    <input
                                        type="text"
                                        value={editDishData.dishName}
                                        onChange={(e) => setEditDishData({ ...editDishData, dishName: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                    <input
                                        type="text"
                                        value={editDishData.dishDescription}
                                        onChange={(e) => setEditDishData({ ...editDishData, dishDescription: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                    <input
                                        type="number"
                                        value={editDishData.dishPrice}
                                        onChange={(e) => setEditDishData({ ...editDishData, dishPrice: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-lg font-semibold">{dish.dishName}</h3>
                                    <p className="text-gray-600">{dish.dishDescription}</p>
                                    <p className="text-green-600 font-bold">${dish.price}</p>
                                </>
                            )}

                            {/* Display Image */}
                            {dish.imageLocation && (
                                <img
                                    src={`http://localhost:5000/api/menus/${dish.id}/download?t=${Date.now()}`}
                                    alt={dish.id}
                                    className="w-40 h-40 object-cover rounded-md mt-2"
                                />
                            )}

                            {/* File Upload */}
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept="image/*"
                                className="mt-2 text-sm"
                            />

                            {/* Buttons */}
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => handleImageUpload(dish.id)}
                                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Upload Image
                                </button>

                                <button
                                    onClick={() => handleRemoveDish(dish.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Remove
                                </button>

                                {editDishId === dish.id ? (
                                    <button
                                        onClick={() => handleUpdateDish(dish.id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditDishId(dish.id);
                                            setEditDishData({
                                                dishName: dish.dishName,
                                                dishDescription: dish.dishDescription,
                                                dishPrice: dish.price
                                            });
                                        }}
                                        className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;
