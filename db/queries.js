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

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  setMembership,
}