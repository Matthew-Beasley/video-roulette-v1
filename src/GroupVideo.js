/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from "react";
import axios from "axios";
const OT = require("@opentok/client");

  //this comes from the server
  let apiKey;
  let sessionId;
  let token;
  let roomname = 0;
  let session;
  let publisher;
  let subscriber;

  const visitedRooms = [];
  const messageHistory = [];
  let message;


  const getAuthKeys = async () => {
    const response = await axios.post(`/api/opentok/chat/${5}`, { visitedRooms });

    if (!response) {
      return new Error("Call to /api/opentok/room failed");
    } else {
      apiKey = response.data.apiKey;
      sessionId = response.data.sessionId;
      token = response.data.token;
      visitedRooms.push(response.data.sessionId)
    }
  }


  function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }


  const initializeSession = () => {
    session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on("streamCreated", function (event) {
      subscriber = session.subscribe(event.stream, "subscriber", {
        insertMode: "append",
        width: 300,
        height: 300
      }, handleError);
    });

    // Create a publisher
    publisher = OT.initPublisher("publisher", {
      insertMode: "append",
      width: "100%",
      height: "100%"
    }, handleError);

    // Connect to the session
    session.connect(token, function (error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
    // Receive a signal from peer
    session.on("signal:disconnect", function signalCallback(event) {
      if (event.data === "disconnect") {
        alert("<username> has disconnected (on purpose I hope!)")
      }
      else {
        alert(event.data)
      }
    });
    // Receive a message and append it to the history
    session.on("signal:msg", function signalCallback(event) {
      const sender = event.from.connectionId === session.connection.connectionId ? "mine" : "theirs";
      const msgTxt =
      `${sender}:
      ${event.data}`;
      messageHistory.push(msgTxt);
    });
    publisher.on("streamDestroyed", function (event) {
      event.preventDefault();
    });
  }

  // Text chat
  // Send a signal once the user enters data in the form
  const sendMessage = (event) => {
    event.preventDefault();
    session.signal({
      type: "msg",
      data: message
    }, function signalCallback(error) {
      if (error) {
        console.error("Error sending signal:", error.name, error.message);
      } else {
        message = "";
      }
    });
  }


  const sendDisconnectSignal = () => {
    return new Promise((resolve, reject) => {
      session.signal({
        type: "disconnect",
        data: "disconnect"
      }, function signalCallback(error) {
        if (error) {
          console.error("Error sending signal:", error.name, error.message);
          reject(error)
        } else {
          resolve("Signal sent successfully");
        }
      })
    });
  }


  const leaveSession = async () => {
    await sendDisconnectSignal();
    try {
      await axios.post(`/api/opentok/decrimentsession/${roomname}`);
    } catch (err) {
      console.log(err);
    }
    session.unsubscribe(subscriber);
    session.unpublish(publisher);
    session.disconnect();
    publisher.destroy();
    subscriber.destroy();
  }


  const joinRandomSession = async () => {
    await getAuthKeys();
    initializeSession();
  };

const GroupVideo = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log(count)
    console.log(messageHistory)
  }, [messageHistory.length])

  return (
    <div id="video-display-container">
      <button type="button" onClick={() => joinRandomSession()}>Join Random Session</button>
      <button type="button" onClick={() => leaveSession()}>Leave Session</button>
      <div id="videos">
        <div id="subscriber" />
        <div id="publisher" />
      </div>
      <div id="textchat-display">
        <div id="maessage-box">
          <ul id="text messages">
            {messageHistory.map((msg) => {
              return (
                <li key={msg}>{msg}</li>
              )
            })}
          </ul>
        </div>
        <form onSubmit={(ev) => { setCount(count + 1); sendMessage(ev) }}>
          <input
            type="text"
            placeholder="Input your text here"
            id="msgTxt"
            onChange={(ev) => { message = ev.target.value }} //create form component sovideo isn't interupted by rerender
          />
        </form>
      </div>
    </div>
  )
}

export default GroupVideo;
