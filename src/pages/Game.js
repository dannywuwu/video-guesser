import React, { useState, useEffect } from "react";

const Game = () => {
  const [search, setSearch] = useState("");
  // dictionary playerID -> guess
  const [guess, setGuess] = useState("");
  const [chooserID, setChooserID] = useState("");

  // phase toggle: 'search', 'guess', 'score'
  // initially search
  const [phase, setPhase] = useState("search");

  // clear state for next round
  const nextRound = () => {
    // reset search, player guesses
    setSearch("");
    setGuess("");
  };

  // mutate users in context
  const chooseChooser = () => {
    // use modulus %, emit to server
    // server will broadcast and update the other users' state
  };

  // give points to selected players
  // called once Chooser submits correct players
  const updatePoints = () => {};

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
