class TrackingModel {
    constructor(collection) {
        this.collection = collection;
    }

    async findAllByTrackingId(trackingId) {
        const id = String(trackingId || '').trim();
        // Case-insensitive exact match so home lookup is forgiving
        const query = { trackingId: { $regex: `^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } };
        return await this.collection.find(query).sort({ createdAt: 1 }).toArray();
    }

    async create(logData) {
        logData.createdAt = new Date();
        const result = await this.collection.insertOne(logData);
        return result;
    }
}

module.exports = TrackingModel;

