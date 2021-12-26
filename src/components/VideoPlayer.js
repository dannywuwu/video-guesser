import { React, useState } from "react";
import ReactPlayer from "react-player/youtube";
import SearchContainer from "./SearchContainer";

// TODO: rename to VideoContainer
const VideoPlayer = (props) => {
  const { url, searchPhase } = props;

  // set it to true for now for testing
  const [playing, setPlaying] = useState(true);
  const [ref, setRef] = useState(null);
  // fraction percentage of current video duration played
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playStart, setPlayStart] = useState(0);
  const [playEnd, setPlayEnd] = useState(0);

  const seek = (time) => {
    ref.seekTo(time, "seconds");
  };

  const handleDuration = (_duration) => {
    setDuration(_duration);
  };

  const handlePlaying = () => {
    setPlaying(!playing);
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
            onDuration={handleDuration}
            style={{ pointerEvents: 'none' }}
          />
          {played * duration}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
