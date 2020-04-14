import React from "react";

//currently not used
const Google = () => (
  <form method="GET" action={"/auth/google"}>
    <div className="field is-centered">
      <p className="control has-text-centered">
        <button type="submit">Log in with Google</button>
      </p>
    </div>
  </form>
);

export default Google;
