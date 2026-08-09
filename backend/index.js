const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDatabase } = require('./config/database');
const { attachCollections } = require('./middleware/collections');
const { initializeModels } = require('./models');
const { initializeControllers } = require('./controllers');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const userRoutes = require('./routes/users');
const parcelRoutes = require('./routes/parcels');
const paymentRoutes = require('./routes/payments');
const riderRoutes = require('./routes/riders');
const trackingRoutes = require('./routes/trackings');
const contactRoutes = require('./routes/contact');
const reviewRoutes = require('./routes/reviews');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim());

app.use(express.json({ limit: '1mb' }));
app.use(cors({
    origin(origin, callback) {
        if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    }
}));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ZapShift API is running',
        version: '1.0.0'
    });
});

async function startServer() {
    try {
        const { collections } = await connectDatabase();
        app.use(attachCollections(collections));

        const models = initializeModels(collections);
        const controllers = initializeControllers(models, collections);

        userRoutes(app, controllers);
        parcelRoutes(app, controllers);
        riderRoutes(app, controllers);
        trackingRoutes(app, controllers);
        paymentRoutes(app, controllers);
        contactRoutes(app, controllers);
        reviewRoutes(app, controllers);

        app.use(notFoundHandler);
        app.use(errorHandler);

        app.listen(port, () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Server listening on port ${port}`);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
