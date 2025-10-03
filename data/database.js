const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "sql110.infinityfree.com",
  database: "if0_39920462_blog",
  user: "if0_39920462",
  password: "ayan829130",
});

module.exports = pool;
