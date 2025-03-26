import React, { useState } from 'react';
import { addTable, createTablesForRestaurant } from '../../services/restaurant';

const TableForm = ({ restaurantId }) => {
    const [tableSizes, setTableSizes] = useState([]);

    const handleTableSizeChange = (e) => {
        setTableSizes(e.target.value.split(',').map(size => parseInt(size.trim(), 10)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (tableSizes.length === 1) {
            await addTable(restaurantId, tableSizes[0]);
        } else {
            await createTablesForRestaurant(restaurantId, tableSizes);
        }
    };

    return (
        <div>
            <h2>Create Tables for Restaurant</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter table sizes (comma separated)"
                    onChange={handleTableSizeChange}
                />
                <button type="submit">Add Tables</button>
            </form>
        </div>
    );
};

export default TableForm;
