import React, { useEffect, useState } from "react";
import { getMenuByRestaurant, addDishToMenu, createDish, imageUpload, deleteDish } from "../services/menu";
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook


const Menu = () => {
    const { user, setUser, selectedRestaurant } = useAuth();
    const [uploading, setUploading] = useState(false); // State to track if the image is being uploaded
    const [error, setError] = useState(null); // State for handling errors

    const [dishes, setDishes] = useState([]);
    const [newDish, setNewDish] = useState({
        dishName: "",
        dishDescription: "",
        dishPrice: "",
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
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

    // Handle Dish Creation
    const handleCreateDish = async (e) => {
        e.preventDefault();
        try {
            const dishCreated = await createDish(newDish); // Create dish
            dishCreated.price = dishCreated.dishPrice; // Set price to the created dish's price
            console.log("Dish created:", dishCreated);
            await addDishToMenu(selectedRestaurant.id, dishCreated.id); // Add dish to menu
            setDishes((prevDishes) => [...prevDishes, dishCreated]); // Update state immediately
            setNewDish({ dishName: "", dishDescription: "", dishPrice: "" }); // Reset form
        } catch (error) {
            console.error("Error creating dish:", error);
        }
    };

    // Handle Image Upload
    const handleImageUpload = async (dishId) => {
        if (file) {
            try {
                await imageUpload(dishId, file, setUploading, setError);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    // Handle Adding Dish to Menu
    const handleAddDish = async (dishId) => {
        try {
            await addDishToMenu(selectedRestaurant, dishId);
        } catch (error) {
            console.error("Error adding dish to menu:", error);
        }
    };

    // Handle Dish Removal
    const handleRemoveDish = async (dishId) => {
        try {
            await deleteDish(selectedRestaurant.id, dishId);
            setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId)); // Remove from state
        } catch (error) {
            console.error("Error removing dish:", error);
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurant Menu</h2>

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
                            <h3 className="text-lg font-semibold">{dish.dishName}</h3>
                            <p className="text-gray-600">{dish.dishDescription}</p>
                            <p className="text-green-600 font-bold">${dish.price}</p>

                            {/* Display Image if Exists */}
                            {dish.imageLocation && (
                                <img  src={`http://localhost:5000/api/menus/${dish.id}/download`}
                                alt={dish.id} className="w-40 h-40 object-cover rounded-md mt-2" />
                            )}

                       
                            {/* File Upload */}
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept="image/*"
                                className="mt-2 text-sm"
                            />

                            {/* Buttons */}
                            <div className="mt-3 flex space-x-2">
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;
