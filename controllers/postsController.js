const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

function renderCreatePost(req, res) {
  res.render('posts/createPost', {
    user: req.user,
  });
}

const validatePost = [
  body('title').trim()
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters.'),
];

async function handleCreatePost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('posts/createPost', {
      user: req.user,
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;
  const { username, id: userId } = req.user;
  const postId = await db.insertPost(title, content, userId);
  res.redirect(`/u/${username}/p/${postId}`);
}

function processPostDetails(postDetails) {
  const { title, timestamp, text, username } = postDetails;
  const processedTimestamp = new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return { 
    title, 
    timestamp: processedTimestamp, 
    text, 
    username 
  };
}

async function renderSinglePostPage(req, res) {
  const { username, postId } = req.params;
  const postDetails = await db.getPostDetails(postId);
  const processedPostDetails = processPostDetails(postDetails);
  res.render('posts/singlePostPage', {
    post: processedPostDetails,
  });
}

module.exports = {
  renderCreatePost,
  validatePost,
  handleCreatePost,
  renderSinglePostPage,
}