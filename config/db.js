require("dotenv").config();

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
    console.log("CODE:", err.code);
    console.log("ERRNO:", err.errno);
    console.log("SQLSTATE:", err.sqlState);
    console.log("MESSAGE:", err.sqlMessage);
    console.log("FULL DB ERROR:", err);
  } else {
    console.log("✅ MYSQL CONNECTED");
  }
});

module.exports = db;
