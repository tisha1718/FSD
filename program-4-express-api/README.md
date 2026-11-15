# Program 4: Express.js REST API with JWT, Bcrypt & RBAC

**Course Outcome Covered:**
- **CO5:** Build secure RESTful APIs using Express.js, featuring modular routing, custom middleware pipelines, JWT token authentication, bcrypt password hashing, payload validation, and Role-Based Access Control (RBAC).

---

## 1. Aim
To construct an enterprise-grade Express.js REST API for parking management, implementing complete CRUD endpoints, request logging, centralized error handling, JWT-based user authentication, role-based protection (Admin vs User), and business logic for overlapping reservation collision prevention.

---

## 2. API Endpoints
| HTTP Method | Route | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with hashed password | Public |
| `POST` | `/api/auth/login` | Authenticate and issue Bearer JWT | Public |
| `GET` | `/api/auth/me` | Fetch currently logged-in profile | User &amp; Admin |
| `GET` | `/api/locations` | List all hubs with free slot counts | Public |
| `POST` | `/api/locations` | Add new location | Admin Only |
| `GET` | `/api/slots` | List parking slots | Public |
| `POST` | `/api/slots` | Add slot to location | Admin Only |
| `POST` | `/api/bookings` | Book slot (prevents collisions, calculates total) | User &amp; Admin |
| `GET` | `/api/bookings/my-bookings` | List authenticated user's bookings | User &amp; Admin |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking and release slot | Owner / Admin |
| `GET` | `/api/admin/analytics` | View occupancy, total revenue, metrics | Admin Only |
| `GET` | `/api/admin/all-bookings` | View all system reservations | Admin Only |

---

## 3. How to Run on Windows

1. Navigate to `program-4-express-api`:
```powershell
cd program-4-express-api
```

2. Install dependencies:
```powershell
npm.cmd install
```

3. Start the Express server:
```powershell
npm.cmd start
```

4. Run the automated test script in a second terminal:
```powershell
node test-api.js
```
Default accounts:
- **Admin:** `admin@parkify.com` / `admin123`
- **User:** `user@parkify.com` / `user123`
