const express = require('express');
const { verifyFBToken } = require('../../middleware/checkAuth');

const createReviewRoutes = (reviewController) => {
    const router = express.Router();

    router.get('/', (req, res) => reviewController.getReviews(req, res));
    router.post('/', verifyFBToken, (req, res) => reviewController.createReview(req, res));

    return router;
};

module.exports = { createReviewRoutes };
