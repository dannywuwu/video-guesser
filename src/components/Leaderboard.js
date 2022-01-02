import React from "react";
import { sortLeaderboard } from "../actions/gameActions";

const Leaderboard = ({ users }) => {
  return (
    <div className="leaderboard-root">
      <div className="leaderboard-header">
        <h3>Leaderboard</h3>
      </div>
      <div className="leaderboard-users">
        {users.sort(sortLeaderboard).map((user) => {
          return <p className="leaderboard-player">{`${user.name} - ${user.points}`}</p>;
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
