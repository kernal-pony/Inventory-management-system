# Inventory Management System

A web-based Inventory Management System built using React, Node.js, Express and PostgreSQL.

The application helps manage products, suppliers and stock movements through a simple dashboard.

## Features

- User Registration and Login
- Dashboard with inventory summary
- Add, Edit and Delete Products
- Manage Suppliers
- Stock In and Stock Out
- View Stock Movement History
- Low Stock Monitoring

## Technologies Used

**Frontend**
- React
- Vite
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

## Project Structure

```text
Inventory-management-system/
│
├── client/
│   └── src/
│       ├── pages/
│       └── ...
│
├── server/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       └── ...
│
└── README.md


Installation and Setup
1. Clone the repository
git clone https://github.com/kernal-pony/Inventory-management-system.git
cd Inventory-management-system


2. Backend Setup
cd server
npm install


Create a .env file inside the server folder:
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key


Start the backend:
npm run dev


3. Frontend Setup

Open another terminal:
cd client
npm install


Create a .env file inside the client folder:
VITE_API_URL=http://localhost:5000


Start the frontend:
npm run dev


Database
The project uses PostgreSQL for storing user, product, supplier and stock movement information.
Author
Arnab Lala
25MCI10232
25MAM 1(A)
