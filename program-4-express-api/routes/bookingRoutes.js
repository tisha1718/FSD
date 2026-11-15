const express = require('express');
const router = express.Router();
const { bookings, slots, locations } = require('../data/store');
const { authenticateJWT } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validator');

// All booking routes require JWT authentication
router.use(authenticateJWT);

// GET /api/bookings/my-bookings
router.get('/my-bookings', (req, res) => {
    const userBookings = bookings.filter(b => b.userId === req.user.id);
    res.json({
        success: true,
        count: userBookings.length,
        data: userBookings
    });
});

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    // Only allow owner or admin
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Unauthorized to view this booking.' });
    }

    res.json({ success: true, data: booking });
});

// POST /api/bookings - Create booking with strict double-booking prevention & calculation
router.post('/', validateBooking, (req, res) => {
    const { locationId, slotId, vehicleNumber, vehicleType, date, startTime, durationHours } = req.body;

    const loc = locations.find(l => l.id === locationId);
    if (!loc) {
        return res.status(404).json({ success: false, error: 'Location not found.' });
    }

    const slot = slots.find(s => s.id === slotId && s.locationId === locationId);
    if (!slot) {
        return res.status(404).json({ success: false, error: 'Slot not found at this location.' });
    }

    // Double-booking check: Prevent overlapping reservations on the same slot for the same date
    const collision = bookings.find(b => 
        b.slotId === slotId && 
        b.date === date && 
        b.status === 'CONFIRMED'
    );

    if (collision) {
        return res.status(409).json({
            success: false,
            error: `Double-booking prevented: Slot ${slot.slotNumber} is already reserved for ${date}.`
        });
    }

    const hours = Number(durationHours);
    const hourlyRate = slot.hourlyRate || loc.hourlyRate || 50;
    const totalAmount = hours * hourlyRate;

    const newBooking = {
        id: 'bk-' + Math.floor(100000 + Math.random() * 900000),
        userId: req.user.id,
        userName: req.user.name,
        locationId,
        locationName: loc.name,
        slotId,
        slotNumber: slot.slotNumber,
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType: vehicleType || slot.type || 'FOUR_WHEELER',
        date,
        startTime: startTime || '12:00',
        durationHours: hours,
        hourlyRate,
        totalAmount,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
    };

    // Update slot status
    slot.status = 'OCCUPIED';

    bookings.unshift(newBooking);

    res.status(201).json({
        success: true,
        message: 'Parking slot booked successfully!',
        data: newBooking
    });
});

// PUT /api/bookings/:id - Update booking details (PUT)
router.put('/:id', (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Unauthorized to modify this booking.' });
    }

    const { vehicleNumber, durationHours, startTime } = req.body;
    if (vehicleNumber) booking.vehicleNumber = vehicleNumber.trim().toUpperCase();
    if (startTime) booking.startTime = startTime;
    if (durationHours && Number(durationHours) > 0) {
        booking.durationHours = Number(durationHours);
        booking.totalAmount = booking.durationHours * booking.hourlyRate;
    }

    booking.updatedAt = new Date().toISOString();
    res.json({
        success: true,
        message: 'Booking updated successfully.',
        data: booking
    });
});

// DELETE /api/bookings/:id - Delete booking record (DELETE)
router.delete('/:id', (req, res) => {
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    const booking = bookings[index];
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Unauthorized to delete this booking.' });
    }

    // Release slot if booking was confirmed
    if (booking.status === 'CONFIRMED') {
        const slot = slots.find(s => s.id === booking.slotId);
        if (slot) slot.status = 'AVAILABLE';
    }

    bookings.splice(index, 1);
    res.json({
        success: true,
        message: 'Booking deleted successfully.'
    });
});

// PUT /api/bookings/:id/cancel - Cancel booking
router.put('/:id/cancel', (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Unauthorized to cancel this booking.' });
    }

    if (booking.status === 'CANCELLED') {
        return res.status(400).json({ success: false, error: 'Booking is already cancelled.' });
    }

    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date().toISOString();

    // Release slot
    const slot = slots.find(s => s.id === booking.slotId);
    if (slot) {
        slot.status = 'AVAILABLE';
    }

    res.json({
        success: true,
        message: 'Booking cancelled successfully. Slot is now available.',
        data: booking
    });
});

module.exports = router;
