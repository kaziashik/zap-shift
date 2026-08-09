const { verifyFBToken } = require('../middleware/auth');

function reviewRoutes(app, controllers) {
    const reviewController = controllers.review;

    app.get('/reviews', (req, res) => reviewController.getReviews(req, res));
    app.post('/reviews', verifyFBToken, (req, res) => reviewController.createReview(req, res));
}

module.exports = reviewRoutes;
