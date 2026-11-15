const express = require('express');
const router = express.Router();
const { users, locations, slots, bookings } = require('../data/store');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// All admin routes require JWT and 'admin' role
router.use(authenticateJWT, authorizeRoles('admin'));

// GET /api/admin/analytics - Real-time system analytics
router.get('/analytics', (req, res) => {
    const totalSlots = slots.length;
    const occupiedSlots = slots.filter(s => s.status === 'OCCUPIED').length;
    const availableSlots = totalSlots - occupiedSlots;
    const occupancyRate = totalSlots > 0 ? ((occupiedSlots / totalSlots) * 100).toFixed(1) : 0;

    const totalRevenue = bookings.reduce((sum, b) => {
        return b.status === 'CONFIRMED' ? sum + b.totalAmount : sum;
    }, 0);

    const activeBookingsCount = bookings.filter(b => b.status === 'CONFIRMED').length;

    res.json({
        success: true,
        data: {
            totalLocations: locations.length,
            totalSlots,
            occupiedSlots,
            availableSlots,
            occupancyRatePercent: Number(occupancyRate),
            totalBookings: bookings.length,
            activeBookings: activeBookingsCount,
            totalRevenueRupees: totalRevenue,
            totalUsers: users.length
        }
    });
});

// GET /api/admin/all-bookings - View every booking across system
router.get('/all-bookings', (req, res) => {
    res.json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

// PUT /api/admin/bookings/:id/status - Manage booking status
router.put('/bookings/:id/status', (req, res) => {
    const { status } = req.body;
    if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Status must be CONFIRMED, CANCELLED, or COMPLETED.' });
    }

    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    // If cancelled or completed, release the slot
    if (status === 'CANCELLED' || status === 'COMPLETED') {
        const slot = slots.find(s => s.id === booking.slotId);
        if (slot) slot.status = 'AVAILABLE';
    }

    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
});

// GET /api/admin/users - View all users
router.get('/users', (req, res) => {
    const sanitized = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        createdAt: u.createdAt
    }));
    res.json({ success: true, count: sanitized.length, data: sanitized });
});

module.exports = router;
