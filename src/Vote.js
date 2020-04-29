/* eslint-disable react/button-has-type */
import React, {useState, useEffect} from "react";
import axios from "axios";

const Vote = ({ connectedUsers, user }) => {
  const [voteeList, setVoteeList] = useState([]);
  const [blackList, setBlackList] = useState([]);

  useEffect(() => {
    setVoteeList(
      connectedUsers.reduce((acc, item) => {
        if (!blackList.includes(item)) {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  }, [connectedUsers]);

  const vote = async (votee, voteDirection) => {
    try {
      await axios.post("/api/vote", {
        voter: user.userName,
        votee: votee.userName,
        voteDirection,
      });
      setBlackList([...blackList, votee]);
      setVoteeList(voteeList.filter(peep => peep.userName !== votee.userName));
    } catch (error) {
      Error(error);
    }
  };

  return (
    <div id="votelist" className="text">
      <h4>Vote on Other Users!</h4>
      <ul>
        {voteeList.map((connectedUser) => {
          if (connectedUser.userName !== user.userName) {
            return (
              <li key={connectedUser.userName}>
                {connectedUser.userName}
                &nbsp;&nbsp;
                <button
                  onClick={() => {
                    vote(connectedUser, "up");
                  }}
                >
                  &#x1f44d;
                </button>
                &nbsp;
                <button
                  onClick={() => {
                    vote(connectedUser, "down");
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
