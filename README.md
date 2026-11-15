# PARKIFY – Smart Parking Management & Slot Booking Platform

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Express](https://img.shields.io/badge/Express-4.x-black.svg)
![Sequelize](https://img.shields.io/badge/Sequelize-6.x-blue.svg)

**PARKIFY** is a Smart Parking Management and Slot Reservation Platform designed to simplify urban parking through digital slot discovery, booking management, availability tracking and administrative control.

The project consists of five independently runnable programs covering the six course outcomes (CO1–CO6), along with an integrated full-stack application.

---

## 📌 Project Overview

PARKIFY provides a centralized platform where users can search parking locations, check available slots, make reservations and manage their bookings.

Administrators have separate access to manage parking locations, parking slots, users, reservations and system analytics.

### Key Features

- User registration and secure login
- Separate Admin and User dashboards
- Role-Based Access Control (RBAC)
- Parking location search and filtering
- Parking slot availability management
- Slot booking and cancellation
- Booking history and unique booking IDs
- Parking fee calculation
- Admin parking and booking management
- Responsive user interface
- REST API integration
- Database persistence

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript, React |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Sequelize |
| Authentication | JWT, bcrypt |
| API | REST API, Fetch API |
| Development Tools | VS Code, Postman, Git, GitHub |
| Deployment Preparation | Vercel, Render |

---

## 📁 Repository Structure

```text
PARKIFY/
│
├── program-1-vanilla-js/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── server.js
│   └── README.md
│
├── program-2-react/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── program-3-core-node/
│   ├── server.js
│   ├── data/
│   ├── public/
│   ├── test-crud.js
│   └── README.md
│
├── program-4-express-api/
│   ├── server.js
│   ├── routes/
│   ├── middleware/
│   ├── test-api.js
│   └── README.md
│
├── program-5-fullstack/
│   ├── frontend/
│   │   ├── src/
│   │   └── package.json
│   │
│   └── backend/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── seeders/
│       └── server.js
│
├── documentation/
│   ├── ACADEMIC_REPORT_CO1_CO6.md
│   ├── ER_DIAGRAM_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── POSTMAN_COLLECTION_GUIDE.md
│   ├── SCREENSHOT_CHECKLIST.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── LINKEDIN_SHOWCASE.md
│
├── screenshots/
├── README.md
└── .gitignore
```

---

## 🎯 Course Outcome Mapping (CO1–CO6)

| CO | Course Outcome | Program | Implementation |
|---|---|---|---|
| CO1 | Responsive Web Design | Program 1 | HTML5, CSS3, Flexbox, Grid and responsive layouts |
| CO2 | Client-Side Scripting | Program 1 | DOM manipulation, events, validation, Fetch API and async/await |
| CO3 | Frontend Framework | Program 2 | React components, JSX, props, state, hooks and routing |
| CO4 | Core Node.js | Program 3 | HTTP, File System, Path, Streams and EventEmitter |
| CO5 | REST API Development | Program 4 | Express.js, CRUD, middleware, JWT and bcrypt |
| CO6 | Full Stack Integration | Program 5 | React, Express, Sequelize and PostgreSQL |

---

## 🚀 Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js (v18 or above)
- npm
- Git
- PostgreSQL (for the PostgreSQL configuration)
- Visual Studio Code

### Program 1 – Vanilla JavaScript

```powershell
cd program-1-vanilla-js
node server.js
```

Open:

`http://localhost:3001`

### Program 2 – React Application

```powershell
cd program-2-react
npm.cmd install
npm.cmd run dev
```

Open:

`http://localhost:5174`

### Program 3 – Core Node.js Server

```powershell
cd program-3-core-node
node server.js
```

Open:

`http://localhost:3003`

Run CRUD tests:

```powershell
node test-crud.js
```

### Program 4 – Express.js REST API

```powershell
cd program-4-express-api
npm.cmd install
npm.cmd start
```

Run API tests:

```powershell
node test-api.js
```

### Program 5 – Full Stack Application

**Terminal 1 – Backend**

```powershell
cd program-5-fullstack/backend
npm.cmd install
npm.cmd start
```

**Terminal 2 – Frontend**

```powershell
cd program-5-fullstack/frontend
npm.cmd install
npm.cmd run dev
```

Open:

`http://localhost:5173`

Note: Confirm the actual scripts and port configurations in each program's package.json and README before running. PostgreSQL must be configured for the selected database environment.

---

## 👥 User Roles and Permissions

### Normal User

- Register and log in.
- Search parking locations.
- View available slots.
- Book parking slots.
- View booking history.
- Cancel eligible bookings.
- Manage personal profile.

### Administrator

- Access a separate Admin Dashboard.
- View registered users.
- Manage parking locations.
- Add, edit and remove parking slots.
- View and manage all bookings.
- Update booking statuses.
- Monitor occupancy statistics.
- View revenue analytics.

Admin privileges are protected through backend authorization and role-based access control.

---

## 🗄️ Database Design

The integrated application uses the following primary entities:

| Model | Description |
|---|---|
| User | Stores user details and account roles |
| ParkingLocation | Stores parking location information |
| ParkingSlot | Stores individual parking slot details |
| Booking | Stores reservation details and booking status |

### Main Relationships

- One User can have multiple Bookings.
- One ParkingLocation can contain multiple ParkingSlots.
- One ParkingSlot can have multiple Bookings over different time periods.
- Each Booking belongs to one User and one ParkingSlot.

---

## 🔐 Security

Security features include:

- JWT-based authentication.
- bcrypt password hashing.
- Role-based authorization.
- Protected admin endpoints.
- Backend input validation.
- Environment-based configuration.
- CORS configuration.
- Secret files excluded through `.gitignore`.

Never commit actual passwords, API keys, JWT secrets or database credentials.

---

## 🧪 Testing

The application should be tested for:

1. User registration and login.
2. Admin authentication and authorization.
3. Parking location search.
4. Slot availability.
5. Booking creation.
6. Booking cancellation.
7. CRUD operations.
8. Invalid input handling.
9. Unauthorized API access.
10. Database persistence.
11. Prevention of overlapping bookings.

Only verified tests should be reported as successfully completed.

---

## 📚 Documentation

Additional documentation is maintained in the `documentation/` directory.

- Academic report for CO1–CO6
- Database schema and ER diagram
- REST API documentation
- Postman testing guide
- Screenshot checklist
- Deployment preparation guide
- LinkedIn project showcase

---

## 🌐 Deployment

The project is prepared for deployment using:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL |

Deployment URLs will be added here after successful deployment.

---

## 🎓 Academic Information

**Project Name:** PARKIFY – Smart Parking Management & Slot Booking Platform

**Department:** Artificial Intelligence and Data Science

**Project Type:** Full Stack Web Development

**Course Outcomes:** CO1, CO2, CO3, CO4, CO5 and CO6

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Project Purpose

PARKIFY was developed as an academic project to demonstrate practical implementation of frontend development, React, Node.js, Express.js, REST APIs, database integration and full-stack application development.

The project aims to combine academic learning with real-world software development practices.