const jwt = require('jsonwebtoken');
const { users } = require('../data/store');

/**
 * Authentication Middleware: Validates Bearer JWT Token & verifies against store
 * Returns HTTP 401 for unauthenticated requests
 */
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Authentication failed. Bearer token missing.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'parkify_express_jwt_secret_key_2026_co5');
        
        // Fetch actual user role from store
        const user = users.find(u => u.id === decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication failed. User not found.'
            });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Trusted role
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
 * Role-Based Authorization Middleware (RBAC)
 * Returns HTTP 403 Forbidden for unauthorized requests
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required.'
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Forbidden. Role '${req.user.role}' is unauthorized for this resource.`
            });
        }
        next();
    };
};

const requireAdmin = authorizeRoles('admin');

module.exports = {
    authenticateJWT,
    authorizeRoles,
    requireAdmin
};
