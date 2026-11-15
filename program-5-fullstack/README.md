# Program 5: PARKIFY Full Stack Web Application

**Course Outcome Covered:**
- **CO6:** Build and deploy a full stack web application integrating a modern React frontend, Express.js REST API backend, relational database schema with Sequelize ORM (PostgreSQL / SQLite fallback), JWT authentication, transaction-level double-booking prevention, and role-based admin controls.

---

## 1. Aim
To architect and implement an enterprise-grade, internship-ready parking management and reservation platform with complete frontend-backend data synchronization, database transaction integrity, automated pricing calculations, responsive UI, and administrative analytics.

---

## 2. Full Stack Architecture
```
PARKIFY Full Stack (Program 5)
├── frontend/ (React 18 + Vite + Context API)
│   ├── AuthContext (JWT management & session restoration)
│   ├── ToastContext (Real-time alert notifications)
│   ├── Dashboard (Search, city filter, vehicle type, interactive bay matrix)
│   ├── BookingModal (Strict validation & dynamic pricing calculation)
│   ├── MyBookings (Pass cards, instant cancellation & bay release)
│   ├── AdminDashboard (Analytics, inventory management, user directory)
│   └── Profile (Account management)
└── backend/ (Node.js + Express + Sequelize ORM)
    ├── Models (User, ParkingLocation, ParkingSlot, Booking)
    ├── Transactions (Atomically verify availability & prevent collisions)
    ├── Security (Bcrypt password hashing & Bearer JWT middleware)
    └── Database (PostgreSQL production-ready with embedded SQLite fallback)
```

---

## 3. How to Run on Windows

### Step 1: Start Backend (Port 5000)
```powershell
cd program-5-fullstack/backend
npm.cmd install
npm.cmd start
```
*Note: The backend automatically synchronizes all database tables and seeds initial users and parking hubs on first boot!*

### Step 2: Start Frontend (Port 5173)
In a second terminal window:
```powershell
cd program-5-fullstack/frontend
npm.cmd install
npm.cmd run dev
```

Open browser at `http://localhost:5173`.

### Pre-Seeded Evaluation Accounts:
- **Admin:** `admin@parkify.com` / `admin123`
- **User:** `user@parkify.com` / `user123`
