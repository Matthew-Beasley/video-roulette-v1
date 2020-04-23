/* eslint-disable max-statements */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Session } from "@opentok/client";
const OT = require("@opentok/client");

const ChatRoom = ({ logout, history }) => {
  const [user, setUser] = useState({});
  //this comes from the server
  let apiKey;
  let sessionId;
  let token;
  let roomname = 0;
  let session;
  let publisher;
  let subscriber;
  const connectedUsers = {};
  const visitedRooms = [];
  let message;
  let address;
  let location;
  const refMsgDiv = useRef(null);
  const refMsgBox = useRef(null);
  const refJoinBttn = useRef(null);
  const refCountSlct = useRef(null);

  const GEOCODING_API_KEY = "956b9b9ef1974a429c11328a9ef089d0";

  const getUser = async () => {
    const email = window.localStorage.getItem("email");
    const response = await axios.post("/api/users/getuser", { email });
    console.log(location);
    const temp = response.data;
    temp.location = location;
    setUser(temp);
  };

  useEffect(() => {
    if (history.action === "POP") {
      sendStopSignal().then((result) => console.log(result));
    }
  }, [history]);

  window.onunload = function () {
    logout();
  };

  const callGetLocation = async () => {
    // await getMyLocation();
    await getUser();
    console.log(user)
  };

  // console.log(GEOCODING_API_KEY);
  const getMyLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          address = (
            await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?key=${GEOCODING_API_KEY}&q=${position.coords.latitude},${position.coords.longitude}&pretty=1&no_annotations=1`
            )
          ).data;
          // console.log(user);
          location = {
            City: address.results[0].components.city,
            State: address.results[0].components.state_code,
            Country: address.results[0].components["ISO_3166-1_alpha-3"],
          };
          console.log(location);
          resolve(location);
        });
      } else {
        console.log("The Locator was denied. :(");
        reject(Error("The locator was denied."));
      }
    });
  };

  useEffect(() => {
    callGetLocation();
    // getMyLocation().then((val) => getUser());
  }, []);
  const getAuthKeys = async () => {
    console.log(refCountSlct.current.value);
    const response = await axios.post(
      `/api/opentok/chat/${refCountSlct.current.value}`,
      {
        visitedRooms,
        user,
      }
    );

    if (!response) {
      return new Error("Call to /api/opentok/room failed");
    } else {
      apiKey = response.data.apiKey;
      sessionId = response.data.sessionId;
      token = response.data.token;
    }
  };

  function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }

  const initializeSession = () => {
    session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    if (!visitedRooms.includes(sessionId)) {
      session.on("streamCreated", function (event) {
        subscriber = session.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "100%",
            height: "500px",
          },
          handleError
        );
      });
    }
    // Create a publisher
    publisher = OT.initPublisher(
      "publisher",
      {
        name: user.userName,
        style: { nameDisplayMode: "on" },
        insertMode: "append",
        width: "180px",
        height: "120px",
      },
      handleError
    );

    // Connect to the session
    session.connect(token, function (error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
        visitedRooms.push(sessionId);
      }
    });
    session.on("connectionCreated", function connectionCreated(event) {
      const userData = JSON.parse(event.connection.data);
      connectedUsers[userData.userName] = userData;
      //console.log("connectedUsers after create ", connectedUsers)
    });
    session.on("connectionDestroyed", function connectionDestroyed(event) {
      const userData = JSON.parse(event.connection.data);
      delete connectedUsers[userData.userName];
      //console.log("connectedUsers after delete ", connectedUsers)
    });
    // Receive a signal from peer
    session.on("signal:disconnect", function signalCallback(event) {
      if (event.data === "disconnect") {
        alert(`${user.userName} has disconnected (on purpose I hope!)`);
      } else {
        alert(event.data);
      }
    });
    // Receive a message and append it to the history
    session.on("signal:msg", function signalCallback(event) {
      const sender = JSON.parse(session.connection.data).userName;
      const msg = refMsgDiv.current; //.createElement("p");
      msg.innerText += `
      ${sender}
      ${event.data}
      `;
      msg.scrollTop = msg.scrollHeight;
      console.log(msg);
    });
    publisher.on("streamDestroyed", function (event) {
      event.preventDefault();
    });
  };

  // Text chat
  // Send a signal once the user enters data in the form
  const sendMessage = (event) => {
    event.preventDefault();
    session.signal(
      {
        type: "msg",
        data: message,
      },
      function signalCallback(error) {
        if (error) {
          console.error("Error sending signal:", error.name, error.message);
        } else {
          message = "";
        }
      }
    );
    refMsgBox.current.value = ""; //do I have to empty message here as well?
  };

  const sendDisconnectSignal = () => {
    return new Promise((resolve, reject) => {
      session.signal(
        {
          type: "disconnect",
          data: "disconnect",
        },
        function signalCallback(error) {
          if (error) {
            console.error("Error sending signal:", error.name, error.message);
            reject(error);
          } else {
            resolve("Signal sent successfully");
          }
        }
      );
    });
  };

  const leaveSession = async () => {
    refJoinBttn.current.disabled = false;
    await sendDisconnectSignal();
    try {
      await axios.post(`/api/opentok/decrimentsession/${roomname}`);
    } catch (err) {
      console.log(err);
    }
    if (subscriber) {
      session.unsubscribe(subscriber);
      //subscriber.destroy();
    }
    session.unpublish(publisher);
    session.disconnect();
    publisher.destroy();
  };

  const sendStopSignal = async () => {
    refMsgDiv.current.innerText = "";
    await leaveSession();
  };

  const joinRandomSession = async () => {
    refJoinBttn.current.disabled = true;
    await getAuthKeys();
    initializeSession();
  };

  const goHome = async () => {
    if (session !== undefined && session.connection) {
      await sendStopSignal();
    }
    logout();
    history.push("/login");
  };

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
            <li className="nav-item dropdown">
              {/* <a
                className="nav-link dropdown-toggle"
                href="#/chat"
                id="navbarDropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Party Size
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
               <a className="dropdown-item" href="#">
                  One On One
                </a>
                  <a className="dropdown-item" href="#">
                    A Crowd Is Fun
                </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    Something else
                </a> */}
              {/*</li></div>*/}
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
      <div>
        Party Size &nbsp;&nbsp;
        <select id="participants" ref={refCountSlct}>
          <optgroup label="Participants">
            <option value="2">One on One</option>
            <option value="9">A Crowd is Fun</option>
          </optgroup>
          <optgroup label="something else">
            <option value="something">Something else</option>
          </optgroup>
        </select>
        <button
          type="button"
          ref={refJoinBttn}
          onClick={() => joinRandomSession()}
        >
          Start A Party
        </button>
        <button type="button" onClick={() => sendStopSignal()}>
          Leave The Party
        </button>
      </div>
      <div className="container h-auto">
        <div className="row h-100">
          <div className="col-sm-12 h-100">
            <div className="d-flex flex-row">
              <div id="players" className="h-100 w-100">
                <div id="videoContainer" className="h-100">
                  <div id="subscriber" className="h-100 w-100" />
                  <div id="bottomCorner">
                    <div id="publisher" />
                  </div>
                </div>
              </div>
              <div id="textchat-display">
                <div id="message-box" ref={refMsgDiv} />
                <form onSubmit={(ev) => sendMessage(ev)}>
                  <input
                    type="text"
                    placeholder="Input your text here"
                    id="msg-text"
                    ref={refMsgBox}
                    value={message}
                    onChange={(ev) => {
                      message = ev.target.value;
                    }} //create form component so video isn't interupted by rerender
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
