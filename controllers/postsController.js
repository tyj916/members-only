const db = require('../db/queries');

function renderCreatePost(req, res) {
  res.render('posts/createPost', {
    user: req.user,
  });
}

async function handleCreatePost(req, res) {
  const { title, content } = req.body;
  const { username, id: userId } = req.user;
  const postId = await db.insertPost(title, content, userId);
  res.redirect(`/u/${username}/p/${postId}`);
}

async function renderSinglePostPage(req, res) {
  const { username, postId } = req.params;
  const postDetails = await db.getPostDetails(postId);
  res.render('posts/singlePostPage', {
    post: postDetails,
  });
}

module.exports = {
  renderCreatePost,
  handleCreatePost,
  renderSinglePostPage,
}