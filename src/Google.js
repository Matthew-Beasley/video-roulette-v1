import React from "react";

const Google = () => (
  <div className="container">
    <div className="row justify-content-center align-items-center">
      <form method="GET" action="/api/auth">
        <div className="field is-centered">
          <p className="control has-text-centered">
            <a className="btn btn-outline-dark" href="/api/auth" role="button">
              <img
                width="25px"
                alt="Google sign-in"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />{" "}
              Login with Google
            </a>
          </p>
        </div>
      </form>
    </div>
  </div>
);

export default Google;
