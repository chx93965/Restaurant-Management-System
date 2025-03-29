import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/order';

const OrderList = ({ restaurantId }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getOrders(restaurantId);
                setOrders(fetchedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [restaurantId]);

    return (
        <div>
            <h2>Order List</h2>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.orderId}>
                            <h3>Order ID: {order.orderId}</h3>
                            <p>Order Type: {order.orderType}</p>
                            <p>Status: {order.status}</p>
                            <p>Total Items: {order.items.length}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderList;
