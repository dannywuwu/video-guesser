import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketProvider";
import { useUser } from "../context/UserProvider";
import VideoPlayer from "../components/VideoPlayer";
import UserList from "../components/UserList";
import { Redirect } from "react-router";
import { Button } from "antd";
import "../styles/game/gamePageStyles.css";
import { AutoComplete, Input, Progress } from "antd";
import {
  checkChooser,
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
const videoTime = 1;

const Game = () => {
  // ******************* states and variables ********************* //

  // loadinng contexts
  const socket = useSocket();
  const { user, setUser, allUsers, setAllUsers } = useUser();
  const { room, setRoom } = useRoom();

  // the user that's choosing the video
  const chooser = room.chooser || defaultChooserModel;

  // phase toggle: 'search', 'guess', 'score', 'end'
  const phase = room.phase;

  // the selected video
  const selectedVideo = room.video || defaultVideoModel

  // the progress bar at the top
  const [progress, setProgress] = useState({ percent: 0, intervalID: 0 });
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
      socket.once("display-users", (users) => {
        setAllUsers(users);
      });
    }
  }, [allUsers]);

  // ******************* video selection and phase changes ********************* //

  // udpate the video to be played
  const updateVideo = (video) => {
    // returns info for the one vid you select
    console.log("update video")
    socket.emit("update-video", video);
    updatePhase("guess");
  };

  const updatePhase = (newPhase) => {
    socket.emit("update-phase", newPhase);
  }

  // clear state for next round
  const nextRound = () => {
    // emit events TODO
    // reset user search, guesses, winners
    updateVideo(defaultVideoModel);
    updateGuess(defaultChooserModel.guess);
    setWinners([])
    updatePhase("search")
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
      console.log(winners, selectedVideo)
    } else if (phase === "guess") {
      // start the video timer
      startVideoTimer(progress, setProgress, videoTime);
    } else if (phase === "score") {
      // the 'score' phase...

    } else {
      // the 'end' phase
      // call nextRound() to reset all the states at the end (we need a different state)
      // nextRound()
    }
  }, [phase]);

  // if ran, it will listen for changes to room
  useEffect(() => {
    if (socket) {
      // updated properties contains only the properties we want to change (other wise all the use effects affiliated with the other properties(that haven't been updated) will run as well)
      socket.once("display-room", (room, updatedProperties) => {
        console.log(updatedProperties);
        updatedProperties.forEach((property) => {
          setRoom((prev) => ({ ...prev, [property]: room[property]}));
        });
      });
    } else {
      console.log("socket is null at display-room");
    }
  }, [room]);

  console.log(checkChooser(user.id), user.id, chooser.id)


  // selecting winner 

  // adds the chosen winner into the array of all selected winners
  const selectWinner = (winner) => {
    
    if (!checkChooser(user.id)) {
      console.log("can't select if you're not chooser")
      return;
    }
    if (winner.id === user.id) {
      console.log("can't select yourself")
      return;
    }

    if (phase !== "score") {
      console.log("can't select a winner if not in 'score' phase")
      return;
    }

    setWinners(prev => [... new Set([...prev, winner])])
     
  };
  
  const submitSelected = () => {
    socket.emit("add-points", winners)
    updatePhase("end")
  };

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
            visibility: checkChooser() ? "hidden" : "visible",
          }}
        >
          if you are not a chooser you can see this
        </h3> */}
      <div
        className="game-videoContainer"
        style={{ background: "#ddd", width: "600px", margin: "0 auto" }}
      >
        <VideoPlayer
          // props
          url={selectedVideo["videoURL"]}
          selectedPhase={phase}
          //
          style={{
            visibility:
              checkChooser(socket.id) || phase === "score"
                ? "visible"
                : "hidden",
            background: "red",
          }}
        />
      </div>
      <div className="game-guessContainer">
        {checkChooser(socket.id) ? (
          <SelectVideo
            phase={phase}
            updatePhase={updatePhase}
            updateVideo={updateVideo}
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
            {
              winners.map(winner => {
                return (
                  <p>{winner.name}</p>
                )
              })
            }
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
