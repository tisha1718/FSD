const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../data/store');
const { validateRegister, validateLogin } = require('../middleware/validator');
const { authenticateJWT } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', validateRegister, async (req, res, next) => {
    try {
        const { name, email, password, phone, role } = req.body;

        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return res.status(409).json({ success: false, error: 'Email is already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: 'usr-' + Date.now(),
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'user', // Explicitly prevent self-assignment of admin role
            phone: phone || '',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        // Generate JWT
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
            process.env.JWT_SECRET || 'parkify_express_jwt_secret_key_2026_co5',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/login
router.post('/login', validateLogin, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'parkify_express_jwt_secret_key_2026_co5',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me (Protected)
router.get('/me', authenticateJWT, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    res.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    });
});

module.exports = router;
