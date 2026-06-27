require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "srv1946.hstgr.io",
  user: "u203717998_Easyproject",
  password: "Easy@123456789",
  database: "u203717998_Easyproject",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("CONNECTED");
  }
});

module.exports = db;
