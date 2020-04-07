const express = require("express");
const {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
} = require("../dataLayer/modelsIndex");

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const data = await createUser(req.body);
    res.send(data);
    console.log(data);
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

usersRouter.put("/", async (req, res, next) => {
  try {
    const data = updateUser(req.body);
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

module.exports = { usersRouter };
