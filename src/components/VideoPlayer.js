import { React, useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { Button, TimePicker, notification } from "antd";

import "../styles/videoPlayer/videoPlayer.css";

// TODO: rename to VideoContainer
const VideoPlayer = (props) => {
  const { url, selectedPhase, chooserStatus, socket, rName } = props;

  // playing/paused
  const [playing, setPlaying] = useState(false);
  // reference to reactplayer
  const [ref, setRef] = useState(null);
  // timestamps for play start/end
  const [playStart, setPlayStart] = useState(0);
  const [playEnd, setPlayEnd] = useState(20);
  // progress obj
  const [progress, setProgress] = useState(null);
  // video buffer state
  const [bufferStatus, setBufferStatus] = useState(false);
  // video length in seconds
  const [duration, setDuration] = useState(0);
  // player visibility (true for testing)
  const [visible, setVisible] = useState(true);

  const seek = (time) => {
    ref.seekTo(time, "seconds");
  };

  const handleProgress = (_progress) => {
    setProgress(_progress);
    // finished preview, pause and seek to playStart
    if (_progress.playedSeconds >= playEnd) {
      seek(playStart);
      setPlaying(false);
    }
  };

  const handlePlaying = () => {
    // toggle video playing status for all during guess phase
    // if (selectedPhase === "guess" && socket) {
    if (socket) {
      socket.emit("toggle-play", playing, rName);
    }
    // } else {
    //   // only toggle preview locally for other phases
    //   setPlaying(!playing);
    // }
  };

  // set play start time to current progress time
  const handleStart = () => {
    setPlayStart(progress.playedSeconds);
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
        console.log("now blurring to ", blurStatus);
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
        <div className="react-player" className={`${visible ? "" : "blur"}`}>
          <ReactPlayer
            ref={setRef}
            url={url}
            playing={playing}
            onProgress={handleProgress}
            onStart={handleStart}
            onBuffer={() => setBufferStatus(true)}
            onBufferEnd={() => setBufferStatus(false)}
            onDuration={handleDuration}
            style={{ pointerEvents: "none" }}
          />
        </div>
        {/* plpayer controls are only visible to chooser */}
        <div
          className="player-controls"
          style={{
            visibility: chooserStatus ? "visible" : "hidden",
          }}
        >
          {/* disable play/time pick/ blur if video has not been selected */}
          <Button onClick={handlePlaying} disabled={url ? false : true}>
            {playing ? "Pause Preview" : "Play Preview"}
          </Button>
          {/* start time picker */}
          <TimePicker
            format={"mm:ss"}
            showNow={false}
            onSelect={(value) => {
              const date = new Date(value._d);
              const minutes = date.getMinutes();
              const seconds = date.getSeconds();
              const time = minutes * 60 + seconds;
              // seek video to selected time if within duration
              if (time < duration) {
                seek(time);
                setPlaying(true);
                // set play start/end
                setPlayStart(time);
                // end playing after 20 seconds
                setPlayEnd(time + 20);
              } else {
                // notify out of bounds
                notify({
                  message: "Specified time is over video length!",
                });
              }
            }}
            disabled={url ? false : true}
          />
          <Button onClick={handleVisibility} disabled={url ? false : true}>
            {visible ? "Blur Video" : "Unblur Video"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
