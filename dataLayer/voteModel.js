const { client } = require("./client");

const createVote = async ({ voter, votee, voteDirection }) => {
  const sql = `
  INSERT INTO votes (voter, votee, "voteDirection")
  VALUES ($1, $2, $3)
  RETURNING * ;`;
  return (await client.query(sql, [voter, votee, voteDirection])).rows[0];
};

const readVoterVotes = async ( voter ) => {
  const sql = `
  SELECT * FROM votes
  WHERE voter = $1`;
  return (await client.query(sql, [voter])).rows;
};

const readVoteeVotes = async ( votee ) => {
  const sql = `
  SELECT * FROM votes
  WHERE votee = $1`;
  return (await client.query(sql, [votee])).rows;
};

module.exports = {
  createVote,
  readVoterVotes,
  readVoteeVotes
};
