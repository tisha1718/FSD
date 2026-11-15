/**
 * Input Validation Middleware
 */
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Both email and password are required.' });
    }
    next();
};

const validateBooking = (req, res, next) => {
    const { locationId, slotId, vehicleNumber, date, durationHours } = req.body;
    if (!locationId || !slotId) {
        return res.status(400).json({ success: false, error: 'locationId and slotId are required.' });
    }
    if (!vehicleNumber || vehicleNumber.trim().length < 4) {
        return res.status(400).json({ success: false, error: 'Valid vehicleNumber is required.' });
    }
    if (!date) {
        return res.status(400).json({ success: false, error: 'Reservation date is required.' });
    }
    if (!durationHours || Number(durationHours) < 1 || Number(durationHours) > 24) {
        return res.status(400).json({ success: false, error: 'durationHours must be between 1 and 24.' });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateBooking
};
