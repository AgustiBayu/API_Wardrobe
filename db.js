const pg = require("pg");

const pgDB = new pg.Pool({
  user: "postgres",
  password: "kopidingin",
  database: "wardrobe",
  port: "5432",
  host: "localhost",
});

module.exports = { pgDB };
