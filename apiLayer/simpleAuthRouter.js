const simpleAuthRouter = require("express").Router();
const jwt = require("jwt-simple");

const {
  createUser,
  readUsers,
  getUser,
  updateUser,
  deleteUser,
  findUserFromToken,
  authenticate,
} = require("../dataLayer/modelsIndex");

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const error = Error("not authorized");
    error.status = 401;
    return next(error);
  }
  next();
};

simpleAuthRouter.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  findUserFromToken(token)
    .then((auth) => {
      req.user = auth;
      next();
    })
    .catch((ex) => {
      const error = Error("not authorized");
      error.status = 401;
      next(error);
    });
});

// This is the only method used in this file
// called from line 21 app.js
simpleAuthRouter.post("/", (req, res, next) => {
  authenticate(req.body)
    .then((token) => res.send({ token }))
    .catch(() => {
      const error = Error("not authorized");
      error.status = 401;
      next(error);
    });
});

simpleAuthRouter.get("/", isLoggedIn, (req, res, next) => {
  res.send(req.user);
});

simpleAuthRouter.post("/users", async (req, res, next) => {
  try {
    const data = await createUser({ ...req.body, googleId: "simple" });
    const token = jwt.encode({ id: data.id });
    delete data.password;
    res.send({ data, token });
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

simpleAuthRouter.put("/users/:id", async (req, res, next) => {
  try {
    const user = await updateUser(req.body);
    delete user.password;
    res.send({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = simpleAuthRouter;
