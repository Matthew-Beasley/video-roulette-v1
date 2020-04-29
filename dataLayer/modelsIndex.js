const {
  createUser,
  readUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("./usersModel");

const { buildDB } = require("./buildDB");

const { findUserFromToken, authenticate, compare, hash } = require("./auth");

const {
  createVote,
  readVotes,
  readVotesRanked,
  readVoterVotes,
  readVoteeVotes,
} = require("./voteModel");

module.exports = {
  buildDB,

  createUser,
  readUsers,
  getUser,
  updateUser,
  deleteUser,

  findUserFromToken,
  authenticate,
  compare,
  hash,

  createVote,
  readVotes,
  readVotesRanked,
  readVoterVotes,
  readVoteeVotes,
};
