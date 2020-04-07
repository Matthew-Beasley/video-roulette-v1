const express = require("express");
const { usersRouter } = require("./usersRoutes");

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);


module.exports = { apiRouter };
