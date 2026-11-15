module.exports = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`[FullStack API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${ms}ms)`);
    });
    next();
};
