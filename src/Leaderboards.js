import React from "react";
import Axios from "axios";

const Leaderboards = async () => {
  let tableData = [];
  await Axios.get("/api/vote/ranked").then((response) => {
    response.data.map((entry) => {
      let result = [entry.votee, entry.sum];
      tableData.push(result);
    });
    console.log("td", tableData);
    return tableData;
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>user</th>
            <th>likes</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((votee) => {
            console.log("votee: ", votee);
            return (
              <tr>
                <td>{votee[0]}</td>
                <td>{votee[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboards;

// below is the code I used on the server file to populate the db with users and votes if you would like to reuse while testing otherwise please delete
// const _users = {
//   dave: {
//     userName: "dave",
//     firstName: "dave",
//     lastName: "brave",
//     email: "davethebrave@gmail.com",
//     password: "test",
//     googleId: "1234",
//     imageURL: "null",
//   },
//   lucy: {
//     userName: "lucy",
//     firstName: "lucy",
//     lastName: "goosey",
//     email: "lucygoo@gmail.com",
//     password: "test",
//     googleId: "123",
//     imageURL: "null",
//   },
//   joe: {
//     userName: "joe",
//     firstName: "joe",
//     lastName: "schmoe",
//     email: "jschmoe@gmail.com",
//     password: "test",
//     googleId: "12345",
//     imageURL: "null",
//   },
//   kristy: {
//     userName: "kristy",
//     firstName: "kristy",
//     lastName: "smith",
//     email: "ksmith@gmail.com",
//     password: "test",
//     googleId: "1234445",
//     imageURL: "null",
//   },
//   jared: {
//     userName: "jared",
//     firstName: "jared",
//     lastName: "doff",
//     email: "jdoff@gmail.com",
//     password: "test",
//     googleId: "123454",
//     imageURL: "null",
//   },
//   maeve: {
//     userName: "maeve",
//     firstName: "maeve",
//     lastName: "schmoe",
//     email: "mschmoe@gmail.com",
//     password: "test",
//     googleId: "123452",
//     imageURL: "null",
//   },
// };
// const _votes = {
//   vote1: {
//     voter: "lucy",
//     votee: "joe",
//     voteDirection: 1,
//   },
//   vote2: {
//     voter: "dave",
//     votee: "joe",
//     voteDirection: 1,
//   },
//   vote3: {
//     voter: "lucy",
//     votee: "dave",
//     voteDirection: -1,
//   },
//   vote4: {
//     voter: "maeve",
//     votee: "joe",
//     voteDirection: 1,
//   },
//   vote5: {
//     voter: "jared",
//     votee: "lucy",
//     voteDirection: 1,
//   },
//   vote6: {
//     voter: "kristy",
//     votee: "dave",
//     voteDirection: -1,
//   },
// };
// const func = async () => {
//   await Promise.all(Object.values(_users).map((user) => createUser(user)));
//   await Promise.all(Object.values(_votes).map((vote) => createVote(vote)));
// };
// func();
