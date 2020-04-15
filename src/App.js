/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React from "react";
import { Route, Link, useHistory } from "react-router-dom";
import PairVideo from "./PairVideo";
import GroupVideo from "./GroupVideo";
import Login from "./Login";

const App = () => {
  return (
    <div id="container">
      <Link to="/pair">One on One Fun</Link>
      <Link to="/group">Join a Crowd</Link>
      <Route path="/login" render={() => <Login />} />
      <Route path="/pair" render={() => <PairVideo />} />
      <Route path="/group" render={() => <GroupVideo />} />
    </div>
  );
};

export default App;
