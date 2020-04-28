 /* eslint-disable guard-for-in */
const { client } = require("./client");
const { hash } = require("./auth");

const createUser = async ({
  userName,
  firstName,
  lastName,
  email,
  password,
  googleId,
  imageURL
}) => {
  const sql = `
  INSERT INTO users ("userName", "firstName", "lastName", email, password, "googleId", "imageURL")
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING * ;`;
  return (
    await client.query(sql, [
      userName,
      firstName,
      lastName,
      email,
      await hash(password),
      googleId,
      imageURL
    ])
  ).rows[0];
};

const readUsers = async () => {
  const sql = "SELECT * FROM users";
  return (await client.query(sql)).rows;
};

const getUser = async (identifier) => {
  const key = Object.keys(identifier)[0];
  const sql = `
  SELECT * FROM users
  WHERE "${key}" = $1;`;
  return (await client.query(sql, [identifier[key]])).rows[0];
};

const updateUser = async (request) => {
  let set = "SET";
  let where = "WHERE";
  let position = 1;
  const args = [];
  for (let key in request) {
    if (key !== "email") {
      set += ` "${key}" = $${position}`;
      args.push(request[key]);
    } else if (key === "email") {
      where += ` "email" = $${position}`;
      args.push(request[key]);
    }
    position++;
  }
  const sql = `
    UPDATE users
    ${set}
    ${where}
    returning * ;`;
  return (await client.query(sql, args)).rows[0];
};

const deleteUser = async ({ userName }) => {
  const sql = `
  DELETE FROM users
  WHERE "userName" = $1`;
  await client.query(sql, [userName]);
};

module.exports = {
  createUser,
  readUsers,
  getUser,
  updateUser,
  deleteUser,
};
