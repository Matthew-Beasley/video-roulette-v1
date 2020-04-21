import React /* useState */ from "react";

const Login = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const onSubmit = (ev) => {
  //   ev.preventDefault();
  //   console.log(email, password);
  //   try {
  //     axios.get("/api/auth");
  //   } catch (ex) {
  //     setError(ex.response.data.message);
  //     console.log(error);
  //   }
  // };

  return (
    <div>
      <div className="text-center">
        <h1 className="logo">ChatParty</h1>
        <p>A PARTY WITH FRIENDS YOU'VE NEVER MET</p>
      </div>
      <br />
      <form
        className="form-inline justify-content-center"
        method="GET"
        action="/api/auth"
      >
        <div className="form-group">
          <p>
            <a className="btn btn-outline-dark" href="/api/auth" role="button">
              <img
                width="25px"
                alt="Google sign-in"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />
              &nbsp;&nbsp;&nbsp; Login with Google
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
