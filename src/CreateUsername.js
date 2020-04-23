import React, { useState } from "react";
import Axios from "axios";

const CreateUserName = ({ history, logout }) => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (ev) => {
    ev.preventDefault();
    const email = window.localStorage.getItem("email");
    try {
      Axios.put("/api/users", {
        userName,
        email,
      });
      history.push("/chat");
    } catch (ex) {
      setError(ex.response.data.message);
      console.log(error);
    }
  };

  window.onunload = function () {
    logout();
  };

  return (
    <div className="row h-100">
      <div className="margTop col-sm-12">
        <div className="text-center">
          <h1>CREATE USERNAME</h1>
          <div>{error}</div>
        </div>
        <br />
        <form
          className="form-inline justify-content-center"
          onSubmit={onSubmit}
        >
          <input
            className="input-lg"
            value={userName}
            onChange={(ev) => setUserName(ev.target.value)}
          />
          <button className="btn-sm btn-outline-dark">
            &nbsp;&nbsp;Create Username&nbsp;&nbsp;
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserName;
