/* eslint-disable guard-for-in */
const { client } = require('./client');

const createUser = async ({ userName, firstName, lastName, password }) => {
  const sql = `
  INSERT INTO users ("userName", "firstName", "lastName", password)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`;
  return (await client.query(sql, [userName, firstName, lastName, password])).rows[0];
}

const readUsers = async () => {
  const sql = "SELECT * FROM users";
  return (await client.query(sql)).rows;
}

const updateUser = async (request) => {
  let set = "SET";
  let where = "WHERE";
  let position = 1;
  const args = [];
  for (let key in request) {
    if (key !== "userName") {
      set += ` "${key}" = $${position}`;
      args.push(request[key]);
    } else if (key === "userName") {
      where += ` "userName" = $${position}`;
      args.push(request[key]);
    }
    position++;
  }
  const sql = `
    UPDATE users
    ${set}
    ${where}
    RETURNING *`;
  return (await client.query(sql, args)).rows[0];
};

const deleteUser = async ({ userName }) => {
  const sql = `
  DELETE FROM users
  WHERE "userName" = $1`;
  await client.query(sql, [userName]);
}

module.exports = {
  createUser,
  readUsers,
  updateUser,
  deleteUser
};
