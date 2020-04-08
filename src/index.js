import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";

const root = document.querySelector("#root");

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  root
);
