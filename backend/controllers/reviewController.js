class ReviewController {
    constructor(models) {
        this.Review = models.Review;
        this.Parcel = models.Parcel;
    }

    async getReviews(req, res) {
        try {
            const reviews = await this.Review.findAll();
            res.send(reviews);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching reviews', error: error.message });
        }
    }

    async createReview(req, res) {
        try {
            const { parcelId, rating, comment } = req.body;
            const email = req.decoded_email;

            if (!parcelId || !rating) {
                return res.status(400).send({ message: 'parcelId and rating are required' });
            }

            const parcel = await this.Parcel.findById(parcelId);
            if (!parcel) {
                return res.status(404).send({ message: 'Parcel not found' });
            }
            if (parcel.senderEmail !== email) {
                return res.status(403).send({ message: 'forbidden access' });
            }

            const status = parcel.deliveryStatus;
            if (status !== 'delivered' && status !== 'parcel_delivered') {
                return res.status(400).send({ message: 'You can only review delivered parcels' });
            }

            const existing = await this.Review.findByParcel(parcelId);
            if (existing) {
                return res.status(400).send({ message: 'Review already submitted for this parcel' });
            }

            const result = await this.Review.create({
                parcelId,
                trackingId: parcel.trackingId,
                parcelName: parcel.parcelName,
                email,
                rating: Math.min(5, Math.max(1, Number(rating))),
                comment: comment || '',
                displayName: req.body.displayName || email
            });

            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error creating review', error: error.message });
        }
    }
}

module.exports = ReviewController;
