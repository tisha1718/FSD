const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Authentication Middleware:
 * Verifies Bearer JWT and fetches actual user role from trusted database records.
 * Returns HTTP 401 for unauthenticated requests.
 */
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Authentication failed. Bearer token missing.'
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'parkify_enterprise_jwt_secret_key_2026_super_secure'
        );

        // Fetch actual user role from trusted database records
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'name', 'email', 'role', 'phone']
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication failed. User record not found.'
            });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Trusted role directly from database
            phone: user.phone
        };

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Authentication failed. Invalid or expired JWT token.'
        });
    }
};

/**
 * requireAdmin / authorizeAdmin Middleware:
 * Enforces admin role check.
 * Returns HTTP 403 Forbidden for unauthorized non-admin users.
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required.'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Forbidden. Admin privileges required.'
        });
    }

    next();
};

const authorizeAdmin = requireAdmin;

module.exports = {
    authenticateJWT,
    requireAdmin,
    authorizeAdmin
};
