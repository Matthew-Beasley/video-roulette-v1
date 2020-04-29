const {
  createUser,
  readUsers,
  getUser,
  updateUser,
  deleteUser
} = require("../dataLayer/modelsIndex");

//test setup and teardown
beforeEach(() => {
  deleteUser({ userName: "chiefthedog01" });
  deleteUser({ userName: "jasperthedog01" });
});

afterEach(() => {
  deleteUser({ userName: "chiefthedog01" });
  deleteUser({ userName: "jasperthedog01" });
});

//actual tests
test("userModelscreateUser creates a user called chiefthedog", async () => {
  const chief = await createUser({
    userName: "chiefthedog01",
    firstName: "chief",
    lastName: "dog",
    email: "chiefthedog@email.com",
    googleId: "1234567",
    password: "testpwd"
  });
  expect(chief).toEqual(
    expect.objectContaining({
    userName: "chiefthedog01",
    firstName: "chief",
    lastName: "dog",
    email: "chiefthedog@email.com",
    googleId: "1234567"
    })
  );
});

test("userModels readUsers reads all users", async () => {
  const chief = await createUser({
    userName: "chiefthedog01",
    firstName: "chief",
    lastName: "dog",
    email: "chiefthedog@email.com",
    googleId: "1234567",
    password: "testpwd"
  });
  const users = await readUsers();
  const results = users.filter((user) => user.userName === "chiefthedog01");
  expect(results[0]).toEqual(
    expect.objectContaining({
      userName: "chiefthedog01",
      firstName: "chief",
      lastName: "dog",
      email: "chiefthedog@email.com",
      googleId: "1234567"
    })
  );
});

test("userModels getUser returns the correct user", async () => {
  await createUser({
    userName: "chiefthedog01",
    firstName: "chief",
    lastName: "dog",
    email: "chiefthedog@email.com",
    googleId: "1234567",
    password: "testpwd"
  });
  const user = await getUser({ userName: "chiefthedog01" });
  expect(user).toEqual(
    expect.objectContaining({
      userName: "chiefthedog01",
      firstName: "chief",
      lastName: "dog",
      email: "chiefthedog@email.com",
      googleId: "1234567"
    })
  );
});

test("userModels updateUser updates firstName only", async () => {
  await createUser({
    userName: "chiefthedog01",
    firstName: "chief",
    lastName: "dog",
    email: "chiefthedog@email.com",
    googleId: "1234567",
    password: "testpwd"
  });
  const jasper = await updateUser({
    email: "chiefthedog@email.com",
    firstName: "jasper",
  });
  expect(jasper).toEqual(
    expect.objectContaining({
      userName: "chiefthedog01",
      firstName: "jasper",
      lastName: "dog",
      email: "chiefthedog@email.com",
      googleId: "1234567"
    })
  );
});

test("userModels deleteUser deletes a user called chiefthedog", async () => {
  const chief = await createUser({
    userName: "chiefthedog",
    firstName: "chief",
    lastName: "dog",
    email: "chief the dog@email.com",
    googleId: "1234567",
    password: "testpwd"
  });
  await deleteUser({ userName: "chiefthedog" });
  const users = await readUsers();
  const results = users.filter((user) => user.userName === "chiefthedog01");
  expect(results.length).toEqual(0);
});

