const { client } = require("./client");

const buildDB = async () => {
  const sql = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS users;

  CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userName" VARCHAR(100) NOT NULL UNIQUE CHECK(char_length("userName") > 0),
    "firstName" VARCHAR(100) NOT NULL CHECK(char_length("firstName") > 0),
    "lastName" VARCHAR(100) NOT NULL CHECK(char_length("lastName") > 0),
    email VARCHAR(100) NOT NULL CHECK(char_length(email) > 0),
    password VARCHAR(50),
    "googleId" VARCHAR(50)
  );`;
  await client.query(sql);
};

module.exports = { buildDB };
