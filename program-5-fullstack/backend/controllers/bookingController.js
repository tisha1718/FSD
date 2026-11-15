const { sequelize, Booking, ParkingSlot, ParkingLocation, User } = require('../models');

exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [
                { model: ParkingLocation, as: 'location', attributes: ['id', 'name', 'address', 'city'] },
                { model: ParkingSlot, as: 'slot', attributes: ['id', 'slotNumber', 'type', 'floor'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        next(err);
    }
};

exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                { model: ParkingLocation, as: 'location' },
                { model: ParkingSlot, as: 'slot' },
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
            ]
        });

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found.' });
        }

        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access denied.' });
        }

        res.json({ success: true, data: booking });
    } catch (err) {
        next(err);
    }
};

exports.createBooking = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { locationId, slotId, vehicleNumber, vehicleType, date, startTime, durationHours } = req.body;

        if (!locationId || !slotId || !vehicleNumber || !date || !durationHours) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                error: 'locationId, slotId, vehicleNumber, date, and durationHours are required.'
            });
        }

        const slot = await ParkingSlot.findByPk(slotId, { transaction: t });
        if (!slot || slot.locationId !== Number(locationId)) {
            await t.rollback();
            return res.status(404).json({ success: false, error: 'Slot not found at the specified location.' });
        }

        // Double-Booking Check inside Transaction
        const existingBooking = await Booking.findOne({
            where: {
                slotId,
                date,
                status: 'CONFIRMED'
            },
            transaction: t
        });

        if (existingBooking) {
            await t.rollback();
            return res.status(409).json({
                success: false,
                error: `Slot ${slot.slotNumber} is already booked for date ${date}. Double reservation prevented.`
            });
        }

        const hours = Number(durationHours);
        const rate = slot.hourlyRate || 50;
        const total = hours * rate;
        const bookingCode = 'PKF-' + Math.floor(100000 + Math.random() * 900000);

        const newBooking = await Booking.create({
            bookingCode,
            userId: req.user.id,
            locationId,
            slotId,
            vehicleNumber: vehicleNumber.trim().toUpperCase(),
            vehicleType: vehicleType || slot.type || 'FOUR_WHEELER',
            date,
            startTime: startTime || '10:00',
            durationHours: hours,
            ratePerHour: rate,
            totalAmount: total,
            status: 'CONFIRMED'
        }, { transaction: t });

        // Update slot occupancy status
        slot.status = 'OCCUPIED';
        await slot.save({ transaction: t });

        // Commit transaction
        await t.commit();

        // Fetch full record with relations for response
        const fullBooking = await Booking.findByPk(newBooking.id, {
            include: [
                { model: ParkingLocation, as: 'location' },
                { model: ParkingSlot, as: 'slot' }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Parking slot booked successfully!',
            data: fullBooking
        });
    } catch (err) {
        await t.rollback();
        next(err);
    }
};

exports.cancelBooking = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(req.params.id, { transaction: t });
        if (!booking) {
            await t.rollback();
            return res.status(404).json({ success: false, error: 'Booking not found.' });
        }

        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            await t.rollback();
            return res.status(403).json({ success: false, error: 'Access denied.' });
        }

        if (booking.status === 'CANCELLED') {
            await t.rollback();
            return res.status(400).json({ success: false, error: 'Booking is already cancelled.' });
        }

        booking.status = 'CANCELLED';
        await booking.save({ transaction: t });

        // Free slot
        const slot = await ParkingSlot.findByPk(booking.slotId, { transaction: t });
        if (slot) {
            slot.status = 'AVAILABLE';
            await slot.save({ transaction: t });
        }

        await t.commit();

        res.json({
            success: true,
            message: 'Booking cancelled successfully. Slot has been released.',
            data: booking
        });
    } catch (err) {
        await t.rollback();
        next(err);
    }
};
