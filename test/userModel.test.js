const {
  createUser,
  readUsers,
  updateUser,
  deleteUser
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

//actual tests
test("userModelscreateUser creates a user called chiefthedog", async () => {
  const chief = await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    password: "password",
  });
  expect(chief).toEqual({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    password: "password",
  });
});

test("userModels readUsers reads all users", async () => {
  const chief = await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    password: "password",
  });
  const users = await readUsers();
  expect(users[0]).toEqual({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    password: "password",
  });
});

test("userModels updateUser updates firstName only", async () => {
  await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    password: "password",
  });
  const jasper = await updateUser({
    userName: "chiefthedog",
    firstName: "jasper",
  });
  expect(jasper).toEqual({
    userName: "chiefthedog",
    firstName: "jasper",
    lastName: "dog",
    password: "password",
  });
});

test("userModels deleteUser deletes a user called chiefthedog", async () => {
  const chief = await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    password: "password",
  });
  await deleteUser({ userName: "chiefthedog" });
  const users = await readUsers();
  const results = users.filter((user) => user.userName === "chiefthedog");
  expect(results.length).toEqual(0);
});

