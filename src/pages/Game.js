import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useUser } from "../context/UserProvider";
import VideoPlayer from "../components/VideoPlayer";
import UserList from "../components/UserList";
import { Redirect } from "react-router";
import "../styles/game/gamePageStyles.css";
import { Input, Progress } from "antd";
import {
  isChooser,
  updateChooser,
  updatePoints,
  startVideo,
} from "../actions/gameActions";
import GameTest from "../components/GameTest";
const defaultChooserModel = {
  id: "",
  position: 0,
  name: "defaultName",
  room: "",
  points: 0,
  guess: "",
};

const videoTime = 3;

const Game = () => {
  // loadinng context
  const socket = useSocket();
  const { user, setUser, allUsers, setAllUsers } = useUser();
  //
  const [chooser, setChooser] = useState(defaultChooserModel);
  // phase toggle: 'search', 'guess', 'score'
  // initially search
  const [phase, setPhase] = useState("search");
  const [progress, setProgress] = useState({ percent: 0, intervalID: 0 });
  // clear state for next round
  const nextRound = () => {
    // emit events TODO
    // reset user search, guesses
  };

  const submitSelected = () => {
    console.log("submitted");
  };

  // check if the progress is at 100 and clears the interval if so
  useEffect(() => {
    if (progress["percent"] >= videoTime) {
      clearInterval(progress["intervalID"]);
      console.log("interval cleared", progress["intervalID"]);
      // startVideo(progress, setProgress, videoTime)
    }
  }, [progress]);

  // on mount round 0, choose initial chooser
  useEffect(() => {
    // send user id to choose-chooser
    console.log("GAMEJS", socket);

    // start video here just for debugging purposes
    startVideo(progress, setProgress, videoTime);
    if (socket) {
      updateChooser(socket, user.room);
    }

    return () => {
      // if socket is undefined, that mean user has closed/reloaded window and so "disconnect" will remove user (since socket will be null after)
      // else, "leave-room" will remove it
      if (socket) {
        socket.emit("leave-room", user.room, user);
      }
    };
  }, []);

  // update Users when they leave
  useEffect(() => {
    if (socket) {
      socket.on("display-users", (users) => {
        setAllUsers(users);
      });
    }
  }, [allUsers]);

  // listen to above emit
  useEffect(() => {
    if (socket) {
      socket.once("chooser-chosen", (newChooser) => {
        if (newChooser) {
          setChooser(newChooser);
          console.log("you", user);
          console.log("newChooser", chooser);
        } else {
          console.log("newChooser is null");
        }
      });
    }
  }, [chooser]);

  // console.log("isChooser", isChooser())
  // redirect if socket undefined
  return socket ? (
    <div className="game-root">
      <div className="game-progressBar">
        <Progress
          percent={(progress["percent"] / videoTime) * 100}
          showInfo={false}
        />
      </div>

      {/* <h1>chooser is {chooser.id}</h1> */}
      {/* <h3
          style={{
            visibility: isChooser() ? "hidden" : "visible",
          }}
        >
          if you are not a chooser you can see this
        </h3> */}
      <div className="game-videoContainer" style={{ background: "#ddd" }}>
        <VideoPlayer
          style={{
            visibility:
              isChooser(socket.id, chooser.id) || phase === "score"
                ? "visible"
                : "hidden",
          }}
        />
      </div>
      <div className="game-guessContainer">
        {isChooser() ? <GameTest /> : <Input defaultValue="" allowClear />}
      </div>

      <div className="game-allUsersContainer">
        <UserList
          chooser={chooser}
          users={Object.values(allUsers)}
          phase={phase}
          submitSelected={submitSelected}
        />
      </div>
    </div>
  ) : (
    <Redirect to="/" />
  );
};

export default Game;
