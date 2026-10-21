/**
 * Require authenticated user role === rider (uses req.decoded_email + collections)
 */
const requireRider = async (req, res, next) => {
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
};

module.exports = { requireRider };
