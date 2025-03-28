import React from 'react';
import OrderForm from '../components/order/orderForm';
import OrderList from '../components/order/orderList';

const OrderPage = ({ restaurantId }) => {
    return (
        <div>
            <h1>Orders</h1>
            <OrderForm restaurantId={restaurantId} />
            <OrderList restaurantId={restaurantId} />
        </div>
    );
};

export default OrderPage;
