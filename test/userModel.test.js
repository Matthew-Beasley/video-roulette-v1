const {
  createUser,
  readUsers,
  getUser,
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
    email: "chief the dog@email.com",
    googleId: "1234567"
  });
  expect(chief).toEqual({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    email: "chief the dog@email.com",
    googleId: "1234567"
  });
});

test("userModels readUsers reads all users", async () => {
  const chief = await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    email: "chief the dog@email.com",
    googleId: "1234567"
  });
  const users = await readUsers();
  expect(users[0]).toEqual({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    email: "chief the dog@email.com",
    googleId: "1234567"
  });
});

test("userModels getUser returns the correct user", async () => {
  const chief = await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    email: "chiefthedog@email.com",
    googleId: "1234567"
  });
  const user = await getUser({ email: "chiefthedog@email.com" });
  expect(user).toEqual({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    email: "chief the dog@email.com",
    googleId: "1234567",
  });
});

test("userModels updateUser updates firstName only", async () => {
  await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    email: "chief the dog@email.com",
    googleId: "1234567",
  });
  const jasper = await updateUser({
    userName: "chiefthedog",
    firstName: "jasper",
  });
  expect(jasper).toEqual({
    userName: "chiefthedog",
    firstName: "jasper",
    lastName: "dog",
    email: "chief the dog@email.com",
    googleId: "1234567",
  });
});

test("userModels deleteUser deletes a user called chiefthedog", async () => {
  const chief = await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    email: "chief the dog@email.com",
    googleId: "1234567",
  });
  await deleteUser({ userName: "chiefthedog" });
  const users = await readUsers();
  const results = users.filter((user) => user.userName === "chiefthedog");
  expect(results.length).toEqual(0);
});

