import React from "react";
import ReactPlayer from "react-player/youtube";
import SearchContainer from "./SearchContainer";

const VideoPlayer = (props) => {
  const { url, searchPhase } = props;
  return (
    <div>
      {searchPhase ? (
        <SearchContainer />
      ) : (
        <ReactPlayer url={url} playing={true} />
      )}
    </div>
  );
};

export default VideoPlayer;
