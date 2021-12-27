import { React, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { Button, TimePicker, notification } from "antd";
import SearchContainer from "./SearchContainer";

// TODO: rename to VideoContainer
const VideoPlayer = (props) => {
  const { url, searchPhase } = props;

  // playing/paused
  const [playing, setPlaying] = useState(false);
  // reference to reactplayer
  const [ref, setRef] = useState(null);
  // timestamps for play start/end
  const [playStart, setPlayStart] = useState(0);
  const [playEnd, setPlayEnd] = useState(0);
  // progress obj
  const [progress, setProgress] = useState(null);
  // video buffer state
  const [bufferStatus, setBufferStatus] = useState(false);
  // video length in seconds
  const [duration, setDuration] = useState(0);

  const seek = (time) => {
    ref.seekTo(time, "seconds");
  };

  const handleProgress = (_progress) => {
    setProgress(_progress);
  };

  const handlePlaying = () => {
    setPlaying(!playing);
  };

  // set play start time to current progress time
  const handleStart = () => {
    setPlayStart(progress.playedSeconds);
  };

  const handleDuration = (_duration) => {
    setDuration(_duration);
  };

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
      {searchPhase ? (
        <SearchContainer />
      ) : (
        <div className="player-container">
          <div className="react-player">
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
          <div className="player-controls">
            <Button onClick={handlePlaying}>
              {playing ? "Pause Preview" : "Play Preview"}
            </Button>
            <TimePicker
              format={"mm:ss"}
              showNow={false}
              onSelect={(value) => {
                const date = new Date(value._d);
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();
                const time = minutes * 60 + seconds;
                console.log("time", time);
                // seek video to selected time if within duration
                if (time < duration) {
                  seek(time);
                  setPlaying(true);
                  // end playing after 20 seconds
                  setPlayEnd(time + 20);
                } else {
                  // notify out of bounds
                  notify({
                    message: "Specified time is over video length!",
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
