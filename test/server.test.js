const io = require("socket.io");
const axios = require("axios");
const {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
} = require("../dataLayer/modelsIndex");

//test setup and teardown
beforeEach(() => {
  deleteUser({ userName: "chiefthedog" });
  deleteUser({ userName: "jasper" });
});

afterEach(() => {
  deleteUser({ userName: "chiefthedog" });
  deleteUser({ userName: "jasper" });
});

test("Server should return index.html", async () => {
  const index = axios.get("http://localhost:3000/");
  expect(index).toBeDefined();
});

test("User route should create a user", async () => {
  const user = await axios.post("http://localhost:3000/api/users", {
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    password: "password",
  });
  expect(user).toEqual({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    password: "password",
  });
});
