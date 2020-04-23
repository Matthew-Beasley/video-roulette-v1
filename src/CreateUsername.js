import React, { useState } from "react";
import Axios from "axios";

const CreateUserName = ({ history, logout }) => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async(ev) => {
    ev.preventDefault();
    const email = window.localStorage.getItem("email");
    
    const testUser = await Axios.post("/api/users/getuser", { userName: userName });
    console.log("userName  is ", userName)
    console.log("test user is ", testUser)
    if (testUser.data) {
      console.log(testUser)
      alert("You need a unique user name, please try again");
      return;
    }
    try {
      await Axios.put("/api/users", {
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
          <button className="btn-sm btn-outline-dark" disabled={userName.length < 1}>
            &nbsp;&nbsp;Create Username&nbsp;&nbsp;
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserName;
