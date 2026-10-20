const express = require('express');

const createTrackingRoutes = (trackingController) => {
    const router = express.Router();

    // Public tracking timeline (tracking ID acts as the lookup key)
    router.get('/:trackingId/logs', (req, res) => trackingController.getTrackingLogs(req, res));

    return router;
};

module.exports = { createTrackingRoutes };
