const { ParkingLocation, ParkingSlot } = require('../models');

exports.getAllLocations = async (req, res, next) => {
    try {
        const locations = await ParkingLocation.findAll({
            include: [{
                model: ParkingSlot,
                as: 'slots'
            }]
        });

        const formatted = locations.map(loc => {
            const l = loc.toJSON();
            const total = l.slots ? l.slots.length : 0;
            const available = l.slots ? l.slots.filter(s => s.status === 'AVAILABLE').length : 0;
            return {
                ...l,
                totalSlots: total,
                availableSlots: available
            };
        });

        res.json({ success: true, count: formatted.length, data: formatted });
    } catch (err) {
        next(err);
    }
};

exports.getLocationById = async (req, res, next) => {
    try {
        const loc = await ParkingLocation.findByPk(req.params.id, {
            include: [{
                model: ParkingSlot,
                as: 'slots'
            }]
        });

        if (!loc) {
            return res.status(404).json({ success: false, error: 'Location not found.' });
        }

        res.json({ success: true, data: loc });
    } catch (err) {
        next(err);
    }
};

exports.createLocation = async (req, res, next) => {
    try {
        const { name, address, city, hourlyRate, description, imageUrl } = req.body;
        if (!name || !address || !city) {
            return res.status(400).json({ success: false, error: 'Name, address, and city are required.' });
        }

        const newLoc = await ParkingLocation.create({
            name,
            address,
            city,
            hourlyRate: hourlyRate || 50.0,
            description,
            imageUrl
        });

        res.status(201).json({ success: true, message: 'Location created successfully', data: newLoc });
    } catch (err) {
        next(err);
    }
};

exports.updateLocation = async (req, res, next) => {
    try {
        const loc = await ParkingLocation.findByPk(req.params.id);
        if (!loc) {
            return res.status(404).json({ success: false, error: 'Location not found.' });
        }

        const { name, address, city, hourlyRate, description, imageUrl } = req.body;
        if (name) loc.name = name;
        if (address) loc.address = address;
        if (city) loc.city = city;
        if (hourlyRate) loc.hourlyRate = hourlyRate;
        if (description) loc.description = description;
        if (imageUrl) loc.imageUrl = imageUrl;

        await loc.save();
        res.json({ success: true, message: 'Location updated successfully', data: loc });
    } catch (err) {
        next(err);
    }
};

exports.deleteLocation = async (req, res, next) => {
    try {
        const loc = await ParkingLocation.findByPk(req.params.id);
        if (!loc) {
            return res.status(404).json({ success: false, error: 'Location not found.' });
        }

        await loc.destroy();
        res.json({ success: true, message: 'Location and its slots deleted successfully.' });
    } catch (err) {
        next(err);
    }
};
