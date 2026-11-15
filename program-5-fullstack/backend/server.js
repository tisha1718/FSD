require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, User } = require('./models');
const seedDatabase = require('./seeders/seed');

const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Base route
app.get('/', (req, res) => {
    res.json({
        app: 'PARKIFY - Smart Parking Management System',
        program: 'Program 5: Full Stack Web Application (CO6)',
        database: process.env.DB_DIALECT || 'sqlite',
        status: 'ONLINE',
        endpoints: [
            '/api/auth',
            '/api/locations',
            '/api/slots',
            '/api/bookings',
            '/api/admin'
        ]
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

// Initialize DB and Start Server
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log(`Database connection established successfully. [Dialect: ${sequelize.getDialect()}]`);

        await sequelize.sync();
        console.log('Sequelize models synchronized.');

        // Auto-seed if database is empty
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('No users found. Running initial database seed...');
            await seedDatabase();
        }

        app.listen(PORT, () => {
            console.log(`=======================================================`);
            console.log(`PARKIFY Full Stack Backend (Program 5) running on port ${PORT}`);
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`CO6: React Frontend, Express Backend, Sequelize Database`);
            console.log(`Default Accounts:`);
            console.log(`  Admin: admin@parkify.com / admin123`);
            console.log(`  User:  user@parkify.com  / user123`);
            console.log(`=======================================================`);
        });
    } catch (err) {
        console.error('Unable to start backend server:', err);
    }
}

startServer();
