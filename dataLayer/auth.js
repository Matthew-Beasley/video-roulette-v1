// don't need unless we want a simple login
// const bcrypt = require("bcrypt");
// const jwt = require("jwt-simple");
// const client = require("./client");

// const findUserFromToken = async (token) => {
//   // const id = jwt.decode(token, process.env.JWT).id;
//   if (window.localStorage.getItem("token")){
//   const id = await
//   }
//   const user = (await client.query("SELECT * FROM users WHERE id = $1", [id]))
//     .rows[0];
//   delete user.password;
//   return user;
// };

// const hash = (password) => {
//   return new Promise((resolve, reject) => {
//     bcrypt.hash(password, 10, (error, hashed) => {
//       if (error) {
//         return reject(error);
//       }
//       return resolve(hashed);
//     });
//   });
// };

// const compare = ({ plain, hashed }) => {
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(plain, hashed, (error, verified) => {
//       if (error) {
//         return reject(error);
//       }
//       if (verified) {
//         return resolve();
//       }
//       reject(Error("bad credentials"));
//     });
//   });
// };

// const authenticate = async ( googleId ) => {
//   const user = (
//     await client.query('SELECT * FROM users WHERE "googleId"=$1', [googleId])
//   ).rows[0];
//   if (token);
//   return jwt.encode({ id: user.id }, process.env.JWT);
// };

// module.exports = {
//   findUserFromToken,
//   authenticate,
//   // compare,
//   hash,
// };
