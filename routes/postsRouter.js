const { Router } = require('express');
const postsController = require('../controllers/postsController');
const postsRouter = Router();

postsRouter.get('/create', postsController.renderCreatePost);
postsRouter.post('/create-post', postsController.handleCreatePost);

module.exports = postsRouter;