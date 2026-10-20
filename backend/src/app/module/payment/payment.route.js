const express = require('express');
const { verifyFBToken } = require('../../middleware/checkAuth');

/**
 * Payment routes use mixed prefixes historically:
 * POST /payment-checkout-session, PATCH /payment-success, GET /payments
 * Mount this router at "/" to keep the same public API.
 */
const createPaymentRoutes = (paymentController) => {
    const router = express.Router();

    router.post('/payment-checkout-session', (req, res) =>
        paymentController.createCheckoutSession(req, res)
    );
    router.patch('/payment-success', (req, res) =>
        paymentController.handlePaymentSuccess(req, res)
    );
    router.get('/payments', verifyFBToken, (req, res) =>
        paymentController.getAllPayments(req, res)
    );

    return router;
};

module.exports = { createPaymentRoutes };
