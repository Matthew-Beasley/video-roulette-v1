/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from "react";
import axios from "axios";
const OT = require("@opentok/client");
//const publisher = OT.initPublisher();


const PairVideo = () => {
  //this comes from the server
  let apiKey;
  let sessionId;
  let token;
  let roomname = 0;
  let session;
  let publisher;
  let subscriber;


  const getAuthKeys = async () => {
    const response = await axios.get(`/api/opentok/chat/${2}`);

    if (!response) {
      return new Error("Call to /api/opentok/room failed");
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


  const initializeSession = () => {
    session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on("streamCreated", function (event) {
      subscriber = session.subscribe(event.stream, "subscriber", {
        insertMode: "append",
        width: 400,
        height: 400
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
        leaveSession();
        alert("You have been disconnected, you can join another room!")
      }
      else {
        alert(event.data)
      }
    });
    publisher.on("streamDestroyed", function (event) {
      event.preventDefault();
    });
  }


  const sendDisconnectSignal = () => {
    return new Promise((resolve, reject) => {
      session.signal({
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
    await axios.post(`/api/opentok/deletesession/${roomname}`);
    session.unsubscribe(subscriber);
    session.unpublish(publisher);
    session.disconnect();
    publisher.destroy();
    subscriber.destroy();
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
      <button type="button" onClick={() => joinRandomSession()}>Join Random Session</button>
      <button type="button" onClick={() => sendStopSignal()}>Leave Session</button>
      <div id="videos">
        <div id="subscriber" />
        <div id="publisher" />
      </div>
    </div>
  )
}

export default PairVideo;
