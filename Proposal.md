# Restaurant Management Web Application

## Project Members
| Name                     | Student Number | Email Address                    |
|--------------------------|----------------|----------------------------------|
| Jingxian Hou             | 1001159710     | jingxian.hou@mail.utoronto.ca    |
| Hanxiao Chang            | 1006341709     | Hanxiao.chang@mail.utoronto.ca   |

## Motivation

The restaurant industry in Toronto's downtown area is fast-paced. Apart from the food quality, the customer satisfaction primarily depends on the effectiveness and efficiency of restaurant services, especially the time and effort spent in ordering food, calling services, checking out, etc. Despite the growth of customer volume and the need for innovative technology, many restaurants still follow a traditional approach to manage customer orders, such as phone call reservations and pen-and-paper order taking. This outdated approach often causes issues like long waiting times, mismanaged reservations, order errors, and lack of streamlined communication between customers and staff. Additionally, restaurant managers face challenges in tracking cash flow and summarizing financial data without digitized balance sheets.

We aim to introduce a new approach in restaurant management to improve the quality of customer services among the restaurant workflow by creating an integrated digital platform for clients, waitstaff, and managers. This application features fast and simplified table reservation, table status monitoring, and online order management. It also improves operational efficiency through cash flow tracking and performance reporting. There are similar applications like Uber Eats, which facilitate takeout orders, while this platform is designed to complement eat-in services in restaurants. 


## Objective and Key Features

The goal of this project is to develop a management system that handles and records daily restaurant operations. The system consists of three interconnected applications, including client-end, waiter-end, and manager-end, for the purpose of reducing human effort, digitizing paper works, minimizing errors, and improving efficiencies in order processing and financial management.

```
*** must have
**  should have
*   nice to have
```

### General Features
#### User Authentication and Authorization ( *** )
- Unique user accounts with role-based access control


### Client-End Application

#### Restaurant Information Display ( * )
- Display of restaurant location and contact information
Menu item photos and promotional images
- Announcements and news section for updates and special events

#### Table Reservation ( *** )
- Real-time table booking system with table selection interface
- Option to provide reservation details and pay a deposit online
- Confirmation notifications and reminders for reservations
- Virtual waiting list for when all tables are occupied
- Real-time updates on waiting status and estimated wait time

#### Table Opening ( *** )
- QR code scanning to automatically open and link the customer’s table to the app
- Transition from reservation to table service

#### Service Call ( ** )
- In-app feature to call a waiter for service directly from the customer’s table

#### Order Management ( *** )
- Self-service ordering interface for food and beverage selection
- Real-time order status tracking and modification

#### Payment ( ** )
- Flexible payment options pay immediately after ordering or pay later
- Multiple payment methods credit card, member balance, and coupons
- Options of merging multiple orders from the same table into a single bill

#### Membership Center ( * )
- One-click registration by scanning a QR code
- Display of member balance, bonus credits, and points
- Membership recharge options standard and package recharges
- Membership levels with corresponding discount rates

#### Coupons and Vouchers ( * )
- Product-specific coupons and general discount vouchers
- Integration with third-party platforms for voucher redemption

#### Takeaway Service ( * )
- Option to place takeaway orders with delivery

#### Points Shop ( * )
- Redeem accumulated points for products, discounts, or third-party offerings


### Waiter-End Application

#### Real-Time Table Status ( *** )
- Dashboard showing table occupancy status
- Display of reservation details, order history, consumption amount, and payment status

#### Reservation Management ( *** )
- Manual reservation entry and status inquiries

#### Table Operations ( *** )
- Open, transfer, and clear tables

#### Order Management ( *** )
- Place and modify orders on behalf of customers

#### Payment Processing ( ** )
- Support for various payment methods, including credit card, member balance, and coupons

#### Member Management ( * )
- Recharge member accounts on behalf of customers

#### Performance Reports ( ** )
- Sales and service performance rankings
- Order and revenue summary reports


### Manager-End System

#### Restaurant Management ( *** )
- Display and manage restaurant information, including location, contact details, and promotional material
- Manage and update staff accounts

#### Staff Permissions Management ( *** )
- Role-based access control for reservations, order management, and reports

#### Inventory Management ( * )
- Track warehouse stock and conduct cost analysis
- Generate balance sheets for inventory management

#### Product Management ( *** )
- Add, categorize, and price menu items
- Manage discounts and item availability
- Upload images for cuisines 

#### Order Management ( *** )
- Track reservations, orders, and payment statuses
- Upload and download receipts as image files

#### Reports and Analysis ( ** )
- Generate sales reports and revenue analysis

#### Member Management ( * )
- View and manage member data, balances, and transaction history


### Technical Details

We will develop a full-stack web application using **Option B** from the architecture design. The system will be built with separate frontend and backend components:
#### Frontend
- We will use React with Tailwind CSS for a modern and responsive user interface. Additionally, we will integrate shadcn/ui to enhance the frontend experience. The frontend will be highly responsive, allowing users to interact with the application to perform various realistic restaurant management operations
#### Backend
- Express.js with a RESTful API for client-server communication
- PostgreSQL/SQLite3 database with normalized schema
- Cloud storage AWS S3 for images and documents
- External integrations of payment gateways, third-party voucher platforms
#### Advanced Feature
- We are going to implement authentication and authorization since the application allows users to create accounts to perform various actions based on the permission model.
- The system also includes file handling and processing, such as menu and image uploads, as well as balance sheet downloads.


#### Database Schema and Relationships

The database will be designed to efficiently store restaurant-related data, including user roles, menus, orders, and financial transactions. Relationships will be structured to allow seamless data retrieval and management.

##### SQL Schema

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

##### File Storage Requirements

The system will support file storage for:
- Dish image uploads, menu PDF uploads, receipt uploads, and cash flow statement generation and downloads.
- Uploading and downloading PDF versions of menus and balance sheets.

This project aims to enhance restaurant management by providing a comprehensive digital solution, reducing human errors, and streamlining operations.


## Tentative Plan

The implementation will be collaborated among two developers, and the project is planned over five weeks. Responsibilities are as follows:

| Week | Tasks                                                     |  
|------|-----------------------------------------------------------|  
| 1    | System architecture and database design                   |  
| 2    | Backend API development                                   |  
| 3    | Frontend development for client-end app                   |  
| 4    | Frontend development for waiter and manager-end apps      |  
| 5    | Integration, testing, and deployment                      |  

### Week 1

- **Hanxiao**
    - Create and implement SQL database schema and operations

- **Jingxian**
    - Set up cloud storage for images and files

### Week 2
- **Hanxiao**
    - Develop RESTful API endpoints for user authentication and authorization
    - Implement order management API (placing orders, applying discounts, generating bills)

- **Jingxian**
    - Build API for menu management (CRUD operations for dishes, images, PDFs)
    - Develop balance sheet management API (tracking costs, generating reports)

### Week 3

- **Hanxiao**
    - Develop user authentication and registration interface
    - Create order management interface for self-service ordering and order status tracking

- **Jingxian**
    - Implement table reservation and real-time waiting list features
    - Implement QR code scanning for table opening and linking

### Week 4

- **Hanxiao**
    - Build real-time table status dashboard for waiter-end app
    - Create restaurant management interface for manager-end app (menu, staff management)

- **Jingxian**
    - Develop order management interface for waiters (placing and modifying orders)
    - Implement performance reporting and balance sheet views for manager-end app

### Week 5

- **Hanxiao**
    - Integrate frontend and backend components for all three applications
    - Refine UI/UX and optimize performance
    - Draft user guides

- **Jingxian**
    - Conduct unit and integration testing for API and frontend components
    - Deploy system to cloud environment and configure database connections
    - Prepare system documentation


