/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useRef, useEffect } from "react";
import axios from "axios";
const OT = require("@opentok/client");

const ChatRoom = ({ logout, history }) => {
  //this comes from the server
  let apiKey;
  let sessionId;
  let token;
  let roomname = 0;
  let session;
  let publisher;
  let subscriber;
  let user;
  const connectedUsers = {};
  const visitedRooms = [];
  let message;
  const refMsgDiv = useRef(null);
  const refMsgBox = useRef(null);
  const refJoinBttn = useRef(null);
  const ref2rdo = useRef(null);

  const getUser = async () => {
    const email = window.localStorage.getItem("email");
    user = await axios.post("/api/users/getuser", { email });
    user = user.data;
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (history.action === "POP") {
      sendStopSignal().then((result) => console.log(result));
    }
  }, [history]);

  window.onunload = function () {
    logout();
  };

  const getAuthKeys = async () => {
    let chatCount;
    if (ref2rdo.current.checked) {
      chatCount = 2;
    } else {
      chatCount = 9;
    }
      const response = await axios.post(`/api/opentok/chat/${chatCount}`, {
        visitedRooms,
        user
      });

    if (!response) {
      return new Error("Call to /api/opentok/room failed");
    } else {
      apiKey = response.data.apiKey;
      sessionId = response.data.sessionId;
      token = response.data.token;
      visitedRooms.push(response.data.sessionId);
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
    session.on("streamCreated", function (event) {
      subscriber = session.subscribe(
        event.stream,
        "subscriber",
        {
          insertMode: "append",
          width: 300,
          height: 300,
        },
        handleError
      );
    });
      // Create a publisher
    publisher = OT.initPublisher(
      "publisher",
      {
        name: user.userName,
        style: { nameDisplayMode: "on" },
        insertMode: "append",
        width: "100%",
        height: "100%",
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
      subscriber.destroy();
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
    <div id="container">
      <button type="button" ref={refJoinBttn} onClick={() => joinRandomSession()}>
        Join Random Session
      </button>
      <button type="button" onClick={() => sendStopSignal()}>
        Leave Session
      </button>
      <button type="button" onClick={() => goHome()}>
        Logout
      </button>
      <input type="radio" id="2" ref={ref2rdo} defaultChecked={true} name="crowd" value="2" />
      <label htmlFor="2">One on One</label>
      <input type="radio" id="crowd" name="crowd" value="crowd" />
      <label htmlFor="more">A Crowd is Fun</label>
      <div id="rightBottomCorner">
        <div id="subscriber" />
        <div id="publisher" />
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
  );
};

export default ChatRoom;
