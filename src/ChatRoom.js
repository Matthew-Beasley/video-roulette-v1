/* eslint-disable max-statements */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useRef, useEffect, useState, useReducer } from "react";
import axios from "axios";
const OT = require("@opentok/client");
import ChatRoomView from "./ChatRoomView";
import LeaderBoard from "./LeaderBoard";
import { Route } from "react-router-dom";

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
  const [connectionIsLoading, setConnectionIsLoading] = useState(false);
  const visitedRooms = [];
  const [message, setMessage] = useState("");
  let address;
  let location;
  const refMsgDiv = useRef();
  const refMsgBox = useRef();
  const refJoinBttn = useRef();
  const refLeaveBttn = useRef();
  const refCountSlct = useRef();
  const refSubscriber = useRef();

  const GEOCODING_API_KEY = "lhdNJtemDRfjctoDTw5DqAYs2qr9uloY";

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

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

  useEffect(() => {
    refJoinBttn.current.disabled = true;
    if (user.firstName) {
      refJoinBttn.current.disabled = false;
    }
  }, [user]);

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
            Country: address.addresses[0].address.countryCodeISO3,
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
      `/api/opentok/chat/${refCountSlct.current.value}`,
      { user }
    );

    if (!response) {
      return new Error("Call to /api/opentok/room failed");
    } else {
      setApiKey(response.data.apiKey);
      setSessionId(response.data.sessionId);
      setToken(response.data.token);
      setRoomname(response.data.roomName);
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
          insertMode: "append",
          style: { nameDisplayMode: "on" },
          width: "160px",
          height: "101px",
        },
        handleError
      );
      setPublisher(tempPublisher);
    }
  };

  const createSubscriber = () => {
    if (!visitedRooms.includes(sessionId)) {
      session.on("streamCreated", function (event) {
        const tempSubscriber = session.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "100%",
            height: "300px",
          },
          handleError
        );
        setSubscriber(tempSubscriber);
      });
    }
  };

  const onSessionTasks = () => {
    session.on("connectionCreated", function connectionCreated(event) {
      const userData = JSON.parse(event.connection.data);
      userData.connectionId = event.connection.connectionId;
      connectedUsers.push(userData);
      setConnectedUsers([...connectedUsers]);
      setConnectionIsLoading(false);
    });
    session.on("connectionDestroyed", function connectionDestroyed(event) {
      const userData = JSON.parse(event.connection.data);
      setConnectedUsers(
        connectedUsers.filter((userEl) => userEl.userName !== userData.userName)
      );
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

  const leaveSession = async () => {
    refJoinBttn.current.disabled = false;
    refLeaveBttn.current.disabled = true;
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
    refLeaveBttn.current.disabled = false;
    setConnectionIsLoading(true);
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
    <div>
      <ChatRoomView
        user={user}
        goHome={goHome}
        refCountSlct={refCountSlct}
        sendStopSignal={sendStopSignal}
        joinRandomSession={joinRandomSession}
        refJoinBttn={refJoinBttn}
        refLeaveBttn={refLeaveBttn}
        connectedUsers={connectedUsers}
        connectionIsLoading={connectionIsLoading}
        refSubscriber={refSubscriber}
        setConnectedUsers={setConnectedUsers}
        refMsgDiv={refMsgDiv}
        sendMessage={sendMessage}
        refMsgBox={refMsgBox}
        setMessage={setMessage}
        message={message}
      />
      <Route
        path="/leaderboard"
        render={() => <LeaderBoard user={user} goHome={goHome} />}
      />
    </div>
  );
};

export default ChatRoom;
