import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useUser } from "../context/UserProvider";
import VideoPlayer from "../components/VideoPlayer2";
import UserList from "../components/UserList";
import { Redirect } from "react-router";
import { Button } from "antd";
import "../styles/game/gamePageStyles.css";
import { AutoComplete, Input, Progress } from "antd";
import {
  isChooser,
  updateChooser,
  updatePoints,
  startVideoTimer,
} from "../actions/gameActions";
import SelectVideo from "../components/SelectVideo";
import { useRoom, defaultChooserModel } from "../context/RoomProvider";

const defaultVideoModel = {
  title: "title",
  channelTitle: "channelTitle",
  imageURL: "",
  videoURL: "",
};
// config, this is gonna be a state itself in the future, so users can configure the game settings
const videoTime = 15;

const Game = () => {
  // loadinng contexts
  const socket = useSocket();
  const { user, setUser, allUsers, setAllUsers } = useUser();
  const { room, setRoom } = useRoom();

  // the user that's choosing the video
  const chooser = room.chooser || defaultChooserModel;
  // phase toggle: 'search', 'guess', 'score'
  const phase = room.phase;

  // the progress bar at the top
  const [progress, setProgress] = useState({ percent: 0, intervalID: 0 });
  // the selected video
  const [selectedVideo, setSelectedVideo] = useState(defaultVideoModel);
  console.log(selectedVideo);

  const setChooser = (newChooser) => {
    setRoom((prev) => ({ ...prev, chooser: newChooser }));
    console.log("chooser", chooser);
  };

  const setPhase = (newPhase) => {
    setRoom((prev) => ({ ...prev, phase: newPhase }));
    console.log("chooser", chooser);
  };

  useEffect(() => {
    console.log(room);
  }, [room]);

  // clear state for next round
  const nextRound = () => {
    // emit events TODO
    // reset user search, guesses
    setSelectedVideo(defaultVideoModel);
    handleGuess(defaultChooserModel.guess);
  };

  const submitSelected = () => {
    console.log("submitted");
  };

  const handleGuess = (value) => {
    socket.emit("update-guess", value);
  };
  // check if the progress is at 100 and clears the interval if so
  useEffect(() => {
    if (progress["percent"] >= videoTime) {
      clearInterval(progress["intervalID"]);
      setPhase("score");
    }
  }, [progress]);

  // on mount round 0, choose initial chooser
  useEffect(() => {
    // send user id to choose-chooser
    console.log("GAMEJS", user);

    if (socket) {
      // emits to the back, and updates the chosen user
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

  // listen to above emit
  useEffect(() => {
    if (socket) {
      socket.once("chooser-chosen", (newChooser) => {
        if (newChooser) {
          setChooser(newChooser);
          console.log("you", user);
          console.log("newChooser", newChooser);
        } else {
          console.log("newChooser is null");
        }
      });
    }
  }, [chooser]);

  // update Users when they leave
  useEffect(() => {
    console.log("all users", allUsers);
    if (socket) {
      socket.on("display-users", (users) => {
        setAllUsers(users);
      });
    }
  }, [allUsers]);

  // listen for phase changes
  useEffect(() => {
    console.log("current phase", phase);
    if (phase === "search") {
      // call nextRound() to reset all the states
      nextRound();
    } else if (phase === "guess") {
      // start the video timer
      startVideoTimer(progress, setProgress, videoTime);
    } else {
    }
  }, [phase]);
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
      <div
        className="game-VideoPlayer"
        style={{ background: "#ddd", width: "600px", margin: "0 auto" }}
      >
        <VideoPlayer
          // props
          url={selectedVideo["videoURL"]}
          selectedPhase={phase}
          //
          style={{
            visibility:
              isChooser(socket.id, chooser.id) || phase === "score"
                ? "visible"
                : "hidden",
            background: "red",
          }}
        />
      </div>
      <div className="game-guessContainer">
        {isChooser(socket.id, chooser.id) ? (
          <SelectVideo
            phase={phase}
            setPhase={setPhase}
            setSelectedVideo={setSelectedVideo}
          />
        ) : (
          <Input
            disabled={phase === "guess" ? false : true}
            onPressEnter={(e) => handleGuess(e.target.value)}
            defaultValue=""
            allowClear
          />
        )}
      </div>

      <div className="game-allUsersContainer">
        <UserList
          chooser={chooser}
          users={Object.values(allUsers)}
          phase={phase}
          submitSelected={submitSelected}
        />
        {phase === "score" && (
          <Button type="primary" onClick={submitSelected}>
            Submit
          </Button>
        )}
      </div>
    </div>
  ) : (
    <Redirect to="/" />
  );
};

export default Game;
