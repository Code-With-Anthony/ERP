
# 🏢 Enterprise Resource Planner (ERP) - Simplified Inventory & Order Management

A full-stack ERP system focused on **Inventory and Order Management**, built with a **Node.js + Express** backend and a **React** frontend. This project is designed to strengthen **SQL proficiency** by using **raw SQL queries** for all backend operations and features a minimal UI for testing the core functionality.

---

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js, Typescript
- **Database**: PostgreSQL (Supabase), PG (For Connection)
- **Frontend**: React.js (Material UI), Zod, Tailwindcss, Typescript, Vite
- **API Tooling**: Postman (for testing)

---

## 🎯 Project Goals

- Build a working ERP backend with a strong focus on **raw SQL** (no ORMs).
- Implement CRUD operations for products, customers, and orders.
- Use **transactions** for multi-step order operations ensuring **data consistency**.
- Provide **reporting and analytics** using advanced SQL queries.
- Create a simple React frontend to interact with the backend.

---

## 🧩 Database Schema

### 📦 Products Table
- `product_id` (PK)
- `product_name`
- `description`
- `unit_price`
- `current_stock`
- `reorder_level`

### 👤 Customers Table
- `customer_id` (PK)
- `customer_name`
- `email` (unique)
- `phone_number`
- `address`

### 🧾 Orders Table
- `order_id` (PK)
- `customer_id` (FK)
- `order_date`
- `total_amount`
- `order_status` (e.g., `PENDING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)

### 📑 Order Items Table
- `order_item_id` (PK)
- `order_id` (FK)
- `product_id` (FK)
- `quantity`
- `unit_price_at_order`

---

## 📡 API Endpoints

### 🔹 Product Management
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /products/low-stock`

### 🔹 Customer Management
- `GET /customers`
- `GET /customers/:id`
- `POST /customers`
- `PUT /customers/:id`
- `DELETE /customers/:id`

### 🔹 Order Management
- `POST /orders` (Transactional)
- `GET /orders`
- `GET /orders/:id`
- `PUT /orders/:id/status`
- `DELETE /orders/:id` (Transactional)

### 🔹 Reports
- `GET /reports/customer-orders/:customerId`
- `GET /reports/product-sales`
- `GET /reports/daily-sales`

> ✅ All endpoints are implemented using **raw SQL** queries only.

---

## 🖥️ Frontend Overview

The frontend is a lightweight React application providing:
- Product listing and management
- Customer listing and management
- Order placement and status tracking
- Basic form inputs for interaction with APIs

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- PostgreSQL (or Supabase)
- npm / yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Code-With-Anthony/ERP.git
cd your-repo-name
````

### 2. Setup the Backend

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure `.env`

```
DATABASE_URL=your_postgres_connection_string
PORT=4000
PGHOST=your_postgress_transaction_pooler_host
PGPORT=your_postgress_transaction_pooler_port_number
PGDATABASE=postgress
PGUSER=your_postgress_transaction_pooler_username
PGPASSWORD=your_postgress_transaction_pooler_password
```

#### Run the Server

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Folder Structure

```
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── db/
│   ├── constants/
|   ├── controllers/
|   ├── types/
│   └── app.ts
│   └── server.ts
├── frontend/
│   └── src
│     ├── components/
│     ├── pages/
│     ├── schemas/
│     ├── types/
│   └── App.tsx
│   └── App.css
│   └── index.css
│   └── main.tsx
```

---

## 🧪 Testing

Use **Postman** or any REST client to test all endpoints.

---

## ✅ Features Summary

* ✅ Full CRUD on products, customers, and orders
* ✅ SQL transactions for safe order placement and cancellation
* ✅ Order status update rules (e.g., can't revert from DELIVERED to PENDING)
* ✅ Low stock alert endpoint
* ✅ Analytics reports using complex SQL joins and aggregations

---

## 📘 Learnings & Takeaways

* Mastered SQL JOINs, GROUP BY, and aggregate functions
* Improved understanding of transaction safety and rollback mechanisms
* Built modular REST APIs using Express and PostgreSQL
* Strengthened frontend-backend integration with a material UI

---

## 🙌 Acknowledgments

This project was completed as part of a week-long ERP challenge focused on backend system design and SQL mastery under mentorship.

---
