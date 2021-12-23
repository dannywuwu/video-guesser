import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useUser } from "../context/UserProvider";
import VideoPlayer from "../components/VideoPlayer";
import UserList from "../components/UserList";
import { Redirect } from "react-router";

const defaultChooserModel = {
  id: "",
  name: "defaultName",
  points: 0,
  room: ""
}


const Game = () => {
  // loadinng context
  const socket = useSocket();
  const { user, setUser, allUsers } = useUser();

  // 
  const [chooser, setChooser] = useState(defaultChooserModel);
  // phase toggle: 'search', 'guess', 'score'
  // initially search
  const [phase, setPhase] = useState("search");


  // clear state for next round
  const nextRound = () => {
    // emit events TODO
    // reset user search, guesses
  };

  // mutate users in context
  const chooseChooser = () => {
    setChooser(null);
  };

  const submitSelected = () => {
    console.log("submitted");
  };

  // on mount round 0, choose initial chooser
  useEffect(() => {
    // send user id to choose-chooser
    console.log(socket)
    if (socket) {
      console.log(user)
      socket.emit("choose-chooser", user.room);
    }
  }, []);

  // listen to above emit
  useEffect(() => {
    if (socket) {
      socket.once("chooser-chosen", (newChooser) => {
        if (newChooser) {
          setChooser(newChooser);

        } else {
          console.log("newChooser is null")
        }
      });
    }
  }, [chooser]);

  // return true if current user is chooser
  const isChooser = () => {
    return socket.id === chooser.id ? true : false;
  };

  // give points to selected players
  // called once Chooser submits correct players
  const updatePoints = () => {};
  console.log(chooser)
  // redirect if socket undefined
  return socket ? (
    <div>
      {/* <h1>chooser is {chooser.id}</h1> */}
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
      <UserList
        users={Object.values(allUsers)}
        phase={phase}
        submitSelected={submitSelected}
      />
    </div>
  ) : (
    <Redirect to="/" />
  );
};

export default Game;
