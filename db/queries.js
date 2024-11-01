const pool = require('./pool');

async function createUser(firstName, lastName, username, password) {
  await pool.query(`
    INSERT INTO users (first_name, last_name, username, password)
    VALUES ($1, $2, $3, $4)
  `, [firstName, lastName, username, password]);
}

async function getUserById(userId) {
  const { rows } = await pool.query(`
    SELECT * FROM users
    WHERE id = $1
  `, [userId]);
  return rows[0];
}

async function getUserByUsername(username) {
  const { rows } = await pool.query(`
    SELECT * FROM users
    WHERE username = $1
  `, [username]);
  return rows[0];
}

async function setMembership(username, membership) {
  await pool.query(`
    UPDATE users
    SET membership_status = $2
    WHERE username = $1
  `, [username, membership]);
}

async function insertPost(title, content, userId) {
  const { rows } = await pool.query(`
    INSERT INTO posts (title, timestamp, text, user_id)
    VALUES ($1, CURRENT_TIMESTAMP(0), $2, $3)
    RETURNING id
  `, [title, content, userId]);
  return rows[0].id;
}

function processPostsDetails(posts) {
  const processedPosts = [];

  posts.forEach(post => {
    const { title, timestamp, text, username } = post;
    const processedTimestamp = new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    processedPosts.push({ 
      title, 
      timestamp: processedTimestamp, 
      text, 
      username 
    });
  });
  
  return processedPosts;
}

async function getPostDetails(postId) {
  const { rows } = await pool.query(`
    SELECT * FROM users JOIN posts 
    ON users.id = posts.user_id
    WHERE posts.id = $1
  `, [postId]);
  const processedPost = processPostsDetails(rows);
  return processedPost[0];
}

async function getAllPosts() {
  const { rows } = await pool.query(`
    SELECT * FROM users JOIN posts 
    ON users.id = posts.user_id  
  `);
  const processedPost = processPostsDetails(rows);
  return processedPost;
}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  setMembership,
  insertPost,
  getPostDetails,
  getAllPosts,
}