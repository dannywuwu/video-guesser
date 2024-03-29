import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketProvider";
import { useUser } from "../context/UserProvider";
import VideoPlayer from "../components/VideoPlayer";
import UserList from "../components/UserList";
import { Redirect, useHistory } from "react-router";
import { Button } from "antd";
import "../styles/game/gamePageStyles.css";
import { Input, Progress } from "antd";
import {
  checkChooser,
  updateChooser,
  updatePoints,
  startVideoTimer,
} from "../actions/gameActions";
import SelectVideo from "../components/SelectVideo";
import { useRoom, defaultChooserModel } from "../context/RoomProvider";
import Leaderboard from "../components/Leaderboard";
import { sortLeaderboard } from "../actions/gameActions";
import Countdown from "react-countdown";

const defaultVideoModel = {
  title: "title",
  channelTitle: "channelTitle",
  imageURL: "",
  videoURL: "",
};
// config, this is gonna be a state itself in the future, so users can configure the game settings
const videoTime = 10;
const pointCap = 3;

const Game = () => {
  // ******************* states and variables ********************* //
  // loadinng contexts
  const socket = useSocket();
  const { user, setUser, allUsers, setAllUsers } = useUser();
  const sortedUsers = Object.values(allUsers).sort(sortLeaderboard);
  const sortedUsersRef = useRef(sortedUsers);
  const { room, setRoom } = useRoom();
  // the user that's choosing the video
  const chooser = room.chooser || defaultChooserModel;

  // phase toggle: 'search', 'guess', 'score', 'end', 'gameover'
  const phase = room.phase;
  /* video settings */
  // the selected video
  const selectedVideo = room.video || defaultVideoModel;
  // timestamps for play start/end
  const [playStart, setPlayStart] = useState(0);
  const [playEnd, setPlayEnd] = useState(videoTime);
  // the progress bar at the top
  const [progress, setProgress] = useState({
    playedSeconds: 0,
    played: 0,
    loadedSeconds: 0,
    loaded: 0,
  });
  // video buffer state
  const [bufferStatus, setBufferStatus] = useState(false);

  const [winners, setWinners] = useState([]);

  // state for the properties to be udpated
  const [updatedProperties, setUpdatedProperties] = useState([]);

  // ******************* chooser stuff ********************* //
  // return true if current user is chooser
  const checkChooser = (socketID) => {
    return socketID === chooser.id ? true : false;
  };
  // set the chooser
  const setChooser = (newChooser) => {
    setRoom((prev) => ({ ...prev, chooser: newChooser }));
  };

  // check if the progress is at 100 and clears the interval if so
  useEffect(() => {
    if (progress["percent"] >= videoTime) {
      clearInterval(progress["intervalID"]);
      updatePhase("score");
    }
  }, [progress]);

  const resetGame = () => {
    // reset states
    if (socket) {
      socket.emit("reset-game", room.rName);
    }
  };

  // on mount round 0, choose initial chooser
  useEffect(() => {
    // send user id to choose-chooser
    console.log("GAMEJS", user);
    if (socket) {
      // emits to the back, and updates the chosen user
      socket.emit("choose-chooser", room.rName);
    }
    return () => {
      // if socket is undefined, that means user has closed/reloaded window and so "disconnect" will remove user (since socket will be null after)
      // else, "leave-room" will remove it
      // also, we don't want to leave-room if we're simply just returning back to the lobby
      if (socket && sortedUsersRef.current.slice(0, 1)[0].points !== pointCap) {
        // just means some dude left the game
        socket.emit("leave-room", user.room, user);
      } else {
        // means the game is over, so reset the game states
        resetGame();
      }
    };
  }, []);

  // listen to above emit
  useEffect(() => {
    if (socket) {
      socket.once("chooser-chosen", (newChooser) => {
        console.log("current chooser", chooser);
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
    sortedUsersRef.current = Object.values(allUsers).sort(sortLeaderboard);
    console.log("sortedUSersRef", sortedUsersRef.current);
    if (socket) {
      socket.once("display-users", (users) => {
        setAllUsers(users);
      });
    }
  }, [allUsers]);

  // ******************* video selection and phase changes ********************* //

  // udpate the video to be played
  const updateVideo = (video) => {
    // returns info for the one vid you select
    console.log("update video");
    socket.emit("update-video", video);

  };

  const updatePhase = (newPhase) => {
    socket.emit("update-phase", newPhase);
  };

  // clear state for next round
  const nextRound = () => {
    // emit events TODO
    // reset user search, guesses, winners
    updateVideo(defaultVideoModel);
    updateGuess(defaultChooserModel.guess);
    socket.emit("update-turn", room, () => {
      socket.emit("choose-chooser", room.rName);
    });
    setProgress({
      playedSeconds: 0,
      played: 0,
      loadedSeconds: 0,
      loaded: 0,
    });
    setWinners([]);
    updatePhase("search");
  };

  // take in a users guess and the emit that
  const updateGuess = (value) => {
    if (socket) {
      socket.emit("update-guess", value);
    } else {
      console.log("socket is null, skipping socket.emit(update-guess)");
    }
  };

  // listen for phase changes
  useEffect(() => {
    console.log("current phase", phase);
    if (phase === "search") {
      console.log(winners, selectedVideo);
    } else if (phase === "guess") {
      // the chooser will start the video
    } else if (phase === "score") {
      // the 'score' phase...
    } else if (phase === "end") {
      // the 'end' phase
      // call nextRound() to reset all the states at the end (we need a different state)
      nextRound();
    } else {
      // the 'gameover' phase
    }
  }, [phase]);

  // if ran, it will listen for changes to room
  useEffect(() => {
    if (socket) {
      // updated properties contains only the properties we want to change (other wise all the use effects affiliated with the other properties(that haven't been updated) will run as well)
      socket.once("display-room", (room, updatedProperties) => {
        console.log(updatedProperties);
        updatedProperties.forEach((property) => {
          setRoom((prev) => ({ ...prev, [property]: room[property] }));
        });
      });
    } else {
      console.log("socket is null at display-room");
    }
  }, [room]);

  // selecting winner

  // adds the chosen winner into the array of all selected winners
  const selectWinner = (winner) => {
    if (!checkChooser(user.id)) {
      console.log("can't select if you're not chooser");
      return;
    }
    if (winner.id === user.id) {
      console.log("can't select yourself");
      return;
    }

    if (phase !== "score") {
      console.log("can't select a winner if not in 'score' phase");
      return;
    }

    setWinners((prev) => [...new Set([...prev, winner])]);
  };

  const submitSelected = () => {
    socket.emit("add-points", winners);
    updatePhase("end");
  };

  // redirect if socket undefined
  return socket ? (
    <div className="game-root">
      {phase === "gameover" && <Redirect to="/lobby" />}
      {sortedUsers.slice(0, 1)[0].points === pointCap && (
        <Countdown
          date={Date.now() + 3000}
          onComplete={() => {
            updatePhase("gameover");
          }}
        />
      )}
      <div className="game-progressBar">
        <Progress
          percent={((progress.playedSeconds - playStart) / videoTime) * 100}
          showInfo={false}
        />
      </div>
      <div className="game-mainDisplay">
        <div className="game-playerStatus">
          <p>You are {checkChooser(socket.id) ? "the Chooser" : "a Guesser"}</p>
          <p>Game Phase: {phase}</p>
        </div>
        <div className="game-VideoPlayer" style={{ margin: "0 15px" }}>
          <VideoPlayer
            // props
            url={selectedVideo["videoURL"]}
            selectedPhase={phase}
            chooserStatus={checkChooser(socket.id)}
            socket={socket}
            rName={room.rName}
            progress={progress}
            setProgress={setProgress}
            bufferStatus={bufferStatus}
            setBufferStatus={setBufferStatus}
            updatePhase={updatePhase}
            playStart={playStart}
            setPlayStart={setPlayStart}
            playEnd={playEnd}
            setPlayEnd={setPlayEnd}
            videoTime={videoTime}
            style={{
              visibility:
                checkChooser(socket.id) || phase === "score"
                  ? "visible"
                  : "hidden",
              background: "red",
            }}
          />
        </div>
        <div className="game-leaderboard">
          <Leaderboard topUsers={sortedUsers.slice(0, 5)} />
        </div>
      </div>
      <div className="game-guessContainer">
        {checkChooser(socket.id) ? (
          <SelectVideo
            phase={phase}
            updatePhase={updatePhase}
            updateVideo={updateVideo}
            selectedVideo={selectedVideo}
            playStart={playStart}
            setPlayStart={setPlayStart}
            playEnd={playEnd}
            setPlayEnd={setPlayEnd}
            videoTime={videoTime}
          />
        ) : (
          <Input
            disabled={phase === "guess" ? false : true}
            onPressEnter={(e) => updateGuess(e.target.value)}
            defaultValue=""
            allowClear
          />
        )}
      </div>
      <div className="game-allUsersContainer">
        <UserList
          checkChooser={checkChooser}
          selectWinner={selectWinner}
          users={Object.values(allUsers)}
          phase={phase}
          submitSelected={submitSelected}
        />
        {phase === "score" && (
          <>
            {winners.map((winner) => {
              return <p>{winner.name}</p>;
            })}
            <Button type="primary" onClick={submitSelected}>
              Submit
            </Button>
          </>
        )}
      </div>
    </div>
  ) : (
    <Redirect to="/" />
  );
};

export default Game;
