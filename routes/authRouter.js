const { Router } = require('express');
const authController = require('../controllers/authController');
const authRouter = Router();

authRouter.get('/log-in', authController.logInGet);
authRouter.post('/log-in', authController.validateLogIn, authController.logInPost);
authRouter.get('/log-out', authController.logOut);

module.exports = authRouter;