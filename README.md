# Restaurant Management System


## Project Members
| Name                     | Student Number | Email Address                    |
|--------------------------|----------------|----------------------------------|
| Jingxian Hou             | 1001159710     | jingxian.hou@mail.utoronto.ca    |
| Hanxiao Chang            | 1006341709     | hanxiao.chang@mail.utoronto.ca   |


## Table of Contents
- [Proposal](./Proposal.md)
- [Motivation](#motivation)
- [Objectives](#objectives)
- [Features](#features)
- [User Guide](#user-guide)
- [Tech Stacks](#tech-stacks)
- [Development Guide](#development-guide)
- [Contributions](#individual-contribution)
- [Video Demo](./demo.mp4)
- [Lessons Learned](#lessons-learned)
- [Conclusion](#conclusion)


## Motivation

The restaurant industry in Toronto's downtown area is fast-paced. Apart from the food quality, customer satisfaction primarily depends on the effectiveness and efficiency of restaurant services, especially the time and effort spent in ordering food, calling services, checking out, etc. Despite the growth of customer volume and the need for innovative technology, many restaurants still follow a traditional approach to managing customer orders, such as phone call reservations and pen-and-paper order taking. This often results in misplaced orders, which can negatively impact the restaurant. Additionally, menus are often printed on paper, and when inflation occurs, restaurants must constantly reprint the menu to update prices. This outdated approach also causes issues like long waiting times, mismanaged reservations, order errors, and a lack of streamlined communication between customers and staff. Additionally, restaurant managers face challenges in tracking cash flow and summarizing financial data without digitized balance sheets. There are many applications, such as DoorDash and Uber Eats, created for consumers to make it easy to order food online and have it delivered to their homes. However, there are not many applications for restaurant owners to manage their day-to-day activities, such as updating menus, checking balance sheets, and taking dine-in orders. 

We recognize that there is a huge market for this, so we aim to introduce a new approach in restaurant management to improve the quality of customer service among the restaurant workflow by creating an integrated digital platform for clients, waitstaff, and managers. This application features fast and simplified table reservation, table status monitoring, and online order management. It also improves operational efficiency through cash flow tracking and performance reporting. There are similar applications like Uber Eats, which facilitate takeout orders, while this platform is designed to complement eat-in services in restaurants. 


## Objectives

The goal of this project is to create an application that helps restaurant owners and employees digitize and simplify their daily operations by handling and recording daily restaurant operations. The system consists of three interconnected applications, including client-end, waiter-end, and manager-end, for the purpose of reducing human effort, digitizing paperwork, minimizing errors, and improving efficiencies in order processing and financial management.

For restaurant owners, they can register restaurants and customize menus for each location, including uploading images and updating prices. The menu will be automatically synced with employees. Employees will be able to place orders for dine-in customers and complete the order once payment is made.

The application is designed to be straightforward to use. It serves as a centralized place to store all activities, eliminating the need to record information on paper and reducing the risk of data loss. Most importantly, balance sheets can be generated easily with a simple button click, so restaurant owners do not need to hire accountants to calculate each order. All information can be retrieved easily with just a few clicks.


## Features

### Authentication and Authorization

The application allows users to create an account with a username and a password. When creating an account, the user will specify their role, indicating whether the account belongs to the owner, employee or customer, based on which different levels of priorities are assigned with a different set of actions. For example, a restaurant owner can manage their restaurants by registering their names, addresses, and updating the pictures of the restaurant. Employees can place and handle orders for customers. Certain pages have restricted access according to user roles. 

### Restaurant Management

The feature is designed only for restaurant owners who can create restaurants with their names and addresses, as well as the table capacity and layout, where the number of tables and the number of seats for each table are specified. The owner can also upload a profile image for the restaurant, and generate a balance sheet for a specific year. The balance sheet will be downloaded as a CSV file listing all the completed orders within that calendar year. Additionally, the owner can also deregister the restaurant from the system. As multiple restaurants may be registered under an owner, one restaurant will be selected to work on, so that the details of the restaurant picture, the menu, and orders can be reviewed.

### Menu Management

This feature is also for restaurant owners to create entries for cuisines on the menu by specifying their names, descriptions and prices. Images can be uploaded to showcase the expected appearance of cuisines, which will be shown on the menu. A certain cuisine can be selected as the daily special with potential discounts, this information will be advertised to customers on the home page. 

### Order Management

This is the entry point for customers to place their orders. A table number will be required if customers choose to dine in. The restaurant owner and employees can place the order on behalf of customers. All submitted orders are visible to the owner and waitstaff, with the option to be completed once customers have completed their payments. Multiple orders created from the same table will be merged. 

## User Guide

### Login and Sign Up

The default URL for the application is [http://localhost:5173/](http://localhost:5173/). Upon opening the page, you will see a welcome message for the Restaurant Application. At the top, there is a navigation panel with default tabs: **Home**, **Order**, and **Profile**. However, if you are not logged in, clicking any of these tabs will redirect you to the Login page.

To begin, you need to create an account by clicking on the **Sign Up** button.

During the sign-up process, you can choose from three roles: **Customer**, **Owner**, or **Server**. Passwords are encrypted following standard practices, and you will be able to see the characters you type. After successfully creating an account, you will be redirected to the Login page.

The login form contains fields for your username and password. If the username does not exist, an error message will display: `"Invalid username"`. If the password is incorrect, the error will read: `"Invalid password"`. Once successfully logged in, you will be redirected to the Home page. At this point, the navigation panel may change depending on your user role. For example, if you are logged in as an **Owner**, you will now see additional options such as **Create Menu** and **Order**.
![Alt Text](https://github.com/chx93965/Restaurant-Management-System/blob/main/frontend/static/login.png)

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
![Alt Text](https://github.com/chx93965/Restaurant-Management-System/blob/main/frontend/static/rest_management.png)

### Menu Management

Once the owner selects a restaurant, they can begin making changes to the restaurant's menu. Clicking on the **Menu** tab in the navigation bar will take you to the **Menu Management** page. This page contains a form for adding new dishes, and below the form, it displays all the dishes currently on the restaurant’s menu.

After a dish is added, the owner has the option to either remove it from the menu or update its basic information—such as the price—by clicking the **Edit** button. Additionally, the owner can upload an image for the dish; otherwise, a default picture will be shown.

This step is crucial, as customers can only start placing orders once the menu has been created.
![Alt Text](https://github.com/chx93965/Restaurant-Management-System/blob/main/frontend/static/menu.png)

### Order Management

Both customers and servers can place orders. When accessing the order page, the menu for the selected restaurant will be displayed, including the price, images, and description of each dish. Users can choose between dine-in or takeout options. If dining in, a table must be selected. Users can order as many dishes as they want for a table, and all dish items for the same table will be grouped into one pending bill (note: these will not be added to the completed orders until finalized). Servers can complete the order once the customer makes the payment, after which the order will no longer be visible in the pending list. However, if the restaurant owner decides to download the balance sheet, the CSV file will include all completed orders and their corresponding payments.
![Alt Text](https://github.com/chx93965/Restaurant-Management-System/blob/main/frontend/static/order.png)

## Tech Stacks

The frontend was built with the React framework using JavaScript. Styling was implemented with Tailwind CSS and Shadcn. 

The backend was developed using Express.js with an SQLite3 database. All API endpoints follow RESTful API design principles.

In addition to the basic separation of backend and frontend components, the system also offers advanced features such as file handling and processing. This supports menu and restaurant image uploads and downloads, as well as balance sheet generation. 

Additionally, user authentication and authorization capabilities are provided. Depending on the type of account, different sets of operations will be enabled. For example, only restaurant owners can register restaurants and update menus.


### Restaurant API Endpoints

#### Create Restaurant
**POST** `/api/restaurants`
- Creates a new restaurant.
```json
{
  "restaurantName": "KFC",
  "address": "1 yonge",
  "postCode": "abc def"
}
```

#### Get All Restaurants
**GET** `/api/restaurants`
- Sampel response for retrieves a list of all restaurants.
```json
[
    {
        "id": 1,
        "restaurantName": "KFC at yonge",
        "address": "1 yonge aaa",
        "postcode": "abc def",
        "imageLocation": null
    },
    {
        "id": 3,
        "restaurantName": "McD 1",
        "address": "1 bay street 1",
        "postcode": "ABC DEF 1",
        "imageLocation": "/uploads/Restaurant/1743364193180.jpeg"
    }
]
```

#### Get Restaurant By ID
**GET** `/api/restaurants`
- Retrieves a specific restaurant by query.
```json
{
      "id": 1,
      "restaurantName": "KFC at yonge",
      "address": "1 yonge aaa",
      "postcode": "abc def",
      "imageLocation": null
  },
```

#### Update Restaurant
**PUT** `/api/restaurants/1`
- Updates details of a restaurant.
```json
{
  "restaurantName": "KFC at yonge",
  "address": "1 yonge",
  "postCode": "abc def"
}
```

#### Upload Restaurant Image
**POST** `/api/restaurants/upload`
- Uploads an image for a restaurant.

#### Download Restaurant Image
**POST** `/api/restaurants/download`
- Downloads the image for a restaurant.

### Table API Endpoints

#### Set Table Layout
**POST** `/api/restaurants/1/tables`
- Sets the table layout for a restaurant.
```json
{
  "tables": [2, 2, 2, 4, 4, 4, 10]
}
```

#### Get Table Layout
**GET** `/api/restaurants/1/tables`
- Retrieves the current table layout.
```json
[
    {
        "id": 1,
        "size": 2
    },
    {
        "id": 2,
        "size": 2
    }
]
```

#### Add Table
**POST** `/api/restaurants/1/tables/10`
- Adds a table of size 10 to the restaurant.

#### Delete Table
**DELETE** `/api/restaurants/tables/6`
- Deletes a table by ID.

### User API Endpoints

#### Get All Users
**GET** `/api/users`
- Retrieves a list of all users.
```json
[
    {
        "id": 1,
        "username": "jingxh",
        "email": "aaa@aaa.com",
        "role": "owner"
    },
    {
        "id": 2,
        "username": "Jingxian1",
        "email": "jingxianhou823@gmail.com",
        "role": "owner"
    }
]
```

#### Create User
**POST** `/api/users`
- Creates a new user.
```json
// Sample payload
{
    "username": "jindsagxh",
    "email": "aadfsa@aaa.com",
    "password": "123456",
    "role": "owner"
}
```

#### User Login
**GET** `/api/users/login`
- Authenticates a user login.

#### Assign Ownership
**POST** `/api/users/1/1`
- Assigns a restaurant to a user.

#### Get Owned Restaurants
**GET** `/api/users/{userId}`
- Retrieves restaurants owned by a user.
```json
// Sample response
 [
        {
            "id": 3,
            "restaurantName": "McD 1",
            "address": "1 bay street 1",
            "postcode": "ABC DEF 1",
            "imageLocation": "/uploads/Restaurant/1743364193180.jpeg"
        },
        {
            "id": 4,
            "restaurantName": "McD",
            "address": "1 bay street",
            "postcode": "ABC DEF",
            "imageLocation": "/uploads/Restaurant/1743554751591.png"
        }
    ]
```

### Menu API Endpoints

#### Create Dish
**POST** `/api/menus/dish`
- Adds a new dish to the menu.
```json
// Sample payload
{
  "dishName": "mango salad",
  "dishDescription": "this is salad",
  "dishPrice": "10.99",
  "restaurantId": 1
}
```


#### Get Dishes by Restaurant
**GET** `/api/menus/dish/{restaurantId}`
- Retrieves dishes filtered by restaurant.
```json
// Sample payload
[
    {
        "id": 26,
        "dishName": "Grilled Salmon with Lemon Butter",
        "dishDescription": "The Fresh Atlantic salmon fillet, perfectly grilled and topped with a zesty lemon butter sauce. Served with garlic mashed potatoes and sautéed asparagus.",
        "price": 22.99,
        "imageLocation": "/uploads/Image/1743960657551.jpg"
    },
    {
        "id": 27,
        "dishName": "Truffle Mushroom Risotto",
        "dishDescription": "A creamy Arborio rice risotto infused with white truffle oil, wild mushrooms, and Parmesan cheese. Garnished with fresh parsley and served with toasted baguette slices.",
        "price": 18.99,
        "imageLocation": "/uploads/Image/1743960742841.jpg"
    }
]
```

#### Add Dish to Restaurant
**POST** `/api/menus`
- Links a dish to a restaurant.
```json
{
  "restaurantId": 1,
  "dishId": 1
}
```

#### Upload Dish Image
**POST** `/api/menus/{dishId}/upload`
- Uploads an image for a dish.

### Download Dish Image
**POST** `/api/menus/{dishId}/download`
- Downloads the dish image.
```json
{
  "restaurantId": 1,
  "dishId": 1
}
```

### Order API Endpoints

#### Create Order
**POST** `/api/orders`
- Creates a new order.
```json
{
  "restaurantId": 1,
  "tableId": 1,
  "dishes": [
    {
      "dishId": 1,
      "quantity": 1
    }
  ]
}
```

#### Add Items to Order
**POST** `/api/orders`
- Adds dishes to an existing order.

#### Complete the Order
**PATCH** `/api/orders/{orderId}/complete`
- Marks the order as complete.

#### Delete Order
**DELETE** `/api/orders/{orderId}`
- Deletes an existing order.

#### Remove Items from Order
**DELETE** `api/order/{orderId}/items/{itemId'}`
- Removes specific dishes from the order.

#### Get Pending Order
**GET** `/api/orders/{resaurantId}/pending`
- Retrieves the pending order for a restaurant

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




## Development Guide

Before running the project, ensure you have the following installed:

- **Node.js** (v22.13.1)  
  Check by running:
  ```bash
  node -v
  ```

- **npm** (v10.9.2)  
  Check by running:
  ```bash
  npm -v
  ```

>Note: This project uses **SQLite3**, so there is **no need to set up PostgreSQL**.

### Getting the Code

You can obtain the project code in one of two ways:

#### Option 1: Clone the Repository

```bash
git clone https://github.com/chx93965/Restaurant-Management-System.git
```

#### Option 2: Download the ZIP

If the code has been uploaded as a zip file, simply unzip it to your desired directory.

### Running the Application

Make sure that ports **5000** and **5173** are free on your local machine.

#### 1. Start the Backend

```bash
cd backend
npm install
node server.js
```

This starts the backend server at `http://localhost:5000`.

#### 2. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.


## Individual Contribution

### Jingxian Hou

I contributed to building the core user authentication functionalities, including user sign-up and login. This involved creating a registration page with input validations to ensure unique email addresses and usernames, as well as implementing backend verification to match the submitted credentials against stored user records during login.

Additionally, I developed features for restaurant and menu management. This includes API endpoints for creating restaurants, uploading restaurant images, selecting a restaurant, and generating a CSV-format balance sheet. On the frontend, I built the restaurant menu page, where users can create and update dishes, upload dish images, and view all menu items on the order page. I handled both the frontend components and backend logic for these features.

To enhance user experience, I also implemented small but impactful improvements, such as redirecting users to the login page if they are not authenticated, regardless of which action they try to take. Furthermore, any updates to restaurant metadata or images are reflected in real-time on the UI without requiring a page refresh.

### Hanxiao Chang

I was in charge of designing the frontend structure by mapping webpages to their routes, essential components to certain pages, and service providers to the backend APIs. I also specified the transactions between webpages, and particular data flows regarding user experience. 

I built up the order page with functionalities of showcasing and selecting cuisines, modifying the quantities, and generating summaries for the bills. 

I established the user authorization logic, where access to certain pages, or certain elements of a page, is restricted based on user roles, for which I created certain entries in the signup process. 

I further organized the user interface in terms of the page layout, styles, appearance, and visible behaviours of page elements, including links, buttons, and forms.


## Lessons Learned

One important lesson learned from building this application is to properly design the system architecture before jumping into implementation. Without a solid design, making changes later, especially to the database schema, can become extremely difficult and time-consuming. For example, in the initial design, the `user` table included a field to indicate the restaurant that a user owns. Later, we realized that an owner may manage multiple restaurants. This required us to normalize the schema and introduce a new table to map users to restaurant IDs. This change significantly impacted how the backend was structured. If the APIs and schema had been carefully planned from the beginning, the development process would have been more straightforward and less prone to refactoring.

Additionally, the order of development matters in terms of the priorities of frontend and backend implementations. A good practice we applied in this project is to schedule the entire development phase in three steps, where the basic CRUD operations were established first, then we jumped into designing all the webpages, from which the data flow became clearer and more requirements from the backend emerged, in such a way the backend functionalities could be further enriched. 

## Conclusion

In conclusion, this application serves as a strong proof of concept that demonstrates how digital solutions can significantly improve the efficiency of restaurant operations. It helps owners, servers, and even customers perform day-to-day tasks more effectively. By streamlining operations and reducing manual errors, the application has the potential to save users hundreds of hours each year and make their daily work more accurate and manageable.
