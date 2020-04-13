/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from "react";
import axios from "axios";
const OT = require("@opentok/client");
//const publisher = OT.initPublisher();

const VideoDisplay = () => {
  //this comes from the server
  let apiKey;
  let sessionId;
  let token;
  let roomname = 0;
  let session;
  let publisher;
  let subscriber;
  const [message, setMessage] = useState();


  const getRoomToSessionIdDictionary = async () => {
    try {
      return await axios.get("/api/opentok/allsessions");
    } catch (error) {
      console.log(new Error(error));
    }
  };

  //  built out should fetch session ID and token from server
  const getAuthKeys = async () => {
    console.log("roomname is: ", roomname);
    const response = await axios.get(`/api/opentok/room/${roomname}`);

    if (!response) {
      return new Error("Call to /api/opentok/room/:roomname failed");
    } else {
      apiKey = response.data.apiKey;
      sessionId = response.data.sessionId;
      token = response.data.token;
    }
  }

  function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }

  const initializeSession = async () => {
    session = OT.initSession(apiKey, sessionId);
    console.log("this is the sessionId ", sessionId)

    // Subscribe to a newly created stream
    session.on("streamCreated", function (event) {
      subscriber = session.subscribe(event.stream, "subscriber", {
        insertMode: "append",
        width: "100%",
        height: "100%"
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
    session.on("signal:msg", function signalCallback(event) {
      if (event.data === "disconnect") {
        setMessage("You have been disconnected, you can join another room!");
        leaveSession();
        alert("You have been disconnected, you can join another room!")
      }
      else {
        setMessage(event.data);
      }
    });
    publisher.on("streamDestroyed", function (event) {
      event.preventDefault();
    });
    return session;
  }


  const sendDisconnectSignal = () => {
    //console.log("this is connection1 ", connection1)
    console.log("session in sendDisconnectSignal ", session)
    return new Promise((resolve, reject) => {
      session.signal({
        //to: connection1, //this will be useful in other scenarios (groups?)
        type: "msg",
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
    await axios.post(`/api/opentok/decrimentsession/${roomname}`);
    //console.log("session in leaveSession ", session)
    session.unsubscribe(subscriber);
    session.unpublish(publisher);
    session.disconnect();
    //publisher.destroy();
  }


  const sendStopSignal = async () => {
    await sendDisconnectSignal();
  }


  const joinRandomSession = async () => {
    await getAuthKeys();
    initializeSession();
  };


  return (
    <div id="video-display-container">
      {message && <h3>{message}</h3>}
      <button type="button" onClick={() => joinRandomSession()}>Join Random Session</button>
      <button type="button" onClick={() => sendStopSignal()}>Leave Session</button>
      <div id="videos">
        <div id="subscriber" />
        <div id="publisher" />
      </div>
    </div>
  )
}

export default VideoDisplay;
