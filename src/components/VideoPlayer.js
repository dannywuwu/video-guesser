import { React, useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { Button, TimePicker, notification } from "antd";

import "../styles/videoPlayer/videoPlayer.css";

// TODO: rename to VideoContainer
const VideoPlayer = (props) => {
  const {
    url,
    selectedPhase,
    chooserStatus,
    socket,
    rName,
    progress,
    setProgress,
    bufferStatus,
    setBufferStatus,
    updatePhase,
    playStart,
    setPlayStart,
    playEnd,
    setPlayEnd,
    videoTime,
  } = props;

  // playing/paused
  const [playing, setPlaying] = useState(false);
  // reference to reactplayer
  const playerRef = useRef(null);
  // video length in seconds
  const [duration, setDuration] = useState(0);
  // player visibility (true for testing)
  const [visible, setVisible] = useState(true);

  // seek to given time with player
  const seek = (time) => {
    playerRef.current.seekTo(time, "seconds");
  };

  const handleProgress = (_progress) => {
    setProgress(_progress);
    // finished preview, pause and seek to playStart and update phase to score
    if (_progress.playedSeconds >= playEnd) {
      seek(playStart);
      setPlaying(false);
      updatePhase("score");
    }
  };

  const handlePlaying = () => {
    // toggle video playing status for all during guess phase
    if (selectedPhase === "guess" && socket) {
      socket.emit("toggle-play", playing, rName);
    }
  };

  // set play start time to current progress time
  const handleStart = () => {
    seek(playStart);
  };

  const handleDuration = (_duration) => {
    setDuration(_duration);
  };

  const handleVisibility = () => {
    // toggle video blur
    if (socket) {
      socket.emit("toggle-blur", visible, rName);
    }
  };

  // listen to video toggle
  useEffect(() => {
    if (socket) {
      socket.once("toggle-play", (playStatus) => {
        setPlaying(playStatus);
      });
    }
  }, [playing]);

  // listen to blur emit
  useEffect(() => {
    if (socket) {
      socket.once("toggle-blur", (blurStatus) => {
        setVisible(blurStatus);
      });
    }
  }, [visible]);

  // basic notification wrapper
  const notify = (data) => {
    const { message, description } = data;
    notification.open({
      message,
      description,
    });
  };

  return (
    <div>
      <div className="player-container">
        {/* toggle blur on player */}
        <div
          className="react-player"
          style={{
            background: "#ddd",
            paddingTop: "56.25%",
            height: "0",
            width: "40vw",
            position: "relative",
          }}
          className={`${visible ? "" : "blur"}`}
        >
          <ReactPlayer
            ref={playerRef}
            url={url}
            playing={playing}
            progressInterval={50}
            onProgress={handleProgress}
            onStart={handleStart}
            onBuffer={() => setBufferStatus(true)}
            onBufferEnd={() => setBufferStatus(false)}
            onDuration={handleDuration}
            height="100%"
            width="100%"
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: "0",
              top: "0",
            }}
          />
        </div>
        {/* plpayer controls are only visible to chooser */}
        <div
          className="player-controls"
          style={{
            visibility: chooserStatus ? "visible" : "hidden",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* disable play/time pick/ blur if video has not been selected */}
          <Button onClick={handlePlaying} disabled={url ? false : true}>
            {playing ? "Pause" : "Play"}
          </Button>
          <Button onClick={handleVisibility} disabled={url ? false : true}>
            {visible ? "Blur Video" : "Unblur Video"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
