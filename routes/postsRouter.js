const { Router } = require('express');
const postsController = require('../controllers/postsController');
const postsRouter = Router();

postsRouter.get('/create', postsController.createPostGet);

module.exports = postsRouter;