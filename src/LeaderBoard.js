import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LeaderBoard = ({ user, goHome }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [tabulatedUsers, setTabulatedUsers] = useState([]);
  const [rankDesc, setRankDesc] = useState([]);
  const [rankAsc, setRankAsc] = useState([]);

  const tabulateVotes = () => {
    const temp = allUsers.map(async (_user) => {
      _user.voteUp = 0;
      _user.voteDown = 0;
      _user.voteCount = 0;
      const votes = await axios.get(`/api/vote/votee/${_user.userName}`);
      votes.data.forEach((vote) => {
        _user.voteCount++;
        if (vote.voteDirection === "up") {
          _user.voteUp++;
        } else {
          _user.voteDown++;
        }
      });
      _user.voteAvg = (_user.voteUp - _user.voteDown) / _user.voteCount;
      if (isNaN(_user.voteAvg)) {
        user.voteAvg = 0;
      }
      return _user;
    });
    Promise.all(temp).then((values) => setTabulatedUsers(values));
  };

  const rankUsers = () => {
    tabulatedUsers.sort(function (_user) {
      return _user.voteAvg + _user.voteAvg;
    });
    setRankDesc([...tabulatedUsers]);
    tabulatedUsers.sort(function (_user) {
      return _user.voteAvg + _user.voteAvg;
    });
    setRankAsc([...tabulatedUsers])
  };

  useEffect(() => {
    axios.get("/api/users").then((users) => setAllUsers(users.data));
  }, []);

  useEffect(() => {
    tabulateVotes();
  }, [allUsers]);

  useEffect(() => {
    rankUsers();
  }, [tabulatedUsers]);

  return (
    <div id="leaderboard-container" className="container-lg h-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#/chat">
          {user.imageURL ? (
            <img
              className="rounded-circle"
              src={user.imageURL}
              width="40"
              height="40"
              alt=""
            />
          ) : (
            <img src="../assets/orgCicon.png" width="40" height="40" alt="" />
          )}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/chat">
                Chat
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to="/leaderboard">
                Leaderboards
              </Link>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            Welcome&nbsp;
            <a className="mr-3" href="#/chat">
              {user.userName}
            </a>
            <button
              className="btn-md btn-outline-dark my-2 my-sm-0"
              type="button"
              onClick={() => goHome()}>
              Logout
            </button>
          </form>
        </div>
      </nav>
      <div className="row h-100">
        <div className="my-auto col-sm-12 mx-auto my-auto justify-content-center text-center h-100 mh-100">
          <table className="table">
            <thead>
              <tr>
                <th>Users starting with the best!</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>User</th>
                <th>Total Votes</th>
                <th>Total of Up Votes</th>
                <th>Total of Down Votes</th>
                <th>Vote Average</th>
              </tr>
              {rankDesc.map((_user) => {
                return (
                  <tr key={_user.userName}>
                    <td>{_user.userName}</td>
                    <td>{_user.voteCount}</td>
                    <td>{_user.voteUp}</td>
                    <td>{_user.voteDown}</td>
                    <td>{_user.voteAvg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br/><br/>
          <table className="table">
            <thead>
              <tr>
                <th>Users ranked worst first!</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>User</th>
                <th>Total Votes</th>
                <th>Total of Up Votes</th>
                <th>Total of Down Votes</th>
                <th>Vote Average</th>
              </tr>
              {rankAsc.map((_user) => {
                return (
                  <tr key={_user.userName}>
                    <td>{_user.userName}</td>
                    <td>{_user.voteCount}</td>
                    <td>{_user.voteUp}</td>
                    <td>{_user.voteDown}</td>
                    <td>{_user.voteAvg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
