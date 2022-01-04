import React, { useState } from "react";
import SearchVideo from "./SearchVideo";
import ReactPlayer from "react-player";
import { Button } from "antd";

const SearchContainer = (props) => {
  const {
    updatePhase,
    updateVideo,
    setIsSearchVisible,

    selectedVideo,
    playStart,
    setPlayStart,
    playEnd,
    setPlayEnd,
    videoTime,
  } = props;

  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState({
    playedSeconds: 0,
    played: 0,
    loadedSeconds: 0,
    loaded: 0,
  });
  const handleProgress = (_progress) => {
    setProgress(_progress);
    setPlayStart(_progress.playedSeconds.toFixed());
    setPlayEnd((_progress.playedSeconds + videoTime).toFixed());
  };

  const handleSubmit = () => {
    // close modal and pause video
    setIsSearchVisible(false);
    setPlaying(false);
  };

  // returns seconds as minute string
  const toMinute = (seconds) => {
    const m = ~~(seconds / 60);
    let s = seconds % 60;
    if (s === 0) {
      s = "00";
    } else if (s < 10) {
      s = `0${s}`;
    }
    return `${m}:${s}`;
  };

  return (
    <div>
      <div className="preview-player">
        <ReactPlayer
          url={selectedVideo["videoURL"]}
          playing={playing}
          controls={true}
          onProgress={handleProgress}
        />
        <p>
          {/* remove decimals with toFixed */}
          {progress.played > 0
            ? `Play from ${toMinute(playStart)} to ${toMinute(playEnd)}`
            : ""}
        </p>
      </div>
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <SearchVideo updatePhase={updatePhase} updateVideo={updateVideo} />
    </div>
  );
};

export default SearchContainer;
