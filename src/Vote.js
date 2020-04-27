/* eslint-disable react/button-has-type */
import React, { useRef } from "react";
import axios from "axios";

const Vote = ({ setConnectedUsers, connectedUsers, user }) => {
  const refVoteList = useRef();


  //voter, votee, voteDirection
  const vote = async (votee, voteDirection) => {
    try {
      await axios.post("/api/vote", { voter: user.userName, votee, voteDirection });
      setConnectedUsers(connectedUsers.filter(userEl => userEl.userName !== votee));
    } catch (error) {
      Error(error);
    }
  }

  return (
    <div id = "votelist" >
      <h4>Vote on Other Users!</h4>
      <ul ref={refVoteList}>
        {connectedUsers.map(connectedUser => {
          if (connectedUser.userName !== user.userName) {
            return (
              <li key={connectedUser.userName}>
                {connectedUser.userName}
                <button onClick={() => vote(connectedUser.userName, "up")}>Up</button>
                <button onClick={() => vote(connectedUser.userName, "down")}>Down</button>
              </li>
            )
          }
        })}
      </ul>
    </div >
  )
}

export default Vote;
