const attachCollections = (collections) => {
    return (req, res, next) => {
        req.collections = collections;
        next();
    };
};

module.exports = { attachCollections };
