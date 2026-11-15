/**
 * Custom Request Logging Middleware (CO5)
 */
module.exports = (req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
        console.log(
            `[${timestamp}] ${req.method} ${req.originalUrl} -> ${color}${res.statusCode}\x1b[0m (${duration}ms)`
        );
    });

    next();
};
