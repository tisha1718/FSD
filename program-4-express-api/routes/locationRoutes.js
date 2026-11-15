const express = require('express');
const router = express.Router();
const { locations, slots } = require('../data/store');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// GET /api/locations - Public listing with slot occupancy counts
router.get('/', (req, res) => {
    const list = locations.map(loc => {
        const locSlots = slots.filter(s => s.locationId === loc.id);
        const freeSlots = locSlots.filter(s => s.status === 'AVAILABLE').length;
        return {
            ...loc,
            totalSlots: locSlots.length,
            availableSlots: freeSlots
        };
    });
    res.json({ success: true, count: list.length, data: list });
});

// GET /api/locations/:id - Public location detail with its slots
router.get('/:id', (req, res) => {
    const loc = locations.find(l => l.id === req.params.id);
    if (!loc) {
        return res.status(404).json({ success: false, error: 'Location not found.' });
    }
    const locSlots = slots.filter(s => s.locationId === loc.id);
    res.json({
        success: true,
        data: {
            ...loc,
            slots: locSlots
        }
    });
});

// POST /api/locations - Protected: Admin Only
router.post('/', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    const { name, address, city, hourlyRate } = req.body;
    if (!name || !address || !city) {
        return res.status(400).json({ success: false, error: 'Name, address, and city are required.' });
    }

    const newLoc = {
        id: 'loc-' + Date.now(),
        name,
        address,
        city,
        hourlyRate: Number(hourlyRate) || 50,
        createdAt: new Date().toISOString()
    };

    locations.push(newLoc);
    res.status(201).json({ success: true, message: 'Location added successfully', data: newLoc });
});

// PUT /api/locations/:id - Protected: Admin Only
router.put('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    const loc = locations.find(l => l.id === req.params.id);
    if (!loc) {
        return res.status(404).json({ success: false, error: 'Location not found.' });
    }

    const { name, address, city, hourlyRate } = req.body;
    if (name) loc.name = name;
    if (address) loc.address = address;
    if (city) loc.city = city;
    if (hourlyRate) loc.hourlyRate = Number(hourlyRate);

    loc.updatedAt = new Date().toISOString();
    res.json({ success: true, message: 'Location updated', data: loc });
});

// DELETE /api/locations/:id - Protected: Admin Only
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    const index = locations.findIndex(l => l.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Location not found.' });
    }

    locations.splice(index, 1);
    res.json({ success: true, message: 'Location deleted successfully.' });
});

module.exports = router;
