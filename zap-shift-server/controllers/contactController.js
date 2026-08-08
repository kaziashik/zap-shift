class ContactController {
    constructor(models) {
        this.Contact = models.Contact;
    }

    async createContact(req, res, next) {
        try {
            const payload = {
                name: String(req.body.name).trim(),
                email: String(req.body.email).trim().toLowerCase(),
                subject: String(req.body.subject).trim(),
                message: String(req.body.message).trim()
            };

            const result = await this.Contact.create(payload);
            res.status(201).json({
                success: true,
                message: 'Message received',
                insertedId: result.insertedId
            });
        } catch (error) {
            next(error);
        }
    }

    async getContacts(req, res, next) {
        try {
            const result = await this.Contact.findAll();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ContactController;
