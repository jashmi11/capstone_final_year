const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'userData.db');

(async () => {
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      gender TEXT,
      schoollevel TEXT
    )
  `);
  console.log('User table created (or already exists)');
  await db.close();
})();
