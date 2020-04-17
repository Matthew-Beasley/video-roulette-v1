/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from "react";
import { Route, Redirect, Link, useHistory } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import Login from "./Login";
import axios from "axios";
import CreateAccount from "./CreateAccount";

// const headers = () => {
//   const token = window.localStorage.getItem("token");
//   return {
//     headers: {
//       authorization: token,
//     },
//   };
// };

const App = () => {
  const [token, setToken] = useState("");
  const history = useHistory();

  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
  }, []);

  // const exchangeTokenForAuth = async () => {
  //   const response = await axios.get("/api/simpleauth", headers());
  //   setAuth(response.data);
  // };

  const login = async (credentials) => {
    const _token = (await axios.post("/api/simpleauth", credentials)).data
      .token;
    window.localStorage.setItem("token", _token);
    // exchangeTokenForAuth();
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("email")
    setToken("");
    history.push("/login");
  };

  const createAccount = async (newUser) => {
    const response = (await axios.post("/api/simpleauth/users", newUser)).data;
    window.localStorage.setItem("token", response.token);
    // setAuth(response.user);
    // setError("");
  };

  // useEffect(() => {
  //   exchangeTokenForAuth();
  // }, []);
  // && history.hash === "/login"
  console.log(token);
  if (!token) {
    return (
      <div>
        <Redirect to="/login" />
        <Route
          path="/login"
          render={() => <Login login={login} createAccount={createAccount} />}
        />
        <Route
          path="/create-account"
          render={() => <CreateAccount createAccount={createAccount} />}
        />
      </div>
    );
  } else {
    return (
      <div id="container">
        <button onClick={() => logout()}>logout</button>
        <Link to="/chat">One on One Fun</Link>
        <Route path="/chat" render={() => <ChatRoom />} />
      </div>
    );
  }
};

export default App;
