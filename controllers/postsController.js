async function createPostGet(req, res) {
  res.render('posts/createPost');
}

async function getAllPosts(req, res) {
  res.send('All posts');
}

async function getPostsByUsername(req, res) {
  res.send('All posts by someone');
}

async function getPostById(req, res) {
  res.send('A post');
}

module.exports = {
  createPostGet,
  getAllPosts,
  getPostsByUsername,
  getPostById,
}