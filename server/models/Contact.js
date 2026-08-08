class ContactModel {
    constructor(collection) {
        this.collection = collection;
    }

    async create(contact) {
        return this.collection.insertOne({
            ...contact,
            createdAt: new Date(),
            status: 'new'
        });
    }

    async findAll() {
        return this.collection.find({}).sort({ createdAt: -1 }).toArray();
    }
}

module.exports = ContactModel;
