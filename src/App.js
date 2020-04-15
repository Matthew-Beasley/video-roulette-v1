/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from "react";
import { Route, Redirect, Link, useHistory } from "react-router-dom";
import PairVideo from "./PairVideo";
import GroupVideo from "./GroupVideo";
import Login from "./Login";

const headers = () => {
  const token = window.localStorage.getItem("token");
  return {
    headers: {
      authorization: token,
    },
  };
};

const App = () => {
  const [token, setToken] = useState("");
  const history = useHistory();

  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
  }, []);

  function logout() {
    window.localStorage.removeItem("token");
    setToken("");
    history.push("/login");
  }

  if (!token) {
    return (
      <div>
        <Redirect to="/login" />
        <Route path="/login" render={() => <Login />} />
      </div>
    );
  } else {
    return (
      <div id="container">
        <button onClick={() => logout()}>logout</button>
        <Link to="/pair">One on One Fun</Link>
        <Link to="/group">Join a Crowd</Link>
        <Route path="/pair" render={() => <PairVideo />} />
        <Route path="/group" render={() => <GroupVideo />} />
      </div>
    );
  }
}

export default App;
