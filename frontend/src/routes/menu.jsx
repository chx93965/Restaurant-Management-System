import React, { useEffect, useState } from 'react';
import { getMenuByRestaurant, addDishToMenu, createDish, uploadImage } from '../services/menu';
import './menu.css';

const Menu = ({ restaurantId }) => {
    const [dishes, setDishes] = useState([]);
    const [newDish, setNewDish] = useState({
        dishName: '',
        dishDescription: '',
        dishPrice: '',
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            const data = await getMenuByRestaurant(restaurantId);
            setDishes(data);
        };
        fetchMenu();
    }, [restaurantId]);

    const handleCreateDish = async (e) => {
        e.preventDefault();
        await createDish(newDish);
        setNewDish({
            dishName: '',
            dishDescription: '',
            dishPrice: '',
        });
    };

    const handleImageUpload = async (dishId) => {
        if (file) {
            await uploadImage(dishId, file);
        }
    };

    const handleAddDish = async (dishId) => {
        await addDishToMenu(restaurantId, dishId);
    };

    const handleRemoveDish = async (dishId) => {
        // remove dish from menu
    };

    return (
        <div className="menu-container">
            <h2>Menu</h2>
            <form onSubmit={handleCreateDish}>
                <input
                    type="text"
                    placeholder="Dish Name"
                    value={newDish.dishName}
                    onChange={(e) => setNewDish({ ...newDish, dishName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Dish Description"
                    value={newDish.dishDescription}
                    onChange={(e) => setNewDish({ ...newDish, dishDescription: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Dish Price"
                    value={newDish.dishPrice}
                    onChange={(e) => setNewDish({ ...newDish, dishPrice: e.target.value })}
                />
                <button type="submit">Add Dish</button>
            </form>

            <div className="dishes">
                {dishes.map((dish) => (
                    <div className="dish" key={dish.id}>
                        <h3>{dish.dishName}</h3>
                        <p>{dish.dishDescription}</p>
                        <p>${dish.price}</p>
                        {dish.imageLocation && <img src={dish.imageLocation} alt={dish.dishName} />}
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept="image/*"
                        />
                        <button onClick={() => handleImageUpload(dish.id)}>Upload Image</button>
                        <button onClick={() => handleAddDish(dish.id)}>Add to Menu</button>
                        <button onClick={() => handleRemoveDish(dish.id)}>Remove from Menu</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
