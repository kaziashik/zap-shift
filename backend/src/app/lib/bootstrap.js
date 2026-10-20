const UserModel = require('../module/user/user.model');
const ParcelModel = require('../module/parcel/parcel.model');
const RiderModel = require('../module/rider/rider.model');
const PaymentModel = require('../module/payment/payment.model');
const TrackingModel = require('../module/tracking/tracking.model');
const ContactModel = require('../module/contact/contact.model');
const ReviewModel = require('../module/review/review.model');

const UserController = require('../module/user/user.controller');
const ParcelController = require('../module/parcel/parcel.controller');
const RiderController = require('../module/rider/rider.controller');
const PaymentController = require('../module/payment/payment.controller');
const TrackingController = require('../module/tracking/tracking.controller');
const ContactController = require('../module/contact/contact.controller');
const ReviewController = require('../module/review/review.controller');

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

function initializeControllers(models, collections) {
    return {
        user: new UserController(models),
        parcel: new ParcelController(models, collections),
        rider: new RiderController(models, collections),
        payment: new PaymentController(models, collections),
        tracking: new TrackingController(models, collections),
        contact: new ContactController(models),
        review: new ReviewController(models)
    };
}

function bootstrap(collections) {
    const models = initializeModels(collections);
    const controllers = initializeControllers(models, collections);
    return { models, controllers, collections };
}

module.exports = { bootstrap, initializeModels, initializeControllers };
