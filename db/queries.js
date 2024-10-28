require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DB_STRING,
});

async function createUser(firstName, lastName, username, password) {
  await pool.query(`
    INSERT INTO users (first_name, last_name, username, password)
    VALUES ($1, $2, $3, $4)
  `, [firstName, lastName, username, password]);
}

async function getUserByUsername(username) {
  const { rows } = await pool.query(`
    SELECT * FROM users
    WHERE username = $1
  `, [username]);
  return rows[0];
}

module.exports = {
  createUser,
  getUserByUsername,
}