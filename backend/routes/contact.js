const { validateContact } = require('../middleware/validate');
const { verifyFBToken, verifyAdmin } = require('../middleware/auth');

function contactRoutes(app, controllers) {
    const contactController = controllers.contact;

    app.post('/contact', validateContact, (req, res, next) =>
        contactController.createContact(req, res, next)
    );

    app.get('/contact', verifyFBToken, verifyAdmin, (req, res, next) =>
        contactController.getContacts(req, res, next)
    );
}

module.exports = contactRoutes;
