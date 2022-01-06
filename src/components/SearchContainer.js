import React, { useState, useRef } from "react";
import SearchVideo from "./SearchVideo";
import ReactPlayer from "react-player";
import { Button } from "antd";

const defaultVideoModel = {
  title: "title",
  channelTitle: "channelTitle",
  imageURL: "",
  videoURL: "",
};

const SearchContainer = (props) => {
  const {
    updatePhase,
    updateVideo,
    isSearchVisible,
    setIsSearchVisible,
    phase,
    selectedVideo,
    playing,
    setPlaying,
    playStart,
    setPlayStart,
    playEnd,
    setPlayEnd,
    videoTime,
  } = props;

  const [progress, setProgress] = useState({
    playedSeconds: 0,
    played: 0,
    loadedSeconds: 0,
    loaded: 0,
  });
  const [previewVideo, setPreviewVideo] = useState(defaultVideoModel);
  const previewRef = useRef(null);

  const handleProgress = (_progress) => {
    setProgress(_progress);
    setPlayStart(_progress.playedSeconds.toFixed());
    setPlayEnd((_progress.playedSeconds + videoTime).toFixed());
  };

  const handleSubmit = () => {
    // close modal and pause video
    setIsSearchVisible(false);
    setPlaying(false);
    if (phase === "search") {
      updatePhase("guess");
    }
    updateVideo(previewVideo);
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

  // scroll to video preview on video select
  const handleScroll = () => {
    console.log("previewref", previewRef);
    previewRef.current.scrollIntoView();
  };

  return (
    <div>
      <div>
        <div
          className="preview-player"
          style={{
            height: "0",
            paddingTop: "56.25%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            margin: "0",
          }}
          ref={previewRef}
        >
          <ReactPlayer
            url={previewVideo["videoURL"]}
            playing={playing}
            controls={true}
            onProgress={handleProgress}
            height="100%"
            width="100%"
            style={{
              position: "absolute",
              top: "0",
              bottom: "0",
              margin: "auto",
              textAlign: "center",
              background: "#ddd",
            }}
          />
        </div>
        <SearchVideo
          updatePhase={updatePhase}
          updateVideo={updateVideo}
          setPreviewVideo={setPreviewVideo}
          handleScroll={handleScroll}
        />
      </div>
      {JSON.stringify(defaultVideoModel) !== JSON.stringify(previewVideo) && (
        <div
          className="searchContainer-footer"
          style={{
            position: "absolute",
            left: "0px",
            bottom: "0px",
            zIndex: "10",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            height: "10%",
            borderTop: "solid #ddd 1px",
            background: "white",
            padding: "10px 0",
          }}
        >
          <div>
            <p style={{ color: "#949494", margin: 0 }}>Title</p>
            <h3>{previewVideo["title"]}</h3>
          </div>
          <div>
            <p style={{ color: "#949494", margin: 0 }}>Interval</p>
            <h3>{`${toMinute(playStart)} to ${toMinute(playEnd)}`}</h3>
          </div>
          <Button type="primary" onClick={handleSubmit} size="large">
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchContainer;
