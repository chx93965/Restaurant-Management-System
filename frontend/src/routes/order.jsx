import React, { useEffect, useState } from 'react';
import {useAuth} from "../context/AuthContext";
import { getMenuByRestaurant} from "../services/menu";
import { addOrder, deleteOrder, addItemsToOrder, removeItemFromOrder, getOrderById } from "../services/order";

const OrderPage = ({ restaurantId }) => {
    const { user, setUser, selectedRestaurant } = useAuth();
    const [menu, setMenu] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [orderType, setOrderType] = useState('dine-in');
    const [tableId, setTableId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMenu = async () => {
            if (selectedRestaurant) {
                try {
                    const data = await getMenuByRestaurant(selectedRestaurant.id);
                    setMenu(data);
                    const initialQuantities = {};
                    data.forEach(dish => {
                        initialQuantities[dish.id] = 0;
                    });
                    setQuantities(initialQuantities);
                } catch (error) {
                    console.error("Error fetching menu:", error);
                }
            }
        };
        fetchMenu();
    }, [restaurantId]);

    const updateQuantity = (dishId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [dishId]: Math.max(0, (prev[dishId] || 0) + delta),
        }));
    };

    const getOrderItems = () => {
        return Object.entries(quantities)
            .flatMap(([dishId, count]) => Array(count).fill({ dishId: parseInt(dishId) }));
    };

    const totalPrice = menu.reduce((acc, dish) => {
        return acc + (dish.price * (quantities[dish.id] || 0));
    }, 0);

    const handleSubmit = async () => {
        if (orderType === 'dine-in' && !tableId) {
            alert('Please enter your table ID.');
            return;
        }

        const dishes = getOrderItems();
        if (dishes.length === 0) {
            alert('Please select at least one item.');
            return;
        }

        setSubmitting(true);
        setMessage('');

        try {
            await addOrder(selectedRestaurant.id, orderType, orderType === 'dine-in' ? tableId : null, dishes);
            setMessage('Order submitted successfully');
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting order:", error);
            setMessage('Failed to submit order.');
            setSubmitting(false);
            setSuccess(false);
        }

        setSubmitting(false);
    };

    return (
        <div className="order-page max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Place Your Order</h1>

            <div className="order-type-selector mb-6">
                <label className="block text-gray-700">Order Type:</label>
                <select
                    value={orderType}
                    onChange={e => setOrderType(e.target.value)}
                    className="mt-2 p-2 border border-gray-300 rounded-md"
                >
                    <option value="dine-in">Dine-In</option>
                    <option value="takeout">Takeout</option>
                    <option value="delivery">Delivery</option>
                </select>
                {orderType === 'dine-in' && (
                    <div className="mt-4">
                        <label className="block text-gray-700">Table ID:</label>
                        <input
                            type="number"
                            value={tableId}
                            onChange={e => setTableId(e.target.value)}
                            min={1}
                            placeholder="Enter table ID"
                            required
                            className="mt-2 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                )}
            </div>

            <div className="menu-list mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menu</h2>
                {menu.map(dish => (
                    <div key={dish.id} className="menu-item bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                        {/* Image on the left */}
                        {dish.imageLocation ? (
                            <img
                                src={`http://localhost:5000/api/menus/${dish.id}/download`}
                                alt={dish.dishName}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
                                No Image
                            </div>
                        )}

                        {/* Text and buttons */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <strong className="text-lg">{dish.dishName}</strong>
                                <p className="text-gray-600">{dish.dishDescription}</p>
                                <span className="text-green-600 font-bold">${dish.price.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <button
                                    onClick={() => updateQuantity(dish.id, -1)}
                                    disabled={quantities[dish.id] === 0}
                                    className="px-2 py-0.25 bg-white text-black font-bold rounded-md hover:bg-red-600"
                                >
                                    -
                                </button>
                                <span className="mx-4 text-xl">{quantities[dish.id]}</span>
                                <button
                                    onClick={() => updateQuantity(dish.id, 1)}
                                    disabled={quantities[dish.id] >= 100}
                                    className="px-2 py-0.25 bg-white text-black font-bold rounded-md hover:bg-green-600"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="order-summary mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Order</h2>
                <ul className="space-y-3">
                    {menu
                        .filter(dish => quantities[dish.id] > 0)
                        .map(dish => (
                            <li key={dish.id} className="text-lg">
                                {dish.dishName} x {quantities[dish.id]} = ${(dish.price * quantities[dish.id]).toFixed(2)}
                            </li>
                        ))}
                </ul>
                <p className="mt-4 text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
            >
                {submitting ? 'Submitting...' : 'Submit Order'}
            </button>

            {message && (
                <p className={`mt-4 text-center ${success ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default OrderPage;
