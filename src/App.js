/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React, { useEffect } from "react";
import { Route, Link, useHistory } from "react-router-dom";
import axios from "axios";
import VideoDisplay from "./VideoDisplay";
import Login from "./Login";

const App = () => {
  return (
    <div id="container">
<<<<<<< Updated upstream
      <Route path="/Login" render={() => <Login />} />
=======
      <Route path="/login" render={() => <Login />} />
>>>>>>> Stashed changes
      <Route exact path="/" render={() => <VideoDisplay />} />
    </div>
  );
};

export default App;
