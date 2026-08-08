function validateContact(req, res, next) {
    const { name, email, subject, message } = req.body || {};
    const errors = [];

    if (!name || String(name).trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
        errors.push('Valid email is required');
    }
    if (!subject || String(subject).trim().length < 2) {
        errors.push('Subject is required');
    }
    if (!message || String(message).trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }

    if (errors.length) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
}

module.exports = { validateContact };
