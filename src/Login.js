import React, { useState } from "react";
import { Route, Link } from "react-router-dom";
import Google from "./Google";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onSubmit = (ev) => {
    ev.preventDefault();
    login({ email, password }).catch((ex) =>
      setError(ex.response.data.message)
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <h1>LOGIN</h1>
      </div>
      <div className="row justify-content-center align-items-center">
        <form
          onSubmit={onSubmit}
          //substituted form action with onSubmit function
          // method="GET"
          // action={"/api/auth"}
        >
          <div>
            <input
              className="input form-control"
              name="email"
              type="text"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="E-mail Address"
            />
          </div>
          <div>
            <input
              className="input form-control"
              name="password"
              type="text"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              placeholder="Password"
            />
          </div>
          <div className="field is-centered">
            <div className="has-text-centered">
              <button type="submit">Login</button>{" "}
              <Link to="/create-account">Create Account</Link>
              <Route
                path="/create-account"
                render={() => <CreateAccount createAccount={createAccount} />}
              />
            </div>
          </div>
        </form>
        <Google />
      </div>
    </div>
  );
};

export default Login;
