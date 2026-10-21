const express = require('express');
const { requireAuth } = require('../../app/middleware/requireAuth');

const createReviewRoutes = (reviewController) => {
    const router = express.Router();

    router.get('/', reviewController.getReviews.bind(reviewController));
    router.post('/', requireAuth, reviewController.createReview.bind(reviewController));

    return router;
};

module.exports = { createReviewRoutes };
