import React from "react";

const Google = () => (
  <form method="GET" action={"/api/auth"}>
    <div className="field is-centered">
      <p className="control has-text-centered">
        <button type="submit">Log in with Google</button>
      </p>
    </div>
  </form>
);

export default Google;
