# LUMERA — Luxury Artificial Jewellery eCommerce

A production-ready full-stack eCommerce platform for luxury artificial jewellery, built with **React**, **Node.js/Express**, **MongoDB**, **JWT Authentication**, **Cloudinary**, and **Razorpay**.

---

## Project Structure

```
lumera/
├── backend/         → Node.js + Express.js REST API
│   ├── config/      → MongoDB, Cloudinary
│   ├── controllers/ → Auth, Product, Category, Order, Upload
│   ├── middleware/  → auth, error
│   ├── models/      → User, Product, Category, Order, Review
│   ├── routes/      → API Route Definitions
│   ├── server.js    → Express Entry Point
│   └── .env         → Environment Variables (fill these in!)
└── frontend/        → React.js + Vite + Tailwind CSS
    ├── src/
    │   ├── context/ → AuthContext, CartContext
    │   ├── components/ → Navbar, Footer, ProductCard, Guards
    │   └── pages/   → Home, Shop, Details, Cart, Checkout, Admin...
    └── index.html
```

---

## Setup Instructions

### Step 1 — Install Prerequisites

| Tool | Download |
|------|---------|
| Node.js 18+ | https://nodejs.org |
| MongoDB Atlas (Free) | https://www.mongodb.com/atlas |
| Cloudinary (Free) | https://cloudinary.com |
| Razorpay (Test Mode) | https://razorpay.com |

---

### Step 2 — Configure Backend Environment

Open `backend/.env` and fill in your credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/lumera
JWT_SECRET=any_strong_secret_key_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

### Step 3 — Run the Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at **http://localhost:5000**

---

### Step 4 — Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

---

## First Admin Setup

1. Register normally at http://localhost:3000/login
2. Open MongoDB Atlas → `lumera` database → `users` collection
3. Find your user document and change `"role": "CUSTOMER"` to `"role": "ADMIN"`
4. Log out and log back in
5. You will see the **Admin** button in the navbar!

---

## REST API Summary

| Method | Endpoint | Auth |
|--------|---------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/profile` | Required |
| POST | `/api/auth/wishlist/:id` | Required |
| GET | `/api/products?search=&category=&sort=` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | ADMIN |
| PUT | `/api/products/:id` | ADMIN |
| DELETE | `/api/products/:id` | ADMIN |
| GET | `/api/categories` | Public |
| POST | `/api/categories` | ADMIN |
| DELETE | `/api/categories/:id` | ADMIN |
| POST | `/api/orders` | Customer |
| POST | `/api/orders/verify` | Customer |
| GET | `/api/orders` | Customer / Admin |
| PUT | `/api/orders/:id` | ADMIN |
| POST | `/api/upload` | ADMIN |

---

## Deployment

### Backend → Render.com

1. Push `backend/` to a GitHub repo
2. Create a new Web Service on Render
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add all environment variables from `.env`

### Frontend → Vercel.com

1. Change `http://localhost:5000` to your Render backend URL in all frontend files
2. Push `frontend/` to GitHub
3. Import to Vercel — it auto-detects Vite React
4. Deploy ✅

---

## Default Pages

| Path | Page |
|------|------|
| `/` | Home |
| `/shop` | Catalogue |
| `/product/:id` | Product Details |
| `/cart` | Shopping Bag |
| `/checkout` | Checkout |
| `/login` | Login / Register |
| `/profile` | User Dashboard |
| `/admin` | Admin Dashboard (ADMIN only) |
| `/order-success` | Order Confirmation |
