const admin = require('firebase-admin');
const config = require('../config');

const decoded = Buffer.from(config.fbServiceKey, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decoded);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = admin;
