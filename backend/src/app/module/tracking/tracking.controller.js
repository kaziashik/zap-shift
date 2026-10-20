class TrackingController {
    constructor(models, collections) {
        this.Tracking = models.Tracking;
        this.Parcel = models.Parcel;
        this.Payment = models.Payment;
        this.User = models.User;
        this.collections = collections;
    }

    async resolveTrackingId(rawId) {
        const id = String(rawId || '').trim();
        if (!id) return { trackingId: '', resolvedFrom: null };

        // Direct ZapShift tracking IDs
        if (/^PRCL-/i.test(id)) {
            return { trackingId: id, resolvedFrom: 'tracking' };
        }

        // Stripe payment intent IDs (pi_...) → map via payments collection
        if (/^pi_/i.test(id) && this.Payment) {
            const payment = await this.Payment.findByTransactionId(id);
            if (payment?.trackingId) {
                return { trackingId: payment.trackingId, resolvedFrom: 'payment' };
            }
        }

        // Fallback: treat input as tracking ID
        return { trackingId: id, resolvedFrom: 'tracking' };
    }

    async getTrackingLogs(req, res) {
        try {
            const rawId = req.params.trackingId;
            if (!rawId) {
                return res.status(400).json({ message: 'Tracking ID is required' });
            }

            const { trackingId, resolvedFrom } = await this.resolveTrackingId(rawId);
            const logs = await this.Tracking.findAllByTrackingId(trackingId);

            return res.status(200).json({
                query: String(rawId).trim(),
                trackingId,
                resolvedFrom,
                logs: Array.isArray(logs) ? logs : []
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tracking logs', error: error.message });
        }
    }
}

module.exports = TrackingController;
