import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaderBoard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [tabulatedUsers, setTabulatedUsers] = useState([])
  const [topTen, setTopTen] = useState([]);
  const [bottomTen, setBottomTen] = useState([]);
  const [rankTopBottom, setRankTopBottom] = useState([]);

  //3) create array of  get num of up/down votes
  //   this is a super expensive operation
  // dry this up by replacing votee with user opjects?
  const tabulateVotes = () => {
    const temp = allUsers.map(async (user) => {
      user.voteUp = 0;
      user.voteDown = 0;
      user.voteCount = 0;
      const votes = await axios.get(`/api/vote/votee/${user.userName}`); 
      votes.data.forEach(vote => {
        user.voteCount++;
        if (vote.voteDirection === "up") {
          user.voteUp++;
        } else {
          user.voteDown--;
        }
        
      });
      return user;
    });
    Promise.all(temp)
    .then(values => setTabulatedUsers(values))
  }

  //1) get all the users
  useEffect(() => {
    axios.get("/api/users")
      .then(users => setAllUsers(users.data));
  }, []);

  //2) calltabulate when all the users are here
  useEffect(() => {
    tabulateVotes();
  }, [allUsers]);

  useEffect(() => {
    calcOverallScore();
  }, [tabulatedUsers])

  return (
    <div id="leaderboard-container">
      <h3>in the leaderboard</h3>

    </div>
  )
}

export default LeaderBoard;
