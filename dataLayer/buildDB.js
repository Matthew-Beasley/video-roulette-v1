const { client } = require("./client");

const buildDB = async () => {
  const sql = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS users;

  CREATE TABLE users(
    "userName" VARCHAR(100) NOT NULL UNIQUE PRIMARY KEY CHECK(char_length("userName") > 0),
    "firstName" VARCHAR(100) NOT NULL CHECK(char_length("firstName") > 0),
    "lastName" VARCHAR(100) NOT NULL CHECK(char_length("lastName") > 0),
    password VARCHAR(50) NOT NULL CHECK(char_length(password) > 0)
  );`;
  await client.query(sql);
}

module.exports = { buildDB };
