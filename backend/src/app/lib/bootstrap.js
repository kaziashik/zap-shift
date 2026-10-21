const UserModel = require('../../modules/user/user.model');
const ParcelModel = require('../../modules/parcel/parcel.model');
const RiderModel = require('../../modules/rider/rider.model');
const PaymentModel = require('../../modules/payment/payment.model');
const TrackingModel = require('../../modules/tracking/tracking.model');
const ContactModel = require('../../modules/contact/contact.model');
const ReviewModel = require('../../modules/review/review.model');

const UserController = require('../../modules/user/user.controller');
const ParcelController = require('../../modules/parcel/parcel.controller');
const RiderController = require('../../modules/rider/rider.controller');
const PaymentController = require('../../modules/payment/payment.controller');
const TrackingController = require('../../modules/tracking/tracking.controller');
const ContactController = require('../../modules/contact/contact.controller');
const ReviewController = require('../../modules/review/review.controller');

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
