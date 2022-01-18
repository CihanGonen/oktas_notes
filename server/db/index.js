require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: process.env.DB_PASS,
  host: "localhost",
  port: 5432,
  database: process.env.DB_NAME,
});

module.exports = pool;
