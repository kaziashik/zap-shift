class ReviewModel {
    constructor(collection) {
        this.collection = collection;
    }

    async findAll(limit = 50) {
        return this.collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
    }

    async findByParcel(parcelId) {
        return this.collection.findOne({ parcelId });
    }

    async create(review) {
        review.createdAt = new Date();
        return this.collection.insertOne(review);
    }
}

module.exports = ReviewModel;
