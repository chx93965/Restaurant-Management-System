import React, { useState } from 'react';
import { addOrder, addItemsToOrder, markOrderAsCompleted } from '../../services/order';

const OrderForm = ({ restaurantId }) => {
    const [dishes, setDishes] = useState([]);
    const [orderType, setOrderType] = useState('takeout'); // Default to takeout
    const [tableId, setTableId] = useState(null);
    const [orderId, setOrderId] = useState(null);

    const handleAddOrder = async () => {
        try {
            const orderData = await addOrder(restaurantId, orderType, tableId, dishes);
            setOrderId(orderData.orderId);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleAddItemsToOrder = async () => {
        try {
            await addItemsToOrder(orderId, dishes);
        } catch (error) {
            console.error('Error adding items to order:', error);
        }
    };

    const handleCompleteOrder = async () => {
        try {
            await markOrderAsCompleted(orderId);
        } catch (error) {
            console.error('Error completing order:', error);
        }
    };

    return (
        <div>
            <h2>Order Form</h2>
            <select onChange={(e) => setOrderType(e.target.value)} value={orderType}>
                <option value="takeout">Takeout</option>
                <option value="dine-in">Dine-In</option>
            </select>
            <input
                type="number"
                placeholder="Table ID (if dine-in)"
                value={tableId || ''}
                onChange={(e) => setTableId(e.target.value)}
            />
            <button onClick={handleAddOrder}>Create Order</button>
            <button onClick={handleAddItemsToOrder}>Add Items to Order</button>
            <button onClick={handleCompleteOrder}>Complete Order</button>
        </div>
    );
};

export default OrderForm;
