/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React, { useEffect } from "react";
import { Route, Link, useHistory } from "react-router-dom";
import axios from "axios";
import VideoDisplay from "./VideoDisplay";

const App = () => {
  return (
    <div id="container">
      {/* <Route path="/Register" render={() => <Register />} /> */}
      <Route exact path="/" render={() => <VideoDisplay />} />
    </div>
  );
};

export default App;
