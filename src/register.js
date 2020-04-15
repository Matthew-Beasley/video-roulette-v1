import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const onSubmit = (ev) => {
    ev.preventDefault();
    if (confirmPass !== password) {
      setError("Passwords do not match");
      return;
    }
    try {
      axios.post(
        "/api/users",
        {
          userName,
          firstName,
          lastName,
          email,
          password,
        }.catch((ex) => setError(ex.response.data.message))
      );
    } catch (ex) {
      setError(ex.response.data.message);
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <div className="error">{error}</div>
      <form onSubmit={onSubmit} id="registerRoot">
        <div>
          <label for="userName"> Username</label>
          <input type="text" id="userName" name="userName" required></input>
        </div>
        <div>
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" required></input>
        </div>
        <div>
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" required></input>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="email" id="name" name="email" required></input>
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required></input>
        </div>
        <button type="submit">Register</button>
      </form>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Register;
