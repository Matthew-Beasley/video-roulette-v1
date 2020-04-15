//currently not used

// const authRouter = require("express").Router();
// const qs = require("querystring");
// const axios = require("axios");

// const redirect_uri =
//   process.env.REDIRECT_URI || "http://localhost:3000/api/auth/callback";
// const emailScope = "https://www.googleapis.com/auth/userinfo.email";
// const userScope = "https://www.googleapis.com/auth/userinfo.profile";

// authRouter.get("/", (req, res) => {
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?${qs.stringify({
//     response_type: "code",
//     scope: `${emailScope} ${userScope}`,
//     redirect_uri,
//     client_id: process.env.GOOG_CLIENT_ID,
//   })}`;

//   res.redirect(url);
// });

// module.exports = { authRouter };
