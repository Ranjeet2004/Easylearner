const mysql = require("mysql2");

console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);
console.log("DB:", process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("FULL DB ERROR:", err);
    console.log("🔥 DB FILE LOADED");
  } else {
    console.log("✅ MYSQL CONNECTED");
  }
});

module.exports = db;
