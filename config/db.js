db.connect((err) => {
  if (err) {
    console.log("CODE:", err.code);
    console.log("ERRNO:", err.errno);
    console.log("SQLSTATE:", err.sqlState);
    console.log("MESSAGE:", err.sqlMessage);
    console.log(err);
  } else {
    console.log("✅ MYSQL CONNECTED");
  }
});
