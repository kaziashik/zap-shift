const express = require('express');
const cors = require('cors');
const config = require('./app/config');
const { attachCollections } = require('./app/middleware/attachCollections');
const { globalErrorHandler } = require('./app/middleware/globalErrorHandler');
const { notFound } = require('./app/middleware/notFound');
const { bootstrap } = require('./app/lib/bootstrap');

const { createUserRoutes } = require('./app/module/user/user.route');
const { createParcelRoutes } = require('./app/module/parcel/parcel.route');
const { createPaymentRoutes } = require('./app/module/payment/payment.route');
const { createRiderRoutes } = require('./app/module/rider/rider.route');
const { createTrackingRoutes } = require('./app/module/tracking/tracking.route');
const { createContactRoutes } = require('./app/module/contact/contact.route');
const { createReviewRoutes } = require('./app/module/review/review.route');

/**
 * Build Express app with the same public API paths as before.
 * Folder/route style mirrors PH-Healthcare-Backend (module/*.route.js).
 */
function createApp(collections) {
    const app = express();
    const { controllers } = bootstrap(collections);

    app.use(express.json({ limit: '1mb' }));
    app.use(
        cors({
            origin(origin, callback) {
                if (!origin || config.frontendOrigins.includes(origin)) {
                    callback(null, true);
                    return;
                }
                callback(null, false);
            },
            credentials: true
        })
    );

    app.use(attachCollections(collections));

    app.get('/', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'ZapShift API is running',
            version: '1.0.0'
        });
    });

    // Module routers (same URL paths — no frontend change)
    app.use('/users', createUserRoutes(controllers.user));
    app.use('/parcels', createParcelRoutes(controllers.parcel));
    app.use('/riders', createRiderRoutes(controllers.rider));
    app.use('/trackings', createTrackingRoutes(controllers.tracking));
    app.use('/contact', createContactRoutes(controllers.contact));
    app.use('/reviews', createReviewRoutes(controllers.review));
    app.use('/', createPaymentRoutes(controllers.payment));

    app.use(notFound);
    app.use(globalErrorHandler);

    return app;
}

module.exports = { createApp };
