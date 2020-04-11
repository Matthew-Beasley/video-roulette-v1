/* eslint-disable no-alert */
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
  let roomname = 0;
  let session;
  let publisher;
  let subscriber;


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
  }

  const leaveSession = async () => {
    session.unpublish(publisher);
    session.unsubscribe(subscriber);
    //session.disconnect();
    await axios.post(`/api/opentok/decrimentsession/${roomname}`)
  }

  const joinRandomSession = async () => {
    await getAuthKeys();
    console.log("session id we are starting with ", sessionId)
    initializeSession();
  };

  return (
    <div id="video-display-container">
      <button type="button" onClick={() => joinRandomSession()}>Join Random Session</button>
      <button type="button" onClick={() => leaveSession()}>Leave Session</button>
      <div id="videos">
        <div id="subscriber" />
        <div id="publisher" />
      </div>
    </div>
  )
}

export default VideoDisplay;
