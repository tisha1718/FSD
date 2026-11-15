/**
 * Centralized Error Handling Middleware (CO5)
 */
module.exports = (err, req, res, next) => {
    console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
};
