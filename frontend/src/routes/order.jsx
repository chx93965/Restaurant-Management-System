import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { getMenuByRestaurant } from "../services/menu";
import { addOrder, getOrders, addItemsToOrder, completeOrder } from "../services/order";
import { getTablesByRestaurant } from "../services/restaurant";
import Navbar from "../components/navBar";
import { useNavigate } from 'react-router-dom'; // For redirection


const OrderPage = ({ restaurantId }) => {
    const { user, selectedRestaurant } = useAuth();
    const [menu, setMenu] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [orderType, setOrderType] = useState('dine-in');
    const [tableId, setTableId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [tables, setTables] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const navigate = useNavigate(); // Hook to navigate to different pages

    useEffect(() => {
        if (!user) {
            // Redirect to login if no user is found in context
            navigate('/login');
            return;
        }
        if (!selectedRestaurant) {
            alert("No selected Restaurant");
            if (user.role === "owner") {
                navigate("/restaurant");
            } else {
                navigate("/");
            }
        }


        const fetchMenuAndOrders = async () => {
            if (selectedRestaurant) {
                try {
                    const menuData = await getMenuByRestaurant(selectedRestaurant.id);
                    setMenu(menuData);

                    const initialQuantities = {};
                    menuData.forEach(dish => {
                        initialQuantities[dish.id] = 0;
                    });
                    setQuantities(initialQuantities);

                    const orders = await getOrders(selectedRestaurant.id, 'pending');
                    const pending = orders.filter(order => order.status === 'pending');
                    console.log("Pending orders:", pending);
                    setPendingOrders(pending);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }

            if (selectedRestaurant && orderType === 'dine-in') {
                try {
                    const data = await getTablesByRestaurant(selectedRestaurant.id);
                    setTables(data);
                } catch (error) {
                    console.error("Error fetching tables:", error);
                }
            }
        };
        fetchMenuAndOrders();
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

    // const subtotal = menu.reduce((acc, dish) => {
    //     return acc + (dish.price * (quantities[dish.id] || 0));
    // }, 0);
    // const HST_RATE = 0.13;
    // const hst = subtotal * HST_RATE;
    // const totalPrice = subtotal + hst;

    const calculatePrice = (items) => {
        const HST_RATE = 0.13;
        const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
        const tax = subtotal * HST_RATE;
        const total = tax + subtotal;
        return { subtotal, tax, total };
    }

    // Function to handle submitting an order
    const handleSubmit = async () => {
        if (orderType === 'dine-in' && !tableId) {
            setMessage('Please enter your table ID');
            setSuccess(false);
            return;
        }

        const dishes = getOrderItems();
        if (dishes.length === 0) {
            setMessage('Please select at least one item');
            setSuccess(false);
            return;
        }

        setSubmitting(true);
        setMessage('');
        console.log('tableId:', tableId);
        // Check if a pending order exists for the selected table
        console.log("Pending orders:", pendingOrders);
        const existingOrder = pendingOrders.find(order => order.tableId.toString() === tableId.toString());
        console.log("Existing order:", existingOrder);
        if (existingOrder) {
            // If an existing order is found, add the new items to it
            try {
                console.log("Adding items to existing order:", existingOrder.orderId, dishes);
                await addItemsToOrder(existingOrder.orderId, dishes); // Call an update function to add the new items
                setMessage('Order updated successfully');
                setSuccess(true);
            } catch (error) {
                console.error("Error updating order:", error);
                setMessage('Failed to update order.');
                setSuccess(false);
            }
        } else {
            // If no existing order is found, create a new order
            try {
                await addOrder(selectedRestaurant.id, orderType, orderType === 'dine-in' ? tableId : null, dishes);
                setMessage('Order submitted successfully');
                setSuccess(true);
            } catch (error) {
                console.error("Error submitting order:", error);
                setMessage('Failed to submit order.');
                setSuccess(false);
            }
        }

        try {
            const orders = await getOrders(selectedRestaurant.id, 'pending');
            const pending = orders.filter(order => order.status === 'pending');
            setPendingOrders(pending); // Update the state with the fresh list of pending orders
        } catch (error) {
            console.error("Error refreshing pending orders:", error);
        }

        // reset order section
        setQuantities(Object.fromEntries(menu.map(dish => [dish.id, 0])));
        setSubmitting(false);
    };

    const groupOrdersByTable = (orders) => {
        const groupedOrders = {};

        orders.forEach(order => {
            if (!groupedOrders[order.tableId]) {
                groupedOrders[order.tableId] = {
                    tableId: order.tableId,
                    orderId: order.orderId,
                    items: [],
                };
            }

            // Merge items for the same tableId
            groupedOrders[order.tableId].items = [
                ...groupedOrders[order.tableId].items,
                ...order.items,
            ];
        });

        return Object.values(groupedOrders);
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            await completeOrder(orderId); // Call the completeOrder function to mark the order as completed
            setMessage('Order completed');
            setSuccess(true);
            // Refresh the pending orders after completing one
            const updatedOrders = await getOrders(selectedRestaurant.id, 'pending');
            setPendingOrders(updatedOrders.filter(order => order.status === 'pending'));
        } catch (error) {
            console.error("Error completing order:", error);
            setMessage('Failed to complete order');
            setSuccess(false);
        }
    };

    return (
        // <div className="pt-20 order-page max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <div className="pt-20 min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <Navbar />

                <h1 className="text-3xl font-bold mb-4">Place Your Order</h1>

                {/* Order Items */}
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
                            <label className="block text-gray-700">Table:</label>
                            <select
                                value={tableId}
                                onChange={e => setTableId(e.target.value)}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                required
                            >
                                <option value="">Select a table</option>
                                {tables.map((table, index) => (
                                    <option key={index} value={table.id}>
                                        {`Table #${index + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Pending Orders Section */}
                {pendingOrders.length > 0 && user.role && (user.role === "owner" || user.role === "server") && (
                    <div className="pending-orders mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Orders</h2>
                        <ul className="space-y-3">
                            {groupOrdersByTable(pendingOrders).map((order, index) => {
                                // Calculate the total for each table
                                const summarizedItems = Object.values(order.items.reduce((acc, item) => {
                                    if (!acc[item.dishId]) {
                                        acc[item.dishId] = { ...item, quantity: 0 };
                                    }
                                    acc[item.dishId].quantity += 1;
                                    return acc;
                                }, {}));
                                const { tax, total } = calculatePrice(summarizedItems);
                                const tableIndex = tables.findIndex(table => table.id === order.tableId) + 1;
                                // Display "Table #1", "Table #2", etc.
                                const tableNumber = tableIndex >= 0 ? `Table #${tableIndex}` : 'Unknown Table';
                                return (
                                    <li key={index} className="border-b pb-4">
                                        <div className="flex justify-between items-center">
                                            <span>{tableNumber}</span> {/* Table Number */}
                                            <span className="font-semibold text-green-600">${total.toFixed(2)}</span>
                                        </div>
                                        <ul className="mt-2">
                                            {/* Display each item in the order*/}
                                            {summarizedItems.map((item, i) => (
                                                <li key={i} className="flex justify-between">
                                                    <span>{item.dishName} x {item.quantity}</span>
                                                    <span className="text-gray-500">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </li>
                                            ))}

                                            <li key="hst" className="flex justify-between">
                                                <span>HST (13%): </span>
                                                <span className="text-gray-500">${tax.toFixed(2)}</span>
                                            </li>
                                        </ul>
                                        <button
                                            onClick={() => handleCompleteOrder(order.orderId)}
                                            className="mt-4 w-full bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                                        >
                                            Complete Order
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Menu Section */}
                <div className="menu-list mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menu</h2>
                    {menu.map(dish => (
                        <button
                            key={dish.id}
                            onClick={() => {
                                if (quantities[dish.id] === 0) {
                                    updateQuantity(dish.id, 1);
                                }
                            }}
                            className={`w-full text-left p-4 mb-3 rounded-lg shadow-md flex justify-between items-center transition 
                                ${quantities[dish.id] > 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-green-100'}`}
                        >
                            <div>
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

                                <strong className="text-lg">{dish.dishName}</strong>
                                <p className="text-sm text-gray-600">{dish.dishDescription}</p>
                            </div>
                            <span className="text-green-600 font-bold">${dish.price.toFixed(2)}</span>
                        </button>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Order</h2>
                    {Object.entries(quantities).filter(([_, qty]) => qty > 0).length === 0 ? (
                        <p className="text-gray-500">No items selected yet.</p>
                    ) : (
                        (() => {
                            const selectedItems = menu
                                .filter(dish => quantities[dish.id] > 0)
                                .map(dish => ({ ...dish, quantity: quantities[dish.id] }));
                            const { subtotal, tax, total } = calculatePrice(selectedItems);
                            return (
                                <>
                                    <ul className="space-y-3">
                                        {selectedItems.map(dish => (
                                            <li key={dish.id}
                                                className="flex justify-between items-center border-b pb-2">
                                                <span>{dish.dishName}</span>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => updateQuantity(dish.id, -1)}
                                                        disabled={quantities[dish.id] === 0}
                                                        className="px-2 py-0.25 bg-white text-black font-bold rounded-md hover:bg-red-600"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-3">{quantities[dish.id]}</span>
                                                    <button
                                                        onClick={() => updateQuantity(dish.id, 1)}
                                                        disabled={quantities[dish.id] >= 100}
                                                        className="px-2 py-0.25 bg-white text-black font-bold rounded-md hover:bg-green-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <ul className="mt-2">
                                        <li key="subtotal" className="flex justify-between text-gray-500 mt-1">
                                            <span>Subtotal: </span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </li>
                                        <li key="hst" className="flex justify-between text-gray-500 mt-1">
                                            <span>HST (13%): </span>
                                            <span>${tax.toFixed(2)}</span>
                                        </li>
                                        <li key="total" className="flex justify-between text-black text-xl font-bold mt-2">
                                            <span>Total: </span>
                                            <span>${total.toFixed(2)}</span>
                                        </li>
                                    </ul>
                                </>
                            )
                        })()
                    )}
                </div>

                {/* Clear Order button */}
                <button
                    onClick={() => setQuantities(Object.fromEntries(menu.map(dish => [dish.id, 0])))}
                    className="w-full py-2 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400 transition duration-200 mb-4"
                >
                    Clear Order
                </button>

                {/* Submit Order Button */}
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
        </div>
    );
};

export default OrderPage;
