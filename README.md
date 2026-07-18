# 🍽️ DineEase

DineEase is a premium, full-stack web application designed for a single restaurant to simplify table reservations and daily restaurant management operations. 

Built using the **MERN** stack (MongoDB/JSON DB, Express, React, Node.js) with a custom modern dark-luxury aesthetic, it features a complete self-contained environment that works out of the box with zero database configuration.

---

## 🌟 Key Features

1. **🔐 Secure Authentication (JWT)**: Login and register flow with encrypted passwords (bcryptjs) and token storage.
2. **📅 Online Table Reservation**: Customers can request seating bookings. Features an **intelligent table auto-assignment algorithm** that selects the smallest available table fitting the party size.
3. **🍔 Digital Menu Management**: Searchable and filterable menu divided into Appetizers, Main Course, Desserts, and Beverages.
4. **🏢 Role-Based Dashboards**:
   - **👤 Customer**: Submit reservations, view booking history, cancel pending reservations, and write reviews.
   - **👨🍳 Staff**: Monitor today's reservations list, update statuses, assign tables, and toggle table occupancies.
   - **👨💼 Admin**: Access key analytics and trends, CRUD tables, CRUD menu items, modify registered user roles, and override any reservations.
5. **📊 Dashboard Analytics**: Custom metrics panels for admins tracking reservation histories, review scores, and seating.
6. **💾 Zero-Config Database Fallback**: Connects to your local or Atlas MongoDB. If none is found, it automatically falls back to an in-memory/JSON-file database, so the app launches instantly with zero configuration!

---

## 🔑 Demo Test Accounts

The application automatically seeds the database with pre-configured accounts on first startup. You can use these credentials to explore the different dashboards:

| Role | Email | Password | What You Can Access |
| :--- | :--- | :--- | :--- |
| **👨💼 Administrator** | `admin@dineease.com` | `password123` | Analytics, Seating CRUD, Menu CRUD, User Role editor, Bookings override |
| **👨🍳 Staff** | `staff@dineease.com` | `password123` | Seating allocations, Reservation validation, Table check-ins |
| **👤 Customer** | `customer@dineease.com` | `password123` | Browse digital menu, Request bookings, Cancel bookings, Submit reviews |

> 💡 **Tip:** You can also register a **new** account on the signup page and select your desired role from the role selector dropdown to test roles instantly!

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- `npm` (packaged with Node.js)

### Installation & Launch

1. **Clone or navigate** to the project root folder.
2. **Install all dependencies** (root, frontend, and backend packages) with a single command:
   ```bash
   npm run install-all
   ```
3. **Run the full-stack application concurrently** (runs both dev servers together):
   ```bash
   npm run dev
   ```
4. **Access the application**:
   - **Frontend React Client**: [http://localhost:5173](http://localhost:5173)
   - **Backend Express API**: [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Project Structure

```text
DineEase/
├── backend/
│   ├── config/             # DB connection & database seeding scripts
│   ├── data/               # Local JSON database storage (fallback)
│   ├── middleware/         # JWT Auth and Role verification
│   ├── models/             # Database model schema wrappers
│   ├── routes/             # API Endpoints (Auth, Tables, Bookings, Menu, Reviews)
│   ├── .env                # Server configuration (PORT, JWT_SECRET, MONGO_URI)
│   └── server.js           # Server entry point
├── frontend/
│   ├── public/             # Static page assets
│   ├── src/
│   │   ├── components/     # Reusable widgets (Navbar, Footer, Sub-dashboards)
│   │   ├── context/        # Global AuthSession provider
│   │   ├── pages/          # Page views (Home, Menu, Reservation Form, Dashboard)
│   │   ├── utils/          # HTTP request handlers
│   │   ├── App.jsx         # App router
│   │   ├── index.css       # Custom design system stylesheet
│   │   └── main.jsx        # React DOM render mount
│   └── index.html          # Web document structure
├── package.json            # Unified workspace execution scripts
└── README.md               # User documentation
```

---

## 📡 API Reference endpoints

- **`POST /api/auth/register`**: Signup new user
- **`POST /api/auth/login`**: Signin and fetch JWT
- **`GET /api/auth/me`**: Get current profile
- **`GET /api/menu`**: Retrieve digital menu dishes
- **`POST /api/reservations`**: Submit table reservation request
- **`PUT /api/reservations/:id/status`**: Staff action to change table/status
- **`GET /api/analytics/dashboard`**: Fetch overview metrics (Admins/Staff)
