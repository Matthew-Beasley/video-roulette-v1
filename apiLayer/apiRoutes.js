const express = require("express");
const { usersRouter } = require("./usersRoutes");
const { openTokRouter } = require("./openTokRoutes");
const { authRouter } = require("./GoogleAuthRoutes");
const { simpleAuthRouter } = require("./simpleAuthRouter");
const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/opentok", openTokRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/simpleauth", simpleAuthRouter);

module.exports = { apiRouter };
