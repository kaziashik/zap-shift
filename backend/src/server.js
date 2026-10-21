/**
 * Single runtime entry:
 * - import/require → does NOT auto-start
 * - node src/server.js → starts HTTP server (local)
 * - Vercel uses ../index.js which re-exports the serverless handler
 */
require('dotenv').config();

const config = require('./app/config');
const { connectDatabase } = require('./app/lib/database');
const { createApp } = require('./app');

let appPromise;

async function getApp() {
    if (!appPromise) {
        appPromise = (async () => {
            const { collections } = await connectDatabase();
            return createApp(collections);
        })();
    }
    return appPromise;
}

async function startServer() {
    const app = await getApp();
    return new Promise((resolve, reject) => {
        try {
            const server = app.listen(config.port, () => {
                if (config.nodeEnv !== 'production') {
                    console.log(`Server listening on port ${config.port}`);
                }
                resolve({ app, server });
            });
            server.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
}

/** Vercel / serverless handler */
async function handler(req, res) {
    const app = await getApp();
    return app(req, res);
}

// Start only when this file is run directly (not when imported)
if (require.main === module && !process.env.VERCEL) {
    startServer().catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}

module.exports = handler;
module.exports.getApp = getApp;
module.exports.startServer = startServer;
module.exports.handler = handler;
