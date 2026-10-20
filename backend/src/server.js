const config = require('./app/config');
const { connectDatabase } = require('./app/lib/database');
const { createApp } = require('./app');

async function startServer() {
    try {
        const { collections } = await connectDatabase();
        const app = createApp(collections);

        app.listen(config.port, () => {
            if (config.nodeEnv !== 'production') {
                console.log(`Server listening on port ${config.port}`);
            }
        });

        return app;
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = { startServer };
