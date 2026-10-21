const express = require('express');
const { requireAuth } = require('../../app/middleware/requireAuth');
const { requireAdmin } = require('../../app/middleware/requireAdmin');
const { requireRider } = require('../../app/middleware/requireRider');

const createParcelRoutes = (parcelController) => {
    const router = express.Router();

    // Static paths MUST come before /:id
    router.get('/', requireAuth, parcelController.getAllParcels.bind(parcelController));
    router.get('/rider', requireAuth, requireRider, parcelController.getRiderParcels.bind(parcelController));
    router.get(
        '/delivery-status/stats',
        requireAuth,
        requireAdmin,
        parcelController.getDeliveryStatusStats.bind(parcelController)
    );

    router.get('/:id', requireAuth, parcelController.getParcelById.bind(parcelController));
    router.post('/', requireAuth, parcelController.createParcel.bind(parcelController));
    router.patch('/:id/edit', requireAuth, parcelController.editParcel.bind(parcelController));
    router.patch('/:id/status', requireAuth, parcelController.updateParcelStatus.bind(parcelController));
    router.patch('/:id', requireAuth, requireAdmin, parcelController.assignRiderToParcel.bind(parcelController));
    router.delete('/:id', requireAuth, parcelController.deleteParcel.bind(parcelController));

    return router;
};

module.exports = { createParcelRoutes };
