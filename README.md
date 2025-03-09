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

## File Storage Requirements

The system will support file storage for:
- Uploading images of menu items.
- Uploading and downloading PDF versions of menus and balance sheets.

This project aims to enhance restaurant management by providing a comprehensive digital solution, reducing human errors, and streamlining operations.

