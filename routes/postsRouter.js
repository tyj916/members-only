const { Router } = require('express');
const postsController = require('../controllers/postsController');
const postsRouter = Router();

postsRouter.get('/create', postsController.renderCreatePost);
postsRouter.post('/create-post', postsController.handleCreatePost);
postsRouter.get('/u/:username/p/:postId', postsController.renderSinglePostPage);

module.exports = postsRouter;