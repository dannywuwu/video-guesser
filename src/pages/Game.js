import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import VideoPlayer from "../components/VideoPlayer";

const Game = () => {
  const [search, setSearch] = useState("");
  // dictionary playerID -> guess
  const [guess, setGuess] = useState("");
  const [chooser, setChooser] = useState({});

  // phase toggle: 'search', 'guess', 'score'
  // initially search
  const [phase, setPhase] = useState("search");

  const socket = useSocket();

  // clear state for next round
  const nextRound = () => {
    // reset search, player guesses
    setSearch("");
    setGuess("");
  };

  // mutate users in context
  const chooseChooser = () => {
    setChooser(None);
  };

  // on mount round 0, choose initial chooser
  useEffect(() => {
    socket.emit("choose-chooser", roomID);
  }, []);

  // listen to above emit
  useEffect(() => {
    socket.once("chooser-chosen", (newChooser) => {
      setChooser(newChooser);
    });
  }, [chooser]);

  // return true if current user is chooser
  const isChooser = () => {
    return socket.id === chooser.id ? true : false;
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
      <h1>chooser is {chooser.id}</h1>
      <VideoPlayer
        style={{
          visibility: isChooser() || phase === "score" ? "visible" : "hidden",
        }}
      />
      <h3
        style={{
          visibility: isChooser() ? "hidden" : "visible",
        }}
      >
        if you are not a chooser you can see this
      </h3>
      <h1>game</h1>
    </div>
  );
};

export default Game;
