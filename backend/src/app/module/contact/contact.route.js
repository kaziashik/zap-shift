const express = require('express');
const { validateContact } = require('../../middleware/validateRequest');
const { verifyFBToken, verifyAdmin } = require('../../middleware/checkAuth');

const createContactRoutes = (contactController) => {
    const router = express.Router();

    router.post('/', validateContact, (req, res, next) =>
        contactController.createContact(req, res, next)
    );
    router.get('/', verifyFBToken, verifyAdmin, (req, res, next) =>
        contactController.getContacts(req, res, next)
    );

    return router;
};

module.exports = { createContactRoutes };
