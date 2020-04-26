/* eslint-disable react/button-has-type */
import React, { useEffect, useState, useRef } from "react";

const Vote = ({ connectedUsers }) => {
  const refVoteList = useRef();

  useEffect(() => {
    //console.log("connectedUsers in Vote useEffect ", connectedUsers)
    //console.log("connectedUsers.length in vote useEffectis ", Object.keys(connectedUsers).length)
  }, [connectedUsers]);


  const upvote = () => {
    console.log("test connectedUsers in Vote ", connectedUsers)
    console.log("test connectedUsers.length is ", Object.keys(connectedUsers).length)
    console.log("test connections is ", connectedUsers)
  }

  const downvote = () => {

  }

  return (
    <div id = "votelist" >
      <h4>Vote on Other Users!</h4>
      <button onClick={() => upvote()}>test</button>
      <ul ref={refVoteList}>
        {Object.entries(connectedUsers).forEach(connectedUser => {
          console.log("connectedUser in the ul ", connectedUser)
          return (
            {/*}   <li key={1}>
              {connectedUsers.userData.userName ? connectedUsers.userData.userName : ""}
              <button onClick={() => upvote(connectedUsers[connectedUser.userData])}>Up</button>
              <button onClick={() => downvote(connectedUsers[connectedUser.userData])}>Down</button>
            </li>
          */} )
        })}
      </ul>
    </div >
  )
}

export default Vote;
