if (!process.env.IS_PRODUCTION) {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const cors = require("cors");
const _ = require("lodash");
const { buildDB } = require("./dataLayer/modelsIndex");
const { createUser } = require("./dataLayer/modelsIndex");
const { apiRouter } = require("./apiLayer/apiRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/api", apiRouter);

app.get("/", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    return next();
  } else {
    const error = Error("not authorized");
    error.status = 401;
    next(error);
  }
});

//maybe rethink this error handling
app.use((req, res, next) => {
  next({
    status: 404,
    message: `Page not found for ${req.method} ${req.url}`,
  });
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message || JSON.stringify(err),
  });
});

buildDB(); // Not crazy about blowing the db away but I guess it's best for dev
 /*const func = async () => {
   await createUser({
     userName: "changeMe",
     firstName: "dave",
     lastName: "theBrave",
     email: "test@gmail.com",
     password: "test",
     googleId: "1234",
   });
 };
 func();
*/
app.listen(PORT, () => console.log("Listening on PORT ", PORT));
