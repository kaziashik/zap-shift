function trackingRoutes(app, controllers) {
    const trackingController = controllers.tracking;

    // Public tracking timeline (tracking ID acts as the lookup key)
    app.get('/trackings/:trackingId/logs', (req, res) => trackingController.getTrackingLogs(req, res));
}

module.exports = trackingRoutes;
