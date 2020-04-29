import React from "react";
import Vote from "./Vote";

const ChatRoomView = (props) => {
  const {
    user,
    goHome,
    refCountSlct,
    sendStopSignal,
    joinRandomSession,
    refJoinBttn,
    refLeaveBttn,
    connectedUsers,
    connectionIsLoading,
    refSubscriber,
    refMsgDiv,
    sendMessage,
    refMsgBox,
    setMessage,
    message,
  } = props;

  return (
    <div className="h-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#/chat">
          {user.imageURL ? (
            <img
              className="rounded-circle"
              src={user.imageURL}
              width="40"
              height="40"
              alt=""
            />
          ) : (
            <img src="../assets/orgCicon.png" width="40" height="40" alt="" />
          )}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#/chat">
                Chat <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/chat">
                {/* Need to change the href here once we have voting up */}
                Leaderboards
              </a>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            Welcome&nbsp;
            <a className="mr-3" href="#/chat">
              {user.userName}
            </a>
            <button
              className="btn-md btn-outline-dark my-2 my-sm-0"
              type="button"
              onClick={() => goHome()}
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
      <div id="partyButtons">
        <div className="row h-100">
          <div className="my-auto col-sm-12">
            <div>
              Party Size &nbsp;&nbsp;
              <select id="participants" ref={refCountSlct}>
                <optgroup label="Participants">
                  <option value="2">One on One</option>
                  <option value="9">A Crowd is Fun</option>
                </optgroup>
              </select>
              <br />
              <br />
              <button
                type="button"
                className="btn-md btn-outline-dark"
                ref={refJoinBttn}
                onClick={() => joinRandomSession()}
              >
                Start A Party
              </button>
              &nbsp;&nbsp;
              <button
                className="btn-md btn-outline-dark"
                type="button"
                ref={refLeaveBttn}
                onClick={() => sendStopSignal()}
              >
                Leave The Party
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-lg h-100 mh-100">
        <div className="row h-100">
          <div className="col-sm-12 mt-80 mx-auto justify-content-center text-center h-100 mh-100">
            {connectedUsers.length < 2 ? (
              <div>
                <h2>
                  1. Choose Your Party Size
                  <br />
                  2. Press Start A Party
                  <br />
                  3. Wait For Someone To Join!
                  <br />
                  <br />
                  &#x28;Remember To Downvote The Dinguses&#x29;
                </h2>
                {connectionIsLoading && (
                  <h3 style={{ color: "red" }}>
                    Hold on a sec, connection is loading...
                  </h3>
                )}
                {connectedUsers.length === 1 ? (
                  <h3 style={{ color: "red" }}>Finding Someone To Join...</h3>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            <div className="d-flex flex-row row h-100 mh-100">
              <div
                id="players"
                className={
                  connectedUsers.length < 2
                    ? "d-none col-sm-7 h-100 mh-100"
                    : "col-sm-7 h-100 mh-100"
                }
              >
                <div id="videoContainer" className="row h-auto">
                  <div
                    id="subscriber"
                    ref={refSubscriber}
                    className="mh-100 h-100 w-100"
                  />
                  <div id="bottomCorner">
                    <div id="publisher" className="mh-100 h-auto w-100" />
                  </div>
                </div>
              </div>
              <div className="col-sm-5 mh-50">
                <div
                  id="textchat-display"
                  className={
                    connectedUsers.length < 2
                      ? "d-none col-sm-12 mh-50 h-100"
                      : "col-sm-12 mh-50 h-100"
                  }
                >
                  <Vote
                    connectedUsers={connectedUsers}
                    user={user}
                  />
                  <br />
                  <div className="row">
                    <div className="col-sm-12">
                      <div id="message-box" ref={refMsgDiv} />
                      <form onSubmit={(ev) => sendMessage(ev)}>
                        <input
                          type="text"
                          placeholder="Input your text here"
                          id="msg-text"
                          className="w-100"
                          ref={refMsgBox}
                          value={message}
                          onChange={(ev) => {
                            setMessage(ev.target.value);
                          }} //create form component so video isn't interupted by rerender
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomView;
