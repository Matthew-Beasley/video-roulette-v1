const {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
} = require("./usersModel");
const { buildDB } = require("./buildDB");

module.exports = {
  buildDB,
  createUser,
  readUsers,
  updateUser,
  deleteUser,
};
