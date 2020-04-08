/* eslint-disable react/button-has-type */
import React, { useEffect } from "react";
import useOpenTok from "react-use-opentok";

//this should come from server
const apiKey = 46648222;
const sessionId =
  "2_MX40NjY0ODIyMn5-MTU4NjI5ODk4NDk3Nn5jWDlpeVFJN3N0enFLZUhNNWEzRTNGMnB-fg";
const token =
  "T1==cGFydG5lcl9pZD00NjY0ODIyMiZzaWc9ZDBiOWRjMDQxMmM0ZGNkZDliODI3YWQ4ZDQ2YWJjZmZhY2ZhYTFkYTpzZXNzaW9uX2lkPTJfTVg0ME5qWTBPREl5TW41LU1UVTROakk1T0RrNE5EazNObjVqV0RscGVWRkpOM04wZW5GTFpVaE5OV0V6UlROR01uQi1mZyZjcmVhdGVfdGltZT0xNTg2Mjk5MDAzJm5vbmNlPTAuMTkyNzAyNzQwNDAzOTc3NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTg2Mzg1NDAyJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

const App = () => {
  const [opentokProps, opentokMethods] = useOpenTok();

  const { isSessionConnected, session, streams } = opentokProps;

  const { initSessionAndConnect, publish, subscribe } = opentokMethods;

  //  built out should fetch session ID and token from server
  useEffect(() => {
    initSessionAndConnect({
      apiKey,
      sessionId,
      token,
    });
  }, [initSessionAndConnect]);
  console.log("session", session);

  return (
    <div id="container">
      <div id="players">
        <div id="rightCorner">
          <div id="me" />
        </div>
        <div id="subscriber" />
      </div>
      {session && publish && (
        <>
          <button
            onClick={() => {
              publish({
                name: "camera",
                element: "me",
                options: {
                  insertMode: "replace",
                  width: "180px",
                  height: "120px",
                },
              });
            }}
          >
            Publish Camera
          </button>
          <button
            onClick={() => {
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
            }}
          >
            Publish Screen
          </button>
        </>
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
