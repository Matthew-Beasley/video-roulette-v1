/* eslint-disable react/button-has-type */
import React, {useState} from "react";
import axios from "axios";

const Vote = ({ connectedUsers, user }) => {
  //voter, votee, voteDirection
  const vote = async (votee, voteDirection) => {
    try {
      await axios.post("/api/vote", {
        voter: user.userName,
        votee,
        voteDirection,
      });
    } catch (error) {
      Error(error);
    }
  };

  return (
    <div id="votelist" className="text">
      <h4>Vote on Other Users!</h4>
      <ul>
        {connectedUsers.map((connectedUser) => {
          if (connectedUser.userName !== user.userName) {
            return (
              <li key={connectedUser.userName}>
                {connectedUser.userName}
                &nbsp;&nbsp;
                <button
                  onClick={() => {
                    vote(connectedUser.userName, "up");
                  }}
                >
                  &#x1f44d;
                </button>
                &nbsp;
                <button
                  onClick={() => {
                    vote(connectedUser.userName, "down");
                  }}
                >
                  &#x1F44E;
                </button>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Vote;
