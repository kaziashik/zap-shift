const express = require('express');
const { requireAuth } = require('../../app/middleware/requireAuth');
const { requireAdmin } = require('../../app/middleware/requireAdmin');

const createUserRoutes = (userController) => {
    const router = express.Router();

    router.get('/', requireAuth, userController.getAllUsers.bind(userController));
    router.patch('/profile', requireAuth, userController.updateProfile.bind(userController));
    router.get('/:email/role', requireAuth, userController.getUserRole.bind(userController));
    router.get('/:id', requireAuth, userController.getUserById.bind(userController));
    router.post('/', userController.createUser.bind(userController));
    router.patch('/:id/role', requireAuth, requireAdmin, userController.updateUserRole.bind(userController));

    return router;
};

module.exports = { createUserRoutes };
