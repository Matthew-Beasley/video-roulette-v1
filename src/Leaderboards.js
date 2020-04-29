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
            <th>Username</th>
            <th>Rank</th>
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
