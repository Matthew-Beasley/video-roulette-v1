const express = require("express");
const usersRouter = require("./usersRoutes");
const openTokRouter = require("./openTokRoutes");
const authRouter = require("./GoogleAuthRoutes");
const simpleAuthRouter = require("./simpleAuthRouter");
const voteRouter = require("./voteRoutes");
const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/opentok", openTokRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/simpleauth", simpleAuthRouter);
apiRouter.use("/vote", voteRouter);

module.exports = { apiRouter };
