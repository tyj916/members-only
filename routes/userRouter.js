const { Router } = require('express');
const userController = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/sign-up', userController.renderSignUp);
userRouter.post('/sign-up', userController.validateSignUp, userController.handleSignUp);
userRouter.get('/membership', userController.renderJoinMembership);
userRouter.get('/u/:username', userController.renderUserDetails);

module.exports = userRouter;