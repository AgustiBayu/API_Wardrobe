const mysql = require("mysql2/promise");

async function getConnection() {

  const mysqlDB = await mysql.createConnection({
    user: "root",
    password: "",
    database: "wardrobe",
    port: "3306",
    host: "localhost",
  });
  return mysqlDB
}

module.exports = { getConnection };
