import React from "react";

const Leaderboard = ({ topUsers }) => {
  return (
    <div className="leaderboard-root">
      <div className="leaderboard-header">
        <h3>Leaderboard</h3>
      </div>
      <div className="leaderboard-users">
        {topUsers
          .map((user) => {
            return (
              <p className="leaderboard-player">{`${user.name} - ${user.points}`}</p>
            );
          })}
      </div>
    </div>
  );
};

export default Leaderboard;
