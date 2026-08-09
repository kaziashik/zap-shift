const UserModel = require('./User');
const ParcelModel = require('./Parcel');
const RiderModel = require('./Rider');
const PaymentModel = require('./Payment');
const TrackingModel = require('./Tracking');
const ContactModel = require('./Contact');
const ReviewModel = require('./Review');

function initializeModels(collections) {
    return {
        User: new UserModel(collections.users),
        Parcel: new ParcelModel(collections.parcels),
        Rider: new RiderModel(collections.riders),
        Payment: new PaymentModel(collections.payments),
        Tracking: new TrackingModel(collections.trackings),
        Contact: new ContactModel(collections.contacts),
        Review: new ReviewModel(collections.reviews)
    };
}

module.exports = { initializeModels };

