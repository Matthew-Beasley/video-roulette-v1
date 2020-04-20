const { client } = require("./client");

const createVote = async ({ direction, fromUser, forUser }) => {
  const sql = `
  INSERT INTO votes (direction, "fromUser", "forUser" )
  VALUES ($1, $2, $3)
  RETURNING *;`;
  return (await client.query(sql, [direction, fromUser, forUser])).rows[0];
};

const readVotes = async () => {
  const sql = "SELECT * FROM votes";
  return (await client.query(sql)).rows;
};

module.exports = {
  createVote,
  readVotes,
};
