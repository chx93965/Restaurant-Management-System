# Restaurant Management Web Application

## Project Proposal

### Motivation

Many restaurants still follow a traditional approach to managing their orders. For example, waiters and waitresses often write customer orders on small pieces of paper. This approach frequently leads to various issues: orders may be unclear, resulting in incorrect dishes being served, and there is no efficient way to track which dish belongs to which customer. Additionally, restaurant accountants face challenges in auditing daily cash flows due to the manual processes involved in generating balance sheets.

To address these challenges, we propose building a web application that enables restaurant owners to better manage daily operations, including order submission, cash flow tracking, and online order management. While similar platforms exist, such as Uber Eats, which facilitates takeout orders, they are not designed specifically for restaurant owners to manage in-house and online orders efficiently.

## Objective and Key Features

The goal of this project is to develop a unified web application that simplifies daily restaurant operations. This system will help restaurant owners reduce manual effort by centralizing all essential functions in a single platform. It will also minimize errors and inefficiencies in order processing and financial management.

### Key Features

#### User Authentication and Authorization
- Each user will have a unique account.
- The restaurant owner will have permissions to modify the menu, generate balance sheets, and export data to PDF.
- Waiters and waitresses will have permissions to place customer orders and generate bills.

#### Menu Management
- Update the menu by setting prices for each dish.
- Upload images for each dish.
- Upload a PDF version of the menu for customers to view.

#### Order Management
- Assign orders to specific table positions.
- Apply discounts and coupons.
- Generate customer bills efficiently.

#### Balance Sheet Management
- Enter and track daily operational costs.
- Upload and download receipts.
- Automatically generate balance sheets and cash flow reports based on recorded orders.

## Technical Implementation

We will develop a full-stack web application using **Option B** from the architecture design. 
- **Frontend:** React with Tailwind CSS for a modern and responsive user interface.
- **Backend:** Express.js to implement a RESTful API for seamless communication between the client and server.

## Database Schema and Relationships

The database will be designed to efficiently store restaurant-related data, including user roles, menus, orders, and financial transactions. Relationships will be structured to allow seamless data retrieval and management.

### SQL Schema

```sql
CREATE TABLE users (
    userId SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    roleId INT NOT NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (roleId) REFERENCES roles(roleId) ON DELETE SET NULL
);

CREATE TABLE roles (
    roleId SERIAL PRIMARY KEY,
    roleName VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE operations (
    operationId SERIAL PRIMARY KEY,
    operationName VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE roleOperations (
    roleId INT NOT NULL,
    operationId INT NOT NULL,
    PRIMARY KEY (roleId, operationId),
    CONSTRAINT fk_role_operations_role FOREIGN KEY (roleId) REFERENCES roles(roleId) ON DELETE CASCADE,
    CONSTRAINT fk_role_operations_operation FOREIGN KEY (operationId) REFERENCES operations(operationId) ON DELETE CASCADE
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    restaurantName VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    postcode VARCHAR(20) NOT NULL
);

CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    dishName VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    imageLocation TEXT
);

CREATE TABLE menus (
    restaurantId INT NOT NULL,
    dishId INT NOT NULL,
    PRIMARY KEY (restaurantId, dishId),
    CONSTRAINT fk_menus_restaurant FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT fk_menus_dish FOREIGN KEY (dishId) REFERENCES dishes(id) ON DELETE CASCADE
);

CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    size INT NOT NULL,
    restaurantId INT NOT NULL,
    CONSTRAINT fk_tables_restaurant FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    restaurantId INT NOT NULL,
    orderType VARCHAR(50) NOT NULL CHECK (orderType IN ('dine-in', 'takeout', 'delivery')),
    tableId INT NULL,
    CONSTRAINT fk_orders_restaurant FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_table FOREIGN KEY (tableId) REFERENCES tables(id) ON DELETE SET NULL
);

CREATE TABLE orderItems (
    id SERIAL PRIMARY KEY,
    orderId INT NOT NULL,
    dishId INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_orderItems_order FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderItems_dish FOREIGN KEY (dishId) REFERENCES dishes(id) ON DELETE CASCADE
);
```

## File Storage Requirements

The system will support file storage for:
- Uploading images of menu items.
- Uploading and downloading PDF versions of menus and balance sheets.

This project aims to enhance restaurant management by providing a comprehensive digital solution, reducing human errors, and streamlining operations.

