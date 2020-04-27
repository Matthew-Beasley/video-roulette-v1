/* eslint-disable max-statements */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useRef, useEffect, useState, useReducer } from "react";
import axios from "axios";
import { Session } from "@opentok/client";
const OT = require("@opentok/client");
import Vote from "./Vote";

const ChatRoom = ({ logout, history }) => {
  const [user, setUser] = useState({});
  //this comes from the server
  const [apiKey, setApiKey] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [token, setToken] = useState("");
  const [roomname, setRoomname] = useState(0);
  const [session, setSession] = useState({});
  const [publisher, setPublisher] = useState();
  const [subscriber, setSubscriber] = useState();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const visitedRooms = [];
  let message;
  let address;
  let location;
  const refMsgDiv = useRef(null);
  const refMsgBox = useRef(null);
  const refJoinBttn = useRef(null);
  const refCountSlct = useRef(null);
  const refSubscriber = useRef(null);

  const GEOCODING_API_KEY = "lhdNJtemDRfjctoDTw5DqAYs2qr9uloY";

  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const getUser = async () => {
    const email = window.localStorage.getItem("email");
    const response = await axios.post("/api/users/getuser", { email });
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
    publisher.destroy();
  };

  const callGetLocation = async () => {
    await getMyLocation();
    await getUser();
  };

  const getMyLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          address = (
            await axios.get(
              `https://api.tomtom.com/search/2/reverseGeocode/${position.coords.latitude},${position.coords.longitude}.JSON?key=${GEOCODING_API_KEY}`
            )
          ).data;
          location = {
            City: address.addresses[0].address.municipality,
            State: address.addresses[0].address.countrySubdivision,
            Country: address.addresses[0].address.countryCodeISO3
          };
          resolve(location);
        });
      } else {
        reject(Error("The locator was denied."));
      }
    });
  };

  useEffect(() => {
    callGetLocation();
  }, []);
  
  const getAuthKeys = async () => {
    const response = await axios.post(
      `/api/opentok/chat/${refCountSlct.current.value}`, { user }
    );

    if (!response) {
      return new Error("Call to /api/opentok/room failed");
    } else {
      setApiKey(response.data.apiKey);
      setSessionId(response.data.sessionId);
      setToken(response.data.token);
      setRoomname(response.data.roomName)
    }
  };

  function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (sessionId.length > 0 && apiKey !== 0) {
      const tempsession = OT.initSession(apiKey, sessionId);
      setSession(tempsession);
    }
  }, [apiKey, sessionId]);

  useEffect(() => {
    if (session && publisher) {
      session.connect(token, function (error) {
        // If the connection is successful, publish to the session
        if (error) {
          handleError(error);
        } else {
          session.publish(publisher, handleError);
          visitedRooms.push(sessionId);
        }
      });
      createSubscriber();
      onSessionTasks();
    }
  }, [session, publisher]);

  const createPublisher = () => {
    if (!publisher) {
      const tempPublisher = OT.initPublisher(
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
      setPublisher(tempPublisher);
    }
  }

  const createSubscriber = () => {
    if (!visitedRooms.includes(sessionId)) {
      session.on("streamCreated", function (event) {
        const tempSubscriber = session.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "100%",
            height: "500px",
          },
          handleError
        );
        setSubscriber(tempSubscriber)
      }); 
    }
  }

  const onSessionTasks = () => {
    session.on("connectionCreated", function connectionCreated(event) {
      const userData = JSON.parse(event.connection.data);
      userData.connectionId = event.connection.connectionId;
      connectedUsers.push(userData);
      setConnectedUsers([...connectedUsers]);
    });
    session.on("connectionDestroyed", function connectionDestroyed(event) {
      const userData = JSON.parse(event.connection.data);
      setConnectedUsers(connectedUsers.filter(userEl => userEl.userName !== userData.userName));
    });
    
    // Receive a message and append it to the history
    session.on("signal:msg", function signalCallback(event) {
      const sender = JSON.parse(event.from.data).userName;
      const msg = refMsgDiv.current;
      msg.innerText += `
      (${sender})
      ${event.data}
      `;
      msg.scrollTop = msg.scrollHeight;
    });
    publisher.on("streamDestroyed", function (event) {
      event.preventDefault();
    });
  }

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

  const leaveSession = async () => {
    refJoinBttn.current.disabled = false;
    try {
      await axios.post(`/api/opentok/decrimentsession/${roomname}`);
    } catch (err) {
      Error(err);
    }
    if (subscriber) {
      session.unsubscribe(subscriber);
    }
    session.disconnect();
    session.unpublish(publisher);
    setConnectedUsers([]);
    forceUpdate();
  };

  //do I need to have this function?
  const sendStopSignal = async () => {
    refMsgDiv.current.innerText = "";
    await leaveSession();
  };

  const joinRandomSession = async () => {
    refJoinBttn.current.disabled = true;
    await getAuthKeys();
    createPublisher();
  };

  const goHome = async () => {
    if (session !== undefined && session.connection) {
      await sendStopSignal();
    }
    logout();
    publisher.destroy();
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
                  <div id="subscriber" ref={refSubscriber} className="h-100 w-100" />
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
              <Vote
                connectedUsers={connectedUsers}
                user={user} setConnectedUsers={setConnectedUsers}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
