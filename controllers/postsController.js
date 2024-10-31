function renderCreatePost(req, res) {
  res.render('posts/createPost', {
    user: req.user,
  });
}

module.exports = {
  renderCreatePost,
}