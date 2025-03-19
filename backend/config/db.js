const sqlite3 = require('sqlite3').verbose();

// Open database connection
const db = new sqlite3.Database('./restaurant.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create necessary tables if they don't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS menus (
        restaurantId INTEGER NOT NULL,
        dishId INTEGER NOT NULL,
        PRIMARY KEY (restaurantId, dishId)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS dishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dishName TEXT NOT NULL,
        dishDescription TEXT NOT NULL,
        price REAL NOT NULL,
        imageLocation TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS restaurants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurantName TEXT NOT NULL,
        address TEXT NOT NULL,
        postcode TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('owner', 'waiter', 'waitress'))
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurantId INTEGER NOT NULL,
        orderType TEXT CHECK(orderType IN ('dine-in', 'takeout', 'delivery')) NOT NULL,
        tableId INTEGER NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        completedAt DATETIME,
        CONSTRAINT fk_orders_restaurant FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
        CONSTRAINT fk_orders_table FOREIGN KEY (tableId) REFERENCES tables(id) ON DELETE SET NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        dishId INTEGER NOT NULL,
        CONSTRAINT fk_orderItems_order FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        CONSTRAINT fk_orderItems_dish FOREIGN KEY (dishId) REFERENCES dishes(id) ON DELETE CASCADE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS restaurantOwners (
        userId INT NOT NULL,
        restaurantId INT NOT NULL,
        PRIMARY KEY (userId, restaurantId),
        CONSTRAINT fk_owner_user FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
        CONSTRAINT fk_owner_restaurant FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE
    );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS tables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            size INTEGER NOT NULL CHECK (size > 0),
            restaurantId INTEGER NOT NULL,
            CONSTRAINT fk_tables_restaurant FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE
        );
    `);
});

module.exports = db;
