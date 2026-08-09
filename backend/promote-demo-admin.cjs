require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mx107ng.mongodb.net/?appName=Cluster0`;
  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db('zap_shift_db').collection('users');
  const email = 'demo@zapshift.com';
  const existing = await users.findOne({ email }, { projection: { role: 1, email: 1 } });
  if (!existing) {
    await users.insertOne({ email, displayName: 'Demo User', role: 'admin', createdAt: new Date() });
    console.log('inserted demo as admin');
  } else {
    const r = await users.updateOne({ email }, { $set: { role: 'admin' } });
    console.log('updated demo to admin', { matched: r.matchedCount, modified: r.modifiedCount, prevRole: existing.role });
  }
  const after = await users.findOne({ email }, { projection: { role: 1 } });
  console.log('demo role now', after.role);
  await client.close();
})().catch(e => { console.error(e.message); process.exit(1); });
