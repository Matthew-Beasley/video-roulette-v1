const express = require("express");
const { usersRouter } = require("./usersRoutes");
const { openTokRouter } = require("./openTokRoutes");
const { authRouter } = require("./authRoutes");
const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/opentok", openTokRouter);
apiRouter.use("/auth", authRouter);

module.exports = { apiRouter };
