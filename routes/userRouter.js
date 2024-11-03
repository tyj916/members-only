const { Router } = require('express');
const userController = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/join-member', userController.renderJoinMembership);
userRouter.post('/join-member', userController.validateMemberPasscode, userController.handleJoinMembership);
userRouter.get('/u/:username', userController.renderUserDetails);

module.exports = userRouter;