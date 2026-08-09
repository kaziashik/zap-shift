const admin = require('../config/firebase');

const verifyFBToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }

    try {
        const idToken = token.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(idToken);
        // console.log('decoded in the token', decoded);
        req.decoded_email = decoded.email;
        next();
    }
    catch (err) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
}

const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.collections?.users) {
            return res.status(500).send({ message: 'Database collections not available' });
        }

        const user = await req.collections.users.findOne({ email: req.decoded_email });
        if (!user || user.role !== 'admin') {
            return res.status(403).send({ message: 'forbidden access' });
        }

        next();
    } catch (error) {
        return res.status(500).send({ message: 'Error verifying admin', error: error.message });
    }
}

const verifyRider = async (req, res, next) => {
    try {
        if (!req.collections?.users) {
            return res.status(500).send({ message: 'Database collections not available' });
        }

        const user = await req.collections.users.findOne({ email: req.decoded_email });
        if (!user || user.role !== 'rider') {
            return res.status(403).send({ message: 'forbidden access' });
        }

        next();
    } catch (error) {
        return res.status(500).send({ message: 'Error verifying rider', error: error.message });
    }
}

module.exports = { verifyFBToken, verifyAdmin, verifyRider };

