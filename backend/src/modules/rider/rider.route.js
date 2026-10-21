const express = require('express');
const { requireAuth } = require('../../app/middleware/requireAuth');
const { requireAdmin } = require('../../app/middleware/requireAdmin');
const { requireRider } = require('../../app/middleware/requireRider');

const createRiderRoutes = (riderController) => {
    const router = express.Router();

    router.get('/', requireAuth, riderController.getAllRiders.bind(riderController));
    router.get(
        '/delivery-per-day',
        requireAuth,
        requireRider,
        riderController.getDeliveryPerDay.bind(riderController)
    );
    router.post('/', riderController.createRider.bind(riderController));
    router.patch('/:id', requireAuth, requireAdmin, riderController.updateRiderStatus.bind(riderController));

    return router;
};

module.exports = { createRiderRoutes };
