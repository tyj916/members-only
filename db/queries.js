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

async function setAdmin(username) {
  await pool.query(`
    UPDATE users
    SET is_admin = TRUE
    WHERE username = $1
  `, [username]);
}

async function insertPost(title, content, userId) {
  const { rows } = await pool.query(`
    INSERT INTO posts (title, timestamp, text, user_id)
    VALUES ($1, CURRENT_TIMESTAMP(0), $2, $3)
    RETURNING id
  `, [title, content, userId]);
  return rows[0].id;
}

function processTimestamp(timestamp) {
  const timeDifference = new Date() - new Date(timestamp);
  const PER_MINUTE = 60 * 1000;
  const PER_HOUR = 60 * PER_MINUTE;
  const PER_DAY = 24 * PER_HOUR;
  const PER_YEAR = 365 * PER_DAY;
  
  if (timeDifference > PER_YEAR) {
    // return time in date DD MM YYYY format
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  
  if (timeDifference > PER_DAY) {
    // return time in date DD MM format
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
  }
  
  if (timeDifference > PER_HOUR) {
    // return time in hours
    return Math.round(timeDifference / (60 * 60 * 1000)) + ' h';
  }
  
  if (timeDifference > PER_MINUTE) {
    // return time in minutes
    return Math.round(timeDifference / (60 * 1000)) + ' m';
  }

  // return time in seconds
  return Math.round(timeDifference / (1000)) + ' s';
}

function processPostsDetails(posts) {
  const processedPosts = [];

  posts.forEach(post => {
    const { id, title, timestamp, text, username } = post;
    const processedTimestamp = processTimestamp(timestamp);
    processedPosts.push({ 
      id,
      title, 
      timestamp: processedTimestamp, 
      text, 
      username,
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

async function getPostsByUserId(userId) {
  const { rows } = await pool.query(`
    SELECT * FROM users JOIN posts
    ON users.id = posts.user_id
    WHERE users.id = $1
  `, [userId]);
  const processedPost = processPostsDetails(rows);
  return processedPost;
}

async function deletePost(postId) {
  await pool.query(`
    DELETE FROM posts WHERE id = $1
  `, [postId]);
}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  setMembership,
  setAdmin,
  insertPost,
  getPostDetails,
  getAllPosts,
  getPostsByUserId,
  deletePost,
}