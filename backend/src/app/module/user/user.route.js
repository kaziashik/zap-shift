const express = require('express');
const { verifyFBToken, verifyAdmin } = require('../../middleware/checkAuth');

const createUserRoutes = (userController) => {
    const router = express.Router();

    router.get('/', verifyFBToken, (req, res) => userController.getAllUsers(req, res));
    router.patch('/profile', verifyFBToken, (req, res) => userController.updateProfile(req, res));
    router.get('/:email/role', verifyFBToken, (req, res) => userController.getUserRole(req, res));
    router.get('/:id', verifyFBToken, (req, res) => userController.getUserById(req, res));
    router.post('/', (req, res) => userController.createUser(req, res));
    router.patch('/:id/role', verifyFBToken, verifyAdmin, (req, res) => userController.updateUserRole(req, res));

    return router;
};

module.exports = { createUserRoutes };
