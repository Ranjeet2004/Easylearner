require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "srv1946.hstgr.io",
  user: "u203717998_Easyproject",
  password: "Easy@123456789",
  database: "u203717998_Easyproject",
  connectTimeout: 10000,
});

db.connect((err) => {
  if (err) {
    console.log("CODE:", err.code);
    console.log("ERRNO:", err.errno);
    console.log("SQLSTATE:", err.sqlState);
    console.log("MESSAGE:", err.sqlMessage);
    console.log("FATAL:", err.fatal);
    console.log(err);
  } else {
    console.log("✅ MYSQL CONNECTED");
  }
});

module.exports = db;
