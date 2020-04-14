const express = require("express");
const { usersRouter } = require("./usersRoutes");
const { openTokRouter } = require("./openTokRoutes");
const { voteRouter } = require("./voteRoutes");

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/opentok", openTokRouter);
apiRouter.use("/votes", voteRouter);

module.exports = { apiRouter };
