# Restaurant Management System

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


## Contributions


## Motivation

There are many applications such as DoorDash and Uber Eats created for consumers to make it easy to order food online and have it delivered to their homes. However, there are not many applications for restaurant owners to manage their day-to-day activities, such as updating menus, checking balance sheets, and taking dine-in orders. 

We recognize that there is a huge market for this, as many small restaurants still rely on waitstaff writing down customers' orders on paper. This often results in misplaced orders, which can negatively impact the restaurant. Additionally, menus are often printed on paper, and when inflation occurs, restaurants must constantly reprint the menu to update prices.

## Objectives

The objective of this project is to create an application that helps restaurant owners and employees digitize and simplify their daily operations. 

For owners, they can register restaurants and customize menus for each location, including uploading images and updating prices. The menu will be automatically synced with employees. Employees will be able to place orders for dine-in customers and complete the order once payment is made.

The application is designed to be straightforward and easy to use. It serves as a centralized place to store all activities, eliminating the need to record information on paper and reducing the risk of data loss. Most importantly, balance sheets can be generated easily with a simple button click, so restaurant owners do not need to hire accountants to calculate each order. All information can be retrieved easily with just a few clicks.

## Tech Stacks

The frontend was built with the React framework using JavaScript. Styling was implemented with Tailwind CSS and Shadcn. 

The backend was developed using Express.js with an SQLite3 database. All API endpoints follow RESTful API design principles.

In addition to the basic separation of backend and frontend components, the system also offers advanced features such as file handling and processing. This supports menu and restaurant image uploads and downloads, as well as balance sheet generation. 

Additionally, user authentication and authorization capabilities are provided. Depending on the type of account, different sets of operations will be enabled. For example, only restaurant owners can register restaurants and update menus.

## Features

The application offers basic day to day features of the restaurant. The detail explaination of all the feature that app provides is listed below.

---

### Authentication and Authorization

The application allows user to create an account with username and password. When creating account the user has to specify if the account is for owner, employee or customer. Different types of the account can perform different set of actions Owner can manage restaurant by creating restaurant profile such as create restaurant and update the pictures of the restaurant. employees can place orders for the customer.

---

### Restaurant Management

The feature is only for restaurants owners, owner can create restaurants with name and address as well as the table layout. The layout is simplified by only specifying the number of tables and number of seats for each table. The owner can also upload an profile image for the restaurant. The owner can also generate a balance sheet for a given year. The balance sheet will be downloaded as a csv file listing all the completed order within that calendar year. The owner can also remove the restuarnt from the ownership. Since each owner can own multiple restaurants so the owner can select a resturant to work with. The restuarnt picture as well as the Menu and orders will change based on the selected restaurant.

---

### Menu Management

Owner can also create dish for a restaurant menu. To create a dish owner can specify a dish name, dish description as well as the price. Owner can also upload the image for the dish, this dish will be shown when employee place the order. There will be Edit and Remove buttons for the dish to remove item from the menu or update the basic information of the dish.

---

### Order Management

Owner and Employee can place the order for the customer. If the Order type is dine in the employee will seect the table that the customer is sat on and all the items from the menu will be shown and employee can add the dish to the order. Once submt the order the pending orders is shwon for each table and the employee can complete the order once the purchase is completed. To make employee’s work simplay the toatal price for each peniding order is also shown.

## User Guide

### Login and Sign Up

The default URL for the application is [http://localhost:5173/](http://localhost:5173/). Upon opening the page, you will see a welcome message for the Restaurant Application. At the top, there is a navigation panel with default tabs: **Home**, **Order**, and **Profile**. However, if you are not logged in, clicking any of these tabs will redirect you to the Login page.

To begin, you need to create an account by clicking on the **Sign Up** button.

During the sign-up process, you can choose from three roles: **Customer**, **Owner**, or **Server**. Passwords are encrypted following standard practices, and you will be able to see the characters you type. After successfully creating an account, you will be redirected to the Login page.

The login form contains fields for your username and password. If the username does not exist, an error message will display: `"Invalid username"`. If the password is incorrect, the error will read: `"Invalid password"`. Once successfully logged in, you will be redirected to the Home page. At this point, the navigation panel may change depending on your user role. For example, if you are logged in as an **Owner**, you will now see additional options such as **Create Menu** and **Order**.
![Alt Text](https://example.com/image.jpg)

### Restaurant Management

Initially, you will not own any restaurants. You will be presented with a form to create a new restaurant. Below the form, a list of restaurants you own will be displayed. If you do not own any, a message will inform you accordingly.

To create a restaurant, you must provide the following information:

- Restaurant name
- Address
- Postal code
- Number of tables
- Capacity per table

This information can be updated later. The form includes basic validation—for example, if you try to submit without entering a restaurant name, an error message will appear stating that the field is required.

Once submitted, a new restaurant card will be created displaying all the information you provided. Below the restaurant name and address, you will find an **Edit** button to modify the basic information or adjust the number of tables. You also have the option to **upload an image** for the restaurant.

Other actions include:

- A **Delete** button (red) to remove the restaurant.
- An option for the **Owner** to generate a balance sheet (explained later).
- A **Select** button that allows the Owner to choose the restaurant to work with.

Once a restaurant is selected, this choice will affect other sections such as **Menu** and **Order**. For example, if you select "KFC", clicking on the **Menu** tab will display the menu items for the KFC restaurant only.

### Menu Management

Once the owner selects a restaurant, they can begin making changes to the restaurant's menu. Clicking on the **Menu** tab in the navigation bar will take you to the **Menu Management** page. This page contains a form for adding new dishes, and below the form, it displays all the dishes currently on the restaurant’s menu.

After a dish is added, the owner has the option to either remove it from the menu or update its basic information—such as the price—by clicking the **Edit** button. Additionally, the owner can upload an image for the dish; otherwise, a default picture will be shown.

This step is crucial, as customers can only start placing orders once the menu has been created.


## Lessons Learned

One important lesson learned from building this application is the importance of properly designing the system architecture before jumping into implementation. Without a solid design, making changes later—especially to the database schema—can become extremely difficult and time-consuming.

For example, in the initial design, the `user` table included a field to indicate the restaurant a user owns. Later, we realized that an owner may manage multiple restaurants. This required us to normalize the schema and introduce a new table to map users to restaurant IDs. This change significantly impacted how the backend was structured.

If the APIs and schema had been carefully planned from the beginning, the development process would have been more straightforward and less prone to refactoring.

## Conclusion

In conclusion, this application serves as a strong proof of concept that demonstrates how digital solutions can significantly improve the efficiency of restaurant operations. It helps owners, servers, and even customers perform day-to-day tasks more effectively. By streamlining operations and reducing manual errors, the application has the potential to save users hundreds of hours each year and make their daily work more accurate and manageable.
