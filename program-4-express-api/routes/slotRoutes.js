const express = require('express');
const router = express.Router();
const { slots, locations } = require('../data/store');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// GET /api/slots - All slots
router.get('/', (req, res) => {
    res.json({ success: true, count: slots.length, data: slots });
});

// GET /api/slots/location/:locationId - Slots by location
router.get('/location/:locationId', (req, res) => {
    const locSlots = slots.filter(s => s.locationId === req.params.locationId);
    res.json({ success: true, count: locSlots.length, data: locSlots });
});

// POST /api/slots - Admin Only: Add slot
router.post('/', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    const { locationId, slotNumber, type, hourlyRate } = req.body;

    if (!locationId || !slotNumber) {
        return res.status(400).json({ success: false, error: 'locationId and slotNumber are required.' });
    }

    const locExists = locations.some(l => l.id === locationId);
    if (!locExists) {
        return res.status(404).json({ success: false, error: 'Target parking location does not exist.' });
    }

    // Check duplicate slot number within same location
    const duplicate = slots.some(s => s.locationId === locationId && s.slotNumber.toUpperCase() === slotNumber.toUpperCase());
    if (duplicate) {
        return res.status(409).json({ success: false, error: `Slot ${slotNumber} already exists in this location.` });
    }

    const newSlot = {
        id: 's-' + Date.now(),
        locationId,
        slotNumber: slotNumber.toUpperCase(),
        type: type || 'FOUR_WHEELER',
        status: 'AVAILABLE',
        hourlyRate: Number(hourlyRate) || 50
    };

    slots.push(newSlot);
    res.status(201).json({ success: true, message: 'Slot created successfully', data: newSlot });
});

// PUT /api/slots/:id - Admin Only: Update slot status / rate
router.put('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    const slot = slots.find(s => s.id === req.params.id);
    if (!slot) {
        return res.status(404).json({ success: false, error: 'Slot not found.' });
    }

    const { status, hourlyRate, type } = req.body;
    if (status) slot.status = status;
    if (hourlyRate) slot.hourlyRate = Number(hourlyRate);
    if (type) slot.type = type;

    res.json({ success: true, message: 'Slot updated', data: slot });
});

// DELETE /api/slots/:id - Admin Only
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    const index = slots.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Slot not found.' });
    }

    slots.splice(index, 1);
    res.json({ success: true, message: 'Slot deleted successfully.' });
});

module.exports = router;
