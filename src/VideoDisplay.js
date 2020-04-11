/* eslint-disable react/button-has-type */
import React, { useEffect } from "react";
import axios from "axios";
const OT = require('@opentok/client');
const publisher = OT.initPublisher();

const VideoDisplay = () => {
  //this should come from server
  let apiKey;
  let sessionId;
  let token;
  let roomname = 1;

  let roomToSessionIdDictionary;

  const getRoomToSessionIdDictionary = async () => {
    try {
      return await axios.get("/api/opentok/allsessions");
    } catch (error) {
      console.log(new Error(error));
    }
  };

  // const getStreams = async (sessionId) => {
  //   const response = await axios.get(`/streams/${sessionId}`);
  //   return response;
  // };

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
    await getAuthKeys();
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on("streamCreated", function (event) {
      session.subscribe(event.stream, "subscriber", {
        insertMode: "append",
        width: "200px",
        height: "200px"
      }, handleError);
    });


    // Create a publisher
    var publisher = OT.initPublisher("publisher", {
      insertMode: "append",
      width: "600px",
      height: "600px"
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

  useEffect(() => {
    initializeSession();
  }, []);

  return (
    <div id="video-display-container">
      <div id="videos">
        <div id="subscriber" />
        <div id="publisher" />
      </div>
    </div>
  )
}

export default VideoDisplay;
