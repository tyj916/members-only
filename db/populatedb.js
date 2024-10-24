require('dotenv').config();
const { Client } = require('pg');

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (255),
    last_name VARCHAR (255),
    username VARCHAR (255),
    password VARCHAR (255),
    membership_status VARCHAR (255) DEFAULT 'Basic'
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR (255),
    timestamp TIMESTAMP,
    text TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.env.DB_STRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done.');
}

main();