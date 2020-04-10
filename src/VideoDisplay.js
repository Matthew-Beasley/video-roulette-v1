import React from "react";
import useOpenTok from "react-use-opentok";
import axios from "axios";

const VideoDisplay = () => {
  //this should come from server
  //let roomname;//Math.ceil(Math.random() * 10000000000);
  let apiKey;
  let sessionId;
  let token;
  let roomname = 1;

  const [opentokProps, opentokMethods] = useOpenTok();
  const { isSessionConnected, session, streams } = opentokProps;
  const { initSessionAndConnect, publish, subscribe } = opentokMethods;
  let roomToSessionIdDictionary;

  const getRoomToSessionIdDictionary = async () => {
    try {
      return await axios.get("/allsessions");
    } catch (error) {
      console.log(new Error(error));
    }
  };

  //  built out should fetch session ID and token from server
  const createSession = async () => {
    console.log("roomname is: ", roomname);
    const response = await axios.get(`/room/${roomname}`);

    if (!response) {
      return new Error("Call to /room/:roomname failed");
    } else {
      apiKey = response.data.apiKey;
      sessionId = response.data.sessionId;
      token = response.data.token;
    }
    const promise = await initSessionAndConnect({
      apiKey,
      sessionId,
      token,
    });
    if (promise !== undefined) {
      return new Error("Session initialization and/or connection failed");
    }
  };

  //maybe provide a control so creator can set max participants?
  const createNewSession = async () => {
    const roomToSession = await getRoomToSessionIdDictionary();
    console.log("get all sessions: ", roomToSession);
    const roomKeys = Object.keys(roomToSession.data);
    console.log("roomToSession: ", roomToSession);
    console.log("roomKeys: ", roomKeys);
    roomname = roomKeys.length + 1;
    createSession();
  };

  const joinRandomSession = async () => {
    const roomToSession = await getRoomToSessionIdDictionary();
     console.log("get all sessions: ", roomToSession);
    const roomKeys = Object.keys(roomToSession.data);
    console.log("roomToSession: ", roomToSession);
    console.log("roomKeys: ", roomKeys);
    roomname = Math.floor(Math.random() * roomKeys.length); //be sure this hits the first session ([0])
    createSession();
  };

  const publishCamera = () => {
    publish({
      name: "camera",
      element: "me",
      options: {
        insertMode: "replace",
        width: "180px",
        height: "120px",
      },
    });
    console.log("streams: ", streams);
  };

  const publishScreen = () => {
    publish({
      name: "screen",
      element: "me",
      options: {
        insertMode: "replace",
        width: "180px",
        height: "120px",
        videoSource: "screen",
      },
    });
  };

  return (
    <div>
      <div id="players">
        <div id="rightCorner">
          <div id="me" />
        </div>
        <div id="subscriber" />
      </div>
      <button onClick={() => createNewSession()}>Create New Session</button>
      <button onClick={() => joinRandomSession()}>Join Random Session</button>

      <div>
        <button onClick={() => publishCamera()}>Publish Camera</button>
        <button onClick={() => publishScreen()}>Publish Screen</button>
      </div>

      <div>
        <ul>
          {streams.map((stream) => (
            <li
              key={stream.streamId}
              onClick={() => {
                subscribe({
                  stream,
                  element: "subscriber",
                });
              }}
            >
              {stream.streamId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoDisplay;
