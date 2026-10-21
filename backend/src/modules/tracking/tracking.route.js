const express = require('express');

const createTrackingRoutes = (trackingController) => {
    const router = express.Router();

    router.get('/:trackingId/logs', trackingController.getTrackingLogs.bind(trackingController));

    return router;
};

module.exports = { createTrackingRoutes };
