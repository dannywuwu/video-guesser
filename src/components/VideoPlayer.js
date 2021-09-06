import React from "react";
import ReactPlayer from "react-player/youtube";

const VideoPlayer = (props) => {
  const { url } = props;
  return (
    <div>
      <h1>player</h1>
      <p>epic</p>
      <ReactPlayer url={url} playing={true} />
    </div>
  );
};

export default VideoPlayer;
