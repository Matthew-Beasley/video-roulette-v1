const express = require("express");
const {
  createUser,
  readUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../dataLayer/modelsIndex");

const usersRouter = express.Router();

//dont even think we are using this one
usersRouter.post("/google", async (req, res, next) => {
  try {
    const data = await createUser(req.body);
    res.send(data);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const data = await readUsers();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/getuser", async (req, res, next) => {
  try {
    const user = await getUser(req.body);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/", async (req, res, next) => {
  try {
    const data = await updateUser(req.body);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:username", async (req, res, next) => {
  try {
    await deleteUser(req.params.username);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
