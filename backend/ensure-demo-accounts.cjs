/**
 * Ensure Firebase + Mongo demo accounts exist for user / admin / rider.
 * Usage: node ensure-demo-accounts.cjs
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');
const admin = require('./config/firebase');

const demos = [
    { email: 'user@zapshift.com', password: 'User@12345', displayName: 'Demo Customer', role: 'user' },
    { email: 'demo@zapshift.com', password: 'Demo@12345', displayName: 'Demo Admin', role: 'admin' },
    { email: 'rider@zapshift.com', password: 'Rider@12345', displayName: 'Demo Rider', role: 'rider' }
];

async function ensureFirebaseUser({ email, password, displayName }) {
    try {
        const existing = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(existing.uid, { password, displayName });
        return { email, uid: existing.uid, action: 'updated' };
    } catch (err) {
        if (err.code !== 'auth/user-not-found') throw err;
        const created = await admin.auth().createUser({ email, password, displayName, emailVerified: true });
        return { email, uid: created.uid, action: 'created' };
    }
}

(async () => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mx107ng.mongodb.net/?appName=Cluster0`;
    const client = new MongoClient(uri);
    await client.connect();
    const users = client.db('zap_shift_db').collection('users');

    for (const demo of demos) {
        const fb = await ensureFirebaseUser(demo);
        const existing = await users.findOne({ email: demo.email });
        if (!existing) {
            await users.insertOne({
                email: demo.email,
                displayName: demo.displayName,
                role: demo.role,
                createdAt: new Date()
            });
            console.log(demo.email, fb.action, 'firebase + inserted mongo role', demo.role);
        } else {
            await users.updateOne({ email: demo.email }, { $set: { role: demo.role, displayName: demo.displayName } });
            console.log(demo.email, fb.action, 'firebase + mongo role ->', demo.role);
        }
    }

    await client.close();
    console.log('Demo accounts ready.');
})().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
});
