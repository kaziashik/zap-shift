function notFoundHandler(req, res, next) {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
}

function errorHandler(err, req, res, next) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal server error';

    if (process.env.NODE_ENV !== 'production') {
        // Keep verbose errors for local debugging only
        return res.status(status).json({
            success: false,
            message,
            stack: err.stack
        });
    }

    res.status(status).json({
        success: false,
        message: status === 500 ? 'Internal server error' : message
    });
}

module.exports = { notFoundHandler, errorHandler };
