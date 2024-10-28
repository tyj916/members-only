const { Router } = require('express');
const userController = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/sign-up', userController.createUserGet);
userRouter.post('/sign-up', userController.validateSignUp, userController.createUserPost);
userRouter.get('/membership', userController.joinMembershipGet);
userRouter.get('/u/:username', userController.getUserDetails);

module.exports = userRouter;