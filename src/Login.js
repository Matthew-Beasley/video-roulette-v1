import React, { useState } from "react";
import { Route, Link } from "react-router-dom";
import CreateAccount from "./CreateAccount";

// handleSubmit from Justin's project
// const handleSubmit = async (ev) => {
//   ev.preventDefault();
//   try {
//     const res = await axios.put("/auth/local/login", {
//       ...this.state.values,
//     });

//     if (res.data.error) {
//       this.handleErrors(res.data.error);
//     } else {
//       this.props._loginUser(res.data);
//       window.history.back();
//     }
//   } catch (err) {
//     if (err.message.includes("401")) {
//       this.handleErrors({ auth: "Invalid email or password." });
//     } else {
//       console.error(err);
//     }
//   }
// };

const Login = ({ login, createAccount }) => {
  return (
<<<<<<< HEAD
    <div>
      <div className="text-center">
        <h1>
          <ul className="c-rainbow">
            <li className="c-rainbow__layer c-rainbow__layer--white">
              PARTY WITH FRIENDS YOU'VE NEVER MET
            </li>
            <li className="c-rainbow__layer c-rainbow__layer--orange">
              PARTY WITH FRIENDS YOU'VE NEVER MET
            </li>
            <li className="c-rainbow__layer c-rainbow__layer--red">
              PARTY WITH FRIENDS YOU'VE NEVER MET
            </li>
            <li className="c-rainbow__layer c-rainbow__layer--violet">
              PARTY WITH FRIENDS YOU'VE NEVER MET
            </li>
            <li className="c-rainbow__layer c-rainbow__layer--blue">
              PARTY WITH FRIENDS YOU'VE NEVER MET
            </li>
            <li className="c-rainbow__layer c-rainbow__layer--green">
              PARTY WITH FRIENDS YOU'VE NEVER MET
            </li>
            <li className="c-rainbow__layer c-rainbow__layer--yellow">
              PARTY WITH FRIENDS YOU'VE NEVER MET
            </li>
          </ul>
        </h1>

        <br />
      </div>
      <Google />
=======
  <div className="container">
    <div className="row justify-content-center align-items-center">
      <form method="GET" action="/api/auth">
        <div className="field is-centered">
          <p className="control has-text-centered">
            <a className="btn btn-outline-dark" href="/api/auth" role="button">
              <img
                width="25px"
                alt="Google sign-in"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />{" "}
              Login with Google
            </a>
          </p>
        </div>
      </form>
>>>>>>> 875192398b2b7d7ab88a17a84b6248aabdaebc29
    </div>
  </div>
  )
}

export default Login;
