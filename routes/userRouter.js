const { Router } = require('express');
const userController = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/sign-up', userController.createUserGet);
userRouter.post('/sign-up', userController.validateSignUp, userController.createUserPost);
userRouter.get('/log-in', userController.logInGet);
userRouter.post('/log-in', userController.validateLogIn, userController.logInPost);
userRouter.get('/log-out', userController.logOut);
userRouter.get('/membership', userController.joinMembershipGet);
userRouter.get('/u/:username', userController.getUserDetails);

module.exports = userRouter;