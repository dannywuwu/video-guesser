import React, { useState, useEffect } from "react";

const Game = () => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search != "") {
      fetch(`https://song-searcher-backend-thing.weelam.repl.co/get/${search}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setQuery(data);
          setSubmitted(true);
        })
        .catch((err) => console.log(err));
    }
  }, [search]);

  return (
    <div>
      <h1>game</h1>
    </div>
  );
};

export default Game;
