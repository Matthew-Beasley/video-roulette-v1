const express = require("express");
const { usersRouter } = require("./usersRoutes");
const { openTokRouter } = require("./openTokRoutes");

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/opentok", openTokRouter);


module.exports = { apiRouter };
