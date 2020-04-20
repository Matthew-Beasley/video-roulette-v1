// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Register = () => {
//   const onSubmit = (ev) => {
//     ev.preventDefault();
//     if (confirmPass !== password) {
//       setError("Passwords do not match");
//       return;
//     }
//     try {
//       axios.post(
//         "/api/users",
//         {
//           userName,
//           firstName,
//           lastName,
//           email,
//           password,
//         }.catch((ex) => setError(ex.response.data.message))
//       );
//     } catch (ex) {
//       setError(ex.response.data.message);
//       console.log(error);
//     }
//   };

//   return (
//     <div>
//       <h1>Register</h1>
//       <div className="error">{error}</div>
//       <form onSubmit={onSubmit} id="registerRoot">
//         <div>
//           <label for="userName"> Username</label>
//           <input type="text" id="userName" name="userName" required></input>
//         </div>
//         <div>
//           <label for="firstName">First Name</label>
//           <input type="text" id="firstName" name="firstName" required></input>
//         </div>
//         <div>
//           <label for="lastName">Last Name</label>
//           <input type="text" id="lastName" name="lastName" required></input>
//         </div>
//         <div>
//           <label for="email">Email</label>
//           <input type="email" id="name" name="email" required></input>
//         </div>
//         <div>
//           <label for="password">Password</label>
//           <input type="password" id="password" name="password" required></input>
//         </div>
//         <button type="submit">Register</button>
//       </form>
//       <Link to="/login">Login</Link>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
const CreateAccount = ({ createAccount }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onSubmit = (ev) => {
    ev.preventDefault();
    createAccount({ username, firstName, lastName, password })
      .then(() => {
        setError("");
        window.location.hash = "#";
      })
      .catch((ex) => {
        setError(ex.response.data.message);
      });
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Create Account</h2>
        <div>{error}</div>
        <div>Username</div>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <div>First Name</div>
        <input
          value={firstName}
          onChange={(ev) => setFirstName(ev.target.value)}
        />
        <div>Last Name</div>
        <input
          value={lastName}
          onChange={(ev) => setLastName(ev.target.value)}
        />
        <div>Password</div>
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button>Submit</button>
      </form>
      <button
        type="button"
        onClick={() => {
          window.location.hash = "#";
        }}
      >
        Sign In
      </button>
    </div>
  );
};
export default CreateAccount;
