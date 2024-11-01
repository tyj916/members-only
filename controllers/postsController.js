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

async function renderSinglePostPage(req, res) {
  const { username, postId } = req.params;
  const postDetails = await db.getPostDetails(postId);
  res.render('posts/singlePostPage', {
    user: req.user,
    post: postDetails,
  });
}

async function deletePost(req, res) {
  const { postId } = req.params;
  await db.deletePost(postId);

  // redirect to last location if available
  if (req.get('Referrer') && !req.get('Referrer').endsWith(`/p/${postId}`)) {
    res.location(req.get('Referrer'));
  } else {
    res.location('/');
  }
  res.redirect(res.get('location'));
}

module.exports = {
  renderCreatePost,
  validatePost,
  handleCreatePost,
  renderSinglePostPage,
  deletePost,
}