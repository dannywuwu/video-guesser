import { React, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { Button } from "antd";
import SearchContainer from "./SearchContainer";

const VideoContainer = (props) => {
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

  return (
    <div>
      {searchPhase ? (
        <SearchContainer />
      ) : (
        <div className="player-container">
          <ReactPlayer
            ref={setRef}
            url={url}
            playing={playing}
            onProgress={handleProgress}
            onStart={handleStart}
            onBuffer={() => setBufferStatus(true)}
            onBufferEnd={() => setBufferStatus(false)}
          />
          <div className="player-controls">
            <Button onClick={handlePlaying}>
              {playing ? "Pause" : "Play"}
            </Button>
            <Button onClick={() => seek(5)}>seek</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoContainer;
