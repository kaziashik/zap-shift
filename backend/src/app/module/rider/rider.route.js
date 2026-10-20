const express = require('express');
const { verifyFBToken, verifyAdmin, verifyRider } = require('../../middleware/checkAuth');

const createRiderRoutes = (riderController) => {
    const router = express.Router();

    router.get('/', verifyFBToken, (req, res) => riderController.getAllRiders(req, res));
    router.get('/delivery-per-day', verifyFBToken, verifyRider, (req, res) =>
        riderController.getDeliveryPerDay(req, res)
    );
    router.post('/', (req, res) => riderController.createRider(req, res));
    router.patch('/:id', verifyFBToken, verifyAdmin, (req, res) =>
        riderController.updateRiderStatus(req, res)
    );

    return router;
};

module.exports = { createRiderRoutes };
