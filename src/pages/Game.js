import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useUser } from "../context/UserProvider";
import VideoPlayer from "../components/VideoPlayer";
import UserList from "../components/UserList";
import { Redirect } from "react-router";
import "../styles/game/gamePageStyles.css";
import { Input, Progress } from "antd";
const defaultChooserModel = {
  id: "",
  position: 0,
  name: "defaultName",
  room: "",
  points: 0,
  guess: ""

};


const videoTime = 3;

const Game = () => {
  // loadinng context
  const socket = useSocket();
  const { user, setUser, allUsers } = useUser();
  //
  const [chooser, setChooser] = useState(defaultChooserModel);
  // phase toggle: 'search', 'guess', 'score'
  // initially search
  const [phase, setPhase] = useState("search");
  const [progress, setProgress] = useState({percent: 0, intervalID: 0});
  // clear state for next round
  const nextRound = () => {
    // emit events TODO
    // reset user search, guesses
  };

  const startVideo = () => {
    // start the video and the timer
    const interval = setInterval(() => {
      if (progress >= videoTime) {
        clearInterval(interval)
      }
      setProgress(prev => ({...prev, percent: prev["percent"] + 0.1}))
    }
    , 100)
    setProgress(prev => ({...prev, intervalID: interval}))
  }

  // mutate users in context
  const chooseChooser = () => {
    setChooser(null);
  };

  const submitSelected = () => {
    console.log("submitted");
  };

  // check if the progress is at 100 and clears the interval if so
  useEffect(() => {
    if (progress["percent"] >= videoTime) {
      clearInterval(progress["intervalID"])
      console.log("interval cleared")
    }
  }, [progress])

  // on mount round 0, choose initial chooser
  useEffect(() => {
    // send user id to choose-chooser
    console.log("GAMEJS", socket);

    // start video here just for debugging purposes
    startVideo();
    if (socket) {
      console.log(user);
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
          console.log("newChooser is null");
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
  console.log(chooser);
  // redirect if socket undefined
  return socket ? (
    <div className="game-root">
      <div className="game-progressBar">
        <Progress percent={(progress["percent"]/videoTime) * 100} showInfo={false}/>
      </div>
      {/* <h1>chooser is {chooser.id}</h1> */}
      {/* <h3
          style={{
            visibility: isChooser() ? "hidden" : "visible",
          }}
        >
          if you are not a chooser you can see this
        </h3> */}
      <div className="game-videoContainer" style={{background: "#ddd"}}>
        <VideoPlayer
          style={{
            visibility: isChooser() || phase === "score" ? "visible" : "hidden",
          }}
        />
      </div>
      <div className="game-guessContainer">
        <Input defaultValue="" allowClear/>
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
