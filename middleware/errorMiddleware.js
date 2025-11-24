const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const serviceName = 'BackendService';

    // Log error with service name
    console.error(`[${serviceName}] Error:`, {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    res.status(statusCode);
    res.json({
        service: serviceName,
        message: err.message,
        stack: process.env.NODE_ENV === 'Production' ? null : err.stack,
    });
}

module.exports = { errorHandler };

