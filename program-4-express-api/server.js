/**
 * PARKIFY - Program 4: Express.js REST API Server (CO5)
 * Fully compliant with Course Outcome 5:
 * - Express routing (GET, POST, PUT, DELETE)
 * - Custom request logging middleware
 * - JWT authentication & bcrypt password hashing
 * - Input validation & centralized error handling
 * - Role-Based Access Control (RBAC: Admin vs User)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Base route & API Health
app.get('/', (req, res) => {
    res.json({
        name: 'PARKIFY Express.js REST API',
        program: 'Program 4 (CO5)',
        version: '1.0.0',
        status: 'ONLINE',
        endpoints: {
            auth: '/api/auth (register, login, me)',
            locations: '/api/locations (GET, POST, PUT, DELETE)',
            slots: '/api/slots (GET, POST, PUT, DELETE)',
            bookings: '/api/bookings (my-bookings, create, cancel)',
            admin: '/api/admin (analytics, all-bookings, users, status)'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Endpoint not found: ${req.method} ${req.originalUrl}`
    });
});

// Centralized Error Handling Middleware (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`PARKIFY - Program 4 (Express.js API) running on port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`CO5: Express, JWT Auth, Bcrypt, Middleware & RBAC`);
    console.log(`Default Credentials:`);
    console.log(`  Admin: admin@parkify.com / admin123`);
    console.log(`  User:  user@parkify.com  / user123`);
    console.log(`=======================================================`);
});
