const { ParkingSlot, ParkingLocation } = require('../models');

exports.getAllSlots = async (req, res, next) => {
    try {
        const slots = await ParkingSlot.findAll({
            include: [{ model: ParkingLocation, as: 'location', attributes: ['id', 'name', 'city'] }]
        });
        res.json({ success: true, count: slots.length, data: slots });
    } catch (err) {
        next(err);
    }
};

exports.getSlotsByLocation = async (req, res, next) => {
    try {
        const slots = await ParkingSlot.findAll({
            where: { locationId: req.params.locationId }
        });
        res.json({ success: true, count: slots.length, data: slots });
    } catch (err) {
        next(err);
    }
};

exports.createSlot = async (req, res, next) => {
    try {
        const { locationId, slotNumber, type, hourlyRate, floor } = req.body;
        if (!locationId || !slotNumber) {
            return res.status(400).json({ success: false, error: 'locationId and slotNumber are required.' });
        }

        const loc = await ParkingLocation.findByPk(locationId);
        if (!loc) {
            return res.status(404).json({ success: false, error: 'Location not found.' });
        }

        const duplicate = await ParkingSlot.findOne({
            where: { locationId, slotNumber }
        });
        if (duplicate) {
            return res.status(409).json({ success: false, error: `Slot ${slotNumber} already exists in this hub.` });
        }

        const slot = await ParkingSlot.create({
            locationId,
            slotNumber,
            type: type || 'FOUR_WHEELER',
            hourlyRate: hourlyRate || loc.hourlyRate || 50,
            floor: floor || 'Ground',
            status: 'AVAILABLE'
        });

        res.status(201).json({ success: true, message: 'Slot created successfully', data: slot });
    } catch (err) {
        next(err);
    }
};

exports.updateSlot = async (req, res, next) => {
    try {
        const slot = await ParkingSlot.findByPk(req.params.id);
        if (!slot) {
            return res.status(404).json({ success: false, error: 'Slot not found.' });
        }

        const { slotNumber, type, status, hourlyRate, floor } = req.body;
        if (slotNumber) slot.slotNumber = slotNumber;
        if (type) slot.type = type;
        if (status) slot.status = status;
        if (hourlyRate) slot.hourlyRate = hourlyRate;
        if (floor) slot.floor = floor;

        await slot.save();
        res.json({ success: true, message: 'Slot updated successfully', data: slot });
    } catch (err) {
        next(err);
    }
};

exports.deleteSlot = async (req, res, next) => {
    try {
        const slot = await ParkingSlot.findByPk(req.params.id);
        if (!slot) {
            return res.status(404).json({ success: false, error: 'Slot not found.' });
        }

        await slot.destroy();
        res.json({ success: true, message: 'Slot deleted successfully.' });
    } catch (err) {
        next(err);
    }
};
