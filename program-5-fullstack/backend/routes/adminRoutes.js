const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateJWT, authorizeAdmin } = require('../middleware/auth');

router.use(authenticateJWT, authorizeAdmin);

router.get('/analytics', adminController.getAnalytics);
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id/status', adminController.updateBookingStatus);
router.get('/users', adminController.getAllUsers);

module.exports = router;
