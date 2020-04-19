const authRouter = require("express").Router();
const qs = require("querystring");
const Axios = require("axios");
const uuid = require("uuid");
const {
  createUser,
  readUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../dataLayer/modelsIndex");

const redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:3000/api/auth/callback";
const emailScope = "https://www.googleapis.com/auth/userinfo.email";
const userScope = "https://www.googleapis.com/auth/userinfo.profile";

authRouter.get("/callback", async (req, res, next) => {
  try {
    const { data } = await Axios.post(
      "https://www.googleapis.com/oauth2/v4/token",
      {
        code: req.query.code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri,
      }
    );
    const { data: _user } = await Axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );

    const values = {
      googleId: _user.id,
      email: _user.email,
      firstName: _user.given_name,
      lastName: _user.family_name,
      password: uuid.v4(),
    };

    if (_user.picture) {
      values.imageURL = _user.picture;
    }

    //may have to change values.email to values.googleId in case someone signs up for simple with gmail
    const user = await getUser({ email: values.email });

    if (user === undefined) {
      createUser({
        userName: uuid.v4(),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        googleId: values.googleId,
      });
      res.send(
        `<script>
        window.localStorage.setItem('token', '${data.id_token}');
        window.localStorage.setItem('email', '${values.email}');
        window.location = '/#/createusername';
        </script>`
      );
    } else {
      res.send(
        `<script>
      window.localStorage.setItem('token', '${data.id_token}');
      window.localStorage.setItem('email', '${values.email}');
      window.location = '/#/chat';
      </script>`
      );
    }
  } catch (error) {
    next(error);
  }
});

authRouter.get("/", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${qs.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    response_type: "code",
    scope: `${emailScope} ${userScope}`,
    redirect_uri,
  })}`;

  res.redirect(url);
});

module.exports = { authRouter };

// const authRouter = require("express").Router();

// authRouter.use("/google", require("./dataLayer/GoogleAuth"));

// authRouter.get("/me", (req, res) => {
//   if (req.user) {
//     res.json(req.user);
//   } else {
//     res.sendStatus(401);
//   }
// });

// authRouter.delete("/logout", (req, res, next) => {
//   if (req.session) {
//     let id;
//     if (req.session.userId) {
//       id = req.session.userId;
//     }

//     req.session.destroy((err) => {
//       if (err) {
//         next(err);
//       } else {
//         id && removeCachedUser(id);
//         res.sendStatus(204);
//       }
//     });
//   } else {
//     res.sendStatus(401);
//   }
// });

// module.exports = { authRouter };
