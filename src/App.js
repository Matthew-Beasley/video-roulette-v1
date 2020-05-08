/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from "react";
import { Route, Redirect, Link, useHistory } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import Login from "./Login";
import axios from "axios";
import CreateUsername from "./CreateUsername";
import LeaderBoard from "./LeaderBoard";

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const history = useHistory();

  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
  }, []);

  const login = async (credentials) => {
    const _token = (await axios.post("/api/simpleauth", credentials)).data
      .token;
    window.localStorage.setItem("token", _token);
    // exchangeTokenForAuth();
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("userId");
    history.push("/login");
  };

  if (!token) {
    return (
      <div className="container-lg h-100">
        <div className="row h-100">
          <div className="my-auto col-sm-12">
            <Login />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container h-100 mw-100">
        <Route
          path="/chat"
          render={() => (
            <ChatRoom
              logout={logout}
              history={history}
              user={user}
              setUser={setUser}
            />
          )}
        />
        <Route
          path="/createusername"
          render={() => <CreateUsername logout={logout} history={history} />}
        />
        <Route path="/login" render={() => <Login login={login} />} />
      </div>
    );
  }
};

export default App;
