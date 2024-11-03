require('dotenv').config();
const { Client } = require('pg');

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (255),
    last_name VARCHAR (255),
    username VARCHAR (255),
    password VARCHAR (255),
    membership_status VARCHAR (255) DEFAULT 'Non Member',
    is_admin BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR (255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    text TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  INSERT INTO users (first_name, last_name, username, password, membership_status, is_admin)
  VALUES 
    ('John', 'Weak', 'johnweak', 'johnweak', 'Administrator', TRUE);
    
  INSERT INTO users (first_name, last_name, username, password, membership_status)
  VALUES  
    ('Amy', 'Stake', 'amystake', 'amystake', 'Club Member'),
    ('Dead', 'Inside', 'deadinside', 'deadinside', 'Club Member'),
    ('Chicken', 'Dinner', 'chickendinner', 'chickendinner', 'Club Member'),
    ('Ketchup', 'Bottle', 'ketchupbottle', 'ketchupbottle', 'Club Member'),
    ('Brush', 'Lee', 'brushlee', 'brushlee', 'Club Member');

  INSERT INTO users (first_name, last_name, username, password)
  VALUES 
    ('Unsupervised', 'Child', 'unsupervisedchild', 'unsupervisedchild');

  INSERT INTO posts (title, timestamp, text, user_id)
  VALUES
    ('One sentence horror', '2023-10-03 04:33:00', 'He awoke to find a picture of himself sleeping on his phone.', 3),
    ('Anyone wanna hangout tonight?', '2023-10-23 11:23:23', '11:30 pm at XXX bar, I will be there until 3:00 am', 5),
    ('Free cookies!', '2023-10-23 12:34:32', 'My girlfriend just make some fresh cookies, feel free to drop by and grab some.', 6),
    ('Where is XXX?', '2023-10-23 14:54:34', 'I wanna join Ketchup Bottle tonight, but I wonder where XXX is?', 4),
    ('One sentence horror 2', '2023-10-24 00:12:22', 'As I stared in the mirror, I couldnt quite place what was wrong until my reflection winked at me.', 3),
    ('Who made those cookies?!', '2023-10-24 21:33:03', 'Id had some cookies my dad brought home last night, which made me spent my entire day in the toilet!', 2),
    ('Looking for someone', '2023-11-01 19:21:54', 'My friend has been missing for a few days now. He said he wanna hangout with someone called Mustard Bottle or something few days ago, then he never show up again...', 2),
    ('One sentence horror 3', '2023-11-02 02:01:23', 'I saw someone hangout with Ketchup Bottle that night, Ketchup Bottle was a nice guy.', 3),
    ('Hello, new admin here', '2023-11-02 10:11:14', 'Hello guys, I am a new admin to this club, nice to meet you.', 1),
    ('I ve decided to delete some datas of the club', '2024-11-03 15:42:32', 'All records start from 3 Nov 2023 until 3 Nov 2024 are deleted. Please do not ask why. This club is SAFE.', 1),
    ('One year passed...', '2024-11-03 23:12:02', 'One year since my friend was gone, never get to see him since then...', 2);
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