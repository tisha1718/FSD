# PARKIFY – Smart Parking Management & Slot Booking Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-black.svg)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-blue.svg)](https://sequelize.org/)

**PARKIFY** is an enterprise-grade, internship-ready Smart Parking Management and Slot Reservation Platform. Engineered to resolve urban parking congestion, it provides real-time bay availability, transaction-level double-booking prevention, automated tariff calculation, and a unified executive operator portal.

The repository is organized into **five progressive, independently runnable programs** covering **Course Outcomes CO1 through CO6**.

---

## 📁 Repository Structure

```
PARKIFY/
├── program-1-vanilla-js/          # Program 1: HTML5, CSS3 & Client JS (CO1, CO2)
│   ├── index.html                 # Semantic UI with slot matrix & reservation card
│   ├── styles.css                 # Modern CSS Grid/Flexbox with variables
│   ├── app.js                     # DOM manipulation, Fetch API, validation, async/await
│   ├── server.js                  # Pure Node.js HTTP server for GET/POST APIs
│   └── README.md
│
├── program-2-react/               # Program 2: React Component Architecture (CO3)
│   ├── src/                       # Components: Navbar, SlotGrid, BookingModal, Stats
│   ├── package.json               # Vite + React 18 configuration
│   └── README.md
│
├── program-3-core-node/           # Program 3: Core Node.js HTTP & Streams (CO4)
│   ├── server.js                  # Native HTTP, fs, path, EventEmitter & Streams (No Express)
│   ├── data/bookings.json         # JSON persistence file
│   ├── public/                    # Interactive CRUD testing console
│   ├── test-crud.js               # Automated CRUD test suite
│   └── README.md
│
├── program-4-express-api/         # Program 4: Express REST API & RBAC (CO5)
│   ├── server.js                  # Express router, logging middleware, errorHandler
│   ├── routes/                    # Auth, Locations, Slots, Bookings, Admin
│   ├── middleware/                # JWT verify, Bcrypt, Validator, Logger
│   ├── test-api.js                # Automated end-to-end API test suite
│   └── README.md
│
├── program-5-fullstack/           # Program 5: Integrated Full Stack Web App (CO6)
│   ├── backend/                   # Express, Sequelize ORM (PostgreSQL & SQLite fallback)
│   │   ├── config/database.js     # Dual DB connection pool & dialect switcher
│   │   ├── models/                # User, ParkingLocation, ParkingSlot, Booking
│   │   ├── controllers/           # Transactional booking logic & analytics
│   │   ├── seeders/seed.js        # Auto database seeding on first boot
│   │   └── server.js              # Port 5000 API server
│   ├── frontend/                  # React 18 + Vite + Context API (Port 5173)
│   │   ├── src/pages/             # Landing, Login, Register, Dashboard, Passes, Admin, Profile
│   │   ├── src/context/           # AuthContext (JWT session) & ToastContext
│   │   └── src/services/api.js    # Centralized HTTP client
│   └── README.md
│
├── documentation/                 # Comprehensive Technical & Academic Documentation
│   ├── ACADEMIC_REPORT_CO1_CO6.md # Full Aim, Theory, Implementation, Results & Conclusion
│   ├── ER_DIAGRAM_SCHEMA.md       # Mermaid ER Diagram, table constraints, relationships
│   ├── API_DOCUMENTATION.md       # Endpoints, sample request & response JSON payloads
│   ├── POSTMAN_COLLECTION_GUIDE.md# Testing guide with pre-request scripts
│   ├── SCREENSHOT_CHECKLIST.md    # Guide for report & portfolio screenshots
│   ├── DEPLOYMENT_GUIDE.md        # Render (Backend + PostgreSQL) & Vercel (Frontend)
│   └── LINKEDIN_SHOWCASE.md       # Professional post for LinkedIn portfolio
│
├── screenshots/                   # Project screenshots directory
└── README.md
```

---

## 🎯 Course Outcome (CO1 – CO6) Mapping

| Outcome | Focus Area | Implemented In | Highlights |
| :---: | :--- | :--- | :--- |
| **CO1** | Responsive Web Design | Program 1 | HTML5 semantic structure, CSS custom properties, CSS Grid parking bays. |
| **CO2** | Client Scripting & Async | Program 1 | DOM event delegation, regex validation, Fetch API, `async/await`. |
| **CO3** | Front-End Frameworks | Program 2 | React 18 components, props, hooks (`useState`, `useEffect`), controlled inputs. |
| **CO4** | Server-Side Core Runtime | Program 3 | Native Node.js `http`, non-blocking `fs`, `EventEmitter`, stream piping. |
| **CO5** | RESTful Web Services | Program 4 | Express.js, JWT bearer tokens, salted Bcrypt hashes, RBAC protection. |
| **CO6** | Full Stack Integration | Program 5 | React + Express + Sequelize + PostgreSQL/SQLite, ACID transactions. |

---

## 🚀 Quick Start Guide (Windows Terminal)

### Program 1: Vanilla JavaScript (Port 3001)
```powershell
cd program-1-vanilla-js
node server.js
# Open http://localhost:3001 or double-click index.html
```

### Program 2: React Component SPA (Port 5174)
```powershell
cd program-2-react
npm.cmd install
npm.cmd run dev
# Open http://localhost:5174
```

### Program 3: Core Node.js HTTP Server & CRUD (Port 3003)
```powershell
cd program-3-core-node
node server.js
# Open http://localhost:3003
# To run automated CRUD test suite: node test-crud.js
```

### Program 4: Express.js REST API (Port 4000)
```powershell
cd program-4-express-api
npm.cmd install
npm.cmd start
# To run automated API test suite: node test-api.js
```

### Program 5: Integrated Full Stack Platform (Backend: 5000, Frontend: 5173)
**Terminal 1 (Backend):**
```powershell
cd program-5-fullstack/backend
npm.cmd install
npm.cmd start
```

**Terminal 2 (Frontend):**
```powershell
cd program-5-fullstack/frontend
npm.cmd install
npm.cmd run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Default Evaluation Credentials
| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@parkify.com` | `admin123` | Executive analytics, inventory provisioning, status override |
| **User** | `user@parkify.com` | `user123` | Bay reservations, pass tracking, cancellations |

---

## 🛡️ Database Transaction & Concurrency Guarantee
To ensure zero double-booking collisions under concurrent web traffic, all reservations in Program 5 execute within an isolated **`sequelize.transaction()`**. If an overlapping reservation is detected for the same slot and date, the transaction rolls back cleanly with HTTP `409 Conflict`.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
