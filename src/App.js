/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React, { useEffect } from "react";
import useOpenTok from "react-use-opentok";
import axios from "axios";


const App = () => {
  //this should come from server
  const roomname = Math.ceil(Math.random() * 10000000000);

  let apiKey;
  let sessionId;
  let token;

  const [opentokProps, opentokMethods] = useOpenTok();

  const { isSessionConnected, session, streams } = opentokProps;

  const { initSessionAndConnect, publish, subscribe } = opentokMethods;

  //  built out should fetch session ID and token from server
  const createSession = async () => {
    try {
      const response = await axios.get(`/room/${roomname}`);
      apiKey = response.data.apiKey;
      sessionId = response.data.sessionId;
      token = response.data.token;
      initSessionAndConnect({
        apiKey,
        sessionId,
        token,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
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
  }

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
  }

  // useEffect(() => {
  //   initSessionAndConnect({
  //     apiKey,
  //     sessionId,
  //     token,
  //   });
  // }, [initSessionAndConnect]);
  console.log("session", session);

  return (
    <div id="container">
      <div id="players">
        <div id="rightCorner">
          <div id="me" />
        </div>
        <div id="subscriber" />
      </div>
      <button onClick={() => createSession()}>
        create session
      </button>
      {session && publish && (
        <div>
          <button onClick={() => publishCamera()}>
            Publish Camera
          </button>
          <button onClick={() => publishScreen()}>
            Publish Screen
          </button>
        </div>
      )}
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

export default App;
