const { Router } = require('express');
const postsController = require('../controllers/postsController');
const postsRouter = Router();

postsRouter.get('/create', postsController.renderCreatePost);
postsRouter.post('/create-post', postsController.validatePost, postsController.handleCreatePost);
postsRouter.get('/u/:username/p/:postId', postsController.renderSinglePostPage);
postsRouter.post('/p/:postId/delete', postsController.deletePost);

module.exports = postsRouter;