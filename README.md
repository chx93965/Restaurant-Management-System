# Restaurant Management System

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
