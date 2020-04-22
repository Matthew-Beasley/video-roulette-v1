const { client } = require("./client");

const buildDB = async () => {
  const sql = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS votes;
  
  CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userName" VARCHAR(100) NOT NULL UNIQUE CHECK(char_length("userName") > 0),
    "firstName" VARCHAR(100) NOT NULL CHECK(char_length("firstName") > 0),
    "lastName" VARCHAR(100) NOT NULL CHECK(char_length("lastName") > 0),
    email VARCHAR(100) NOT NULL CHECK(char_length(email) > 0),
    password VARCHAR(100),
    "googleId" VARCHAR(100),
    "imageURL" VARCHAR(350)
  );
  
  CREATE TABLE votes(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voter VARCHAR(100) NOT NULL CHECK(char_length("voter") > 0),
    votee VARCHAR(100) NOT NULL CHECK(char_length(votee) > 0),
    "voteDirection" VARCHAR(10) NOT NULL CHECK(char_length("voteDirection") > 1)
  );`;
  await client.query(sql);
};

module.exports = { buildDB };
