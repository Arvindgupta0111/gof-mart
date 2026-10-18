
# GOF Mart 🛒

GOF Mart is a full-stack grocery e-commerce web application.

## Features
- User registration and login
- JWT-based authentication
- Product listing and seller product management
- Shopping cart with quantity and total price
- Checkout with Cash on Delivery (COD)
- Order storage in MongoDB
- My Orders page with order status

## Tech Stack
- Frontend: React, Vite, CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT

## Project Structure
- `frontend/` — React application
- `backend/` — Express API and database models

## Prerequisites
- Node.js and npm
- MongoDB running locally

## Setup

### 1. Backend
Open a terminal:

```bash
cd backend
npm install
```

Create `backend/.env` using `backend/.env.example`, then configure your local MongoDB URI, port, and a strong random JWT secret.

Start the backend:

```bash
node server.js
```

### 2. Frontend
Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

On Windows PowerShell, if needed, use `npm.cmd run dev`.

## Local URLs
- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health

## Order and Payment
Checkout currently supports Cash on Delivery (COD). Real online payment integration is not included.

## Security
- Do not commit `.env` files or secrets.
- Use a strong, unique JWT secret.
- Configure production CORS and secure authentication before deployment.
