const express = require('express');
const { validateContact } = require('./contact.validator');
const { requireAuth } = require('../../app/middleware/requireAuth');
const { requireAdmin } = require('../../app/middleware/requireAdmin');

const createContactRoutes = (contactController) => {
    const router = express.Router();

    router.post('/', validateContact, contactController.createContact.bind(contactController));
    router.get('/', requireAuth, requireAdmin, contactController.getContacts.bind(contactController));

    return router;
};

module.exports = { createContactRoutes };
