import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaderBoard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [tabulatedUsers, setTabulatedUsers] = useState([])
  const [topTen, setTopTen] = useState([]);
  const [bottomTen, setBottomTen] = useState([]);
  const [rankDesc, setRankDesc] = useState([]);
  const [rankAsc, setRankAsc] = useState([]);

  //3) create array of  get num of up/down votes
  //   this is a super expensive operation
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
      user.voteAvg = (user.voteDown + user.voteUp) / user.voteCount;
      return user;
    });
    Promise.all(temp)
    .then(values => setTabulatedUsers(values))
  }

  const rankUsers = () => {
    const sorted = tabulatedUsers;
    sorted.sort(user => {
      return user.voteAvg + user.voteAvg;
    });
    setRankDesc(sorted);
    sorted.sort(user => {
      return user.voteAvg + user.voteAvg;
    });
    setRankAsc(sorted);
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
    rankUsers();
  }, [tabulatedUsers])

  return (
    <div id="leaderboard-container">
      <h3>in the leaderboard</h3>

    </div>
  )
}

export default LeaderBoard;
