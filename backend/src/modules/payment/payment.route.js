const express = require('express');
const { requireAuth } = require('../../app/middleware/requireAuth');

/**
 * Mixed prefixes kept for API compatibility:
 * POST /payment-checkout-session, PATCH /payment-success, GET /payments
 * Mount at "/"
 */
const createPaymentRoutes = (paymentController) => {
    const router = express.Router();

    router.post('/payment-checkout-session', paymentController.createCheckoutSession.bind(paymentController));
    router.patch('/payment-success', paymentController.handlePaymentSuccess.bind(paymentController));
    router.get('/payments', requireAuth, paymentController.getAllPayments.bind(paymentController));

    return router;
};

module.exports = { createPaymentRoutes };
