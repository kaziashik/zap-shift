const { verifyFBToken, verifyAdmin, verifyRider } = require('../middleware/auth');

function parcelRoutes(app, controllers) {
    const parcelController = controllers.parcel;

    // Static paths MUST come before /parcels/:id
    app.get('/parcels', verifyFBToken, (req, res) => parcelController.getAllParcels(req, res));
    app.get('/parcels/rider', verifyFBToken, verifyRider, (req, res) => parcelController.getRiderParcels(req, res));
    app.get('/parcels/delivery-status/stats', verifyFBToken, verifyAdmin, (req, res) => parcelController.getDeliveryStatusStats(req, res));

    app.get('/parcels/:id', verifyFBToken, (req, res) => parcelController.getParcelById(req, res));
    app.post('/parcels', verifyFBToken, (req, res) => parcelController.createParcel(req, res));
    app.patch('/parcels/:id/status', verifyFBToken, (req, res) => parcelController.updateParcelStatus(req, res));
    app.patch('/parcels/:id', verifyFBToken, verifyAdmin, (req, res) => parcelController.assignRiderToParcel(req, res));

    // Owner can delete unpaid parcels; admin can delete any (handled in controller)
    app.delete('/parcels/:id', verifyFBToken, (req, res) => parcelController.deleteParcel(req, res));
}

module.exports = parcelRoutes;
