const express = require('express');
const { verifyFBToken, verifyAdmin, verifyRider } = require('../../middleware/checkAuth');

const createParcelRoutes = (parcelController) => {
    const router = express.Router();

    // Static paths MUST come before /:id
    router.get('/', verifyFBToken, (req, res) => parcelController.getAllParcels(req, res));
    router.get('/rider', verifyFBToken, verifyRider, (req, res) => parcelController.getRiderParcels(req, res));
    router.get('/delivery-status/stats', verifyFBToken, verifyAdmin, (req, res) =>
        parcelController.getDeliveryStatusStats(req, res)
    );

    router.get('/:id', verifyFBToken, (req, res) => parcelController.getParcelById(req, res));
    router.post('/', verifyFBToken, (req, res) => parcelController.createParcel(req, res));
    router.patch('/:id/edit', verifyFBToken, (req, res) => parcelController.editParcel(req, res));
    router.patch('/:id/status', verifyFBToken, (req, res) => parcelController.updateParcelStatus(req, res));
    router.patch('/:id', verifyFBToken, verifyAdmin, (req, res) => parcelController.assignRiderToParcel(req, res));
    router.delete('/:id', verifyFBToken, (req, res) => parcelController.deleteParcel(req, res));

    return router;
};

module.exports = { createParcelRoutes };
