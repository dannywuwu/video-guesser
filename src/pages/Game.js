import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useUser } from "../context/UserProvider";
import VideoPlayer from "../components/VideoPlayer";
import UserList from "../components/UserList";
import { Redirect } from "react-router";
import { Button } from "antd";
import "../styles/game/gamePageStyles.css";
import { Input, Progress } from "antd";
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
  // ******************* states and variables ********************* //

  // loadinng contexts
  const socket = useSocket();
  const { user, setUser, allUsers, setAllUsers } = useUser();
  const { room, setRoom } = useRoom();

  // the user that's choosing the video
  const chooser = room.chooser || defaultChooserModel;

  // phase toggle: 'search', 'guess', 'score'
  const phase = room.phase;

  // the selected video
  const selectedVideo = room.video || defaultVideoModel;

  // the progress bar at the top
  const [progress, setProgress] = useState({ percent: 0, intervalID: 0 });

  // ******************* setters ********************* //

  // set the video
  const setSelectedVideo = (newVideo) => {
    setRoom((prev) => ({ ...prev, video: newVideo }));
  };
  // set the chooser
  const setChooser = (newChooser) => {
    setRoom((prev) => ({ ...prev, chooser: newChooser }));
  };

  // set the phase
  const setPhase = (newPhase) => {
    setRoom((prev) => ({ ...prev, phase: newPhase }));
  };

  const submitSelected = () => {
    console.log("submitted");
  };

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
      socket.once("display-users", (users) => {
        setAllUsers(users);
      });
    }
  }, [allUsers]);

  // ******************* video selection and phase changes ********************* //

  // select the video to be played
  const selectVideo = (selectedVideo) => {
    // returns info for the one vid you select
    console.log(selectedVideo);
    setSelectedVideo(selectedVideo);
    setPhase("guess");
  };

  // clear state for next round
  const nextRound = () => {
    // emit events TODO
    // reset user search, guesses
    setSelectedVideo(defaultVideoModel);
    handleGuess(defaultChooserModel.guess);
  };

  // take in a users guess and the emit that
  const handleGuess = (value) => {
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
      // call nextRound() to reset all the states
      nextRound();
    } else if (phase === "guess") {
      // start the video timer
      startVideoTimer(progress, setProgress, videoTime);
    } else {
      // the score phase...
    }
    if (socket) {
      socket.emit("update-phase", phase);
    } else {
      console.log("socket is null at update-phase");
    }
  }, [phase]);

  // listen for selectedVideo changes and then emit that
  useEffect(() => {
    console.log("selectedVideo", selectedVideo);
    if (socket) {
      socket.emit("update-video", selectedVideo);
    } else {
      console.log("socket is null at update-video");
    }
  }, [selectedVideo]);

  // listen for any incoming rooms changes from the scoket
  useEffect(() => {
    if (socket) {
      // updated properties contains only the properties we want to change (other wise all the use effects affiliated with the other properties(that haven't been updated) will run as well)
      socket.once("display-room", (room, updatedProperties) => {
        updatedProperties.forEach((property) => {
          setRoom((prev) => ({ ...prev, [property]: room[property] }));
        });
        console.log("display-room", room);
      });
    }
  }, [room]);

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
            selectVideo={selectVideo}
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
