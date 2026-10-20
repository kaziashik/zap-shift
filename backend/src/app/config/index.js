require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    fbServiceKey: process.env.FB_SERVICE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    siteDomain: process.env.SITE_DOMAIN,
    clientUrl: process.env.CLIENT_URL || '',
    frontendOrigins: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://zap-shift-737f5.web.app',
        'https://zap-shift-737f5.firebaseapp.com',
        ...(process.env.CLIENT_URL || '').split(','),
        process.env.SITE_DOMAIN || ''
    ]
        .map((origin) => origin.trim())
        .filter(Boolean)
};

module.exports = config;
