/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React from "react";
import { Route, Link, useHistory } from "react-router-dom";
<<<<<<< HEAD
import axios from "axios";
import VideoDisplay from "./VideoDisplay";
import Login from "./Login";
=======
import PairVideo from "./PairVideo";
import GroupVideo from "./GroupVideo";
>>>>>>> dc20893f047a0dfaed42327976740112ff044de5

const App = () => {
  return (
    <div id="container">
<<<<<<< HEAD
<<<<<<< Updated upstream
      <Route path="/Login" render={() => <Login />} />
=======
      <Route path="/login" render={() => <Login />} />
>>>>>>> Stashed changes
      <Route exact path="/" render={() => <VideoDisplay />} />
=======
      <Link to="/pair">One on One Fun</Link>
      <Link to="/group">Join a Crowd</Link>
      {/* <Route path="/Register" render={() => <Register />} /> */}
      <Route path="/pair" render={() => <PairVideo />} />
      <Route path="/group" render={() => <GroupVideo />} />
>>>>>>> dc20893f047a0dfaed42327976740112ff044de5
    </div>
  );
};

export default App;
