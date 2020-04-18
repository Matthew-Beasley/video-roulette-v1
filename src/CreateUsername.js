import React, { useState } from "react";
import Axios from "axios";

const CreateUserName = ({ history }) => {
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

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Create Username</h2>
        <div>{error}</div>
        <div>Username</div>
        <input
          value={userName}
          onChange={(ev) => setUserName(ev.target.value)}
        />
        <button>Create Username</button>
      </form>
    </div>
  );
};

export default CreateUserName;
