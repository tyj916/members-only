const db = require('../db/queries');

function renderCreatePost(req, res) {
  res.render('posts/createPost', {
    user: req.user,
  });
}

async function handleCreatePost(req, res) {
  const { title, content } = req.body;
  const userId = req.user.id;
  const postId = await db.insertPost(title, content, userId);
  // res.redirect(`/p/${postId}`);
  res.redirect('/');
}

module.exports = {
  renderCreatePost,
  handleCreatePost,
}