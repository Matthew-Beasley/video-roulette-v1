/* eslint-disable react/button-has-type */
import React, { useEffect } from "react";
import axios from "axios";
const OT = require("@opentok/client");
//const publisher = OT.initPublisher();

const VideoDisplay = () => {
  //this comes from the server
  let apiKey;
  let sessionId;
  let token;
  let roomname = 1;
  let session;
  let publisher;


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
    if (sessionId) {
      return
    }
    await getAuthKeys();
    session = OT.initSession(apiKey, sessionId);
    console.log("this is the sessionId ", sessionId)

    // Subscribe to a newly created stream
    session.on("streamCreated", function (event) {
      session.subscribe(event.stream, "subscriber", {
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
  }

  const leaveSession = () => {

  }

  //maybe provide a control so creator can set max participants?
  const createNewSession = async () => {
    const roomToSession = await getRoomToSessionIdDictionary();
    console.log("roomToSession is ", roomToSession)
    console.log("get all sessions: ", roomToSession);
    const roomKeys = Object.keys(roomToSession.data);
    console.log("roomToSession: ", roomToSession);
    console.log("roomKeys: ", roomKeys);
    roomname = roomKeys.length + 1;
    initializeSession();
    console.log(roomToSession);
  };

  const joinRandomSession = async () => {
    const roomToSession = await getRoomToSessionIdDictionary();
    console.log("get all sessions: ", roomToSession);
    const roomKeys = Object.keys(roomToSession.data);
    console.log("roomToSession: ", roomToSession);
    console.log("roomKeys: ", roomKeys);
    roomname = Math.ceil(Math.random() * roomKeys.length); //be sure this hits the first session ([0])
    initializeSession();
  };

  useEffect(() => {
    initializeSession();
  }, []);

  return (
    <div id="video-display-container">
      <button type="button" onClick={() => createNewSession()}>Create New Session</button>
      <button type="button" onClick={() => joinRandomSession()}>Join Random Session</button>
      <div id="videos">
        <div id="subscriber" />
        <div id="publisher" />
      </div>
    </div>
  )
}

export default VideoDisplay;
