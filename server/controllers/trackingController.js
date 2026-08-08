class TrackingController {
    constructor(models, collections) {
        this.Tracking = models.Tracking;
        this.Parcel = models.Parcel;
        this.User = models.User;
        this.collections = collections;
    }

    async getTrackingLogs(req, res) {
        try {
            const trackingId = req.params.trackingId;
            if (!trackingId) {
                return res.status(400).json({ message: 'Tracking ID is required' });
            }

            const result = await this.Tracking.findAllByTrackingId(trackingId);
            // Public timeline lookup by tracking ID; empty list when nothing exists yet
            return res.status(200).json(Array.isArray(result) ? result : []);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tracking logs', error: error.message });
        }
    }
}

module.exports = TrackingController;
