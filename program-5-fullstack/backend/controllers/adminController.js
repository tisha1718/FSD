const { ParkingLocation, ParkingSlot, Booking, User } = require('../models');

exports.getAnalytics = async (req, res, next) => {
    try {
        const totalLocations = await ParkingLocation.count();
        const totalSlots = await ParkingSlot.count();
        const occupiedSlots = await ParkingSlot.count({ where: { status: 'OCCUPIED' } });
        const availableSlots = totalSlots - occupiedSlots;
        const occupancyRate = totalSlots > 0 ? ((occupiedSlots / totalSlots) * 100).toFixed(1) : 0;

        const totalBookings = await Booking.count();
        const activeBookings = await Booking.count({ where: { status: 'CONFIRMED' } });

        const bookings = await Booking.findAll({ where: { status: 'CONFIRMED' } });
        const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

        const totalUsers = await User.count({ where: { role: 'user' } });

        res.json({
            success: true,
            data: {
                totalLocations,
                totalSlots,
                occupiedSlots,
                availableSlots,
                occupancyRatePercent: Number(occupancyRate),
                totalBookings,
                activeBookings,
                totalRevenueRupees: totalRevenue,
                totalUsers
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
                { model: ParkingLocation, as: 'location', attributes: ['id', 'name', 'city'] },
                { model: ParkingSlot, as: 'slot', attributes: ['id', 'slotNumber', 'type'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        next(err);
    }
};

exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Status must be CONFIRMED, CANCELLED, or COMPLETED.' });
        }

        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found.' });
        }

        booking.status = status;
        await booking.save();

        if (status === 'CANCELLED' || status === 'COMPLETED') {
            const slot = await ParkingSlot.findByPk(booking.slotId);
            if (slot) {
                slot.status = 'AVAILABLE';
                await slot.save();
            }
        }

        res.json({ success: true, message: `Booking status changed to ${status}`, data: booking });
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'phone', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};
