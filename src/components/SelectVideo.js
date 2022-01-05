import React, { useState } from "react";
import { Button, Modal } from "antd";
import SearchContainer from "./SearchContainer";

const SelectVideo = (props) => {
  const {
    phase,
    updatePhase,
    updateVideo,
    selectedVideo,
    playStart,
    setPlayStart,
    playEnd,
    setPlayEnd,
    videoTime,
  } = props;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [playing, setPlaying] = useState(true);

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const handleCancel = () => {
    setIsSearchVisible(false);
    setPlaying(false);
  };

  const handleClose = () => {
    setIsSearchVisible(false);
    setPlaying(false);
  };

  return (
    <div>
      <Button
        onClick={toggleSearch}
        disabled={phase === "search" ? false : true}
      >
        {" "}
        Open Search{" "}
      </Button>
      <Modal
        visible={isSearchVisible}
        width={1000}
        onCancel={handleCancel}
        afterClose={handleClose}
        destroyOnClose={true}
        footer={null}
      >
        <SearchContainer
          isSearchVisible={isSearchVisible}
          setIsSearchVisible={setIsSearchVisible}
          updatePhase={updatePhase}
          updateVideo={updateVideo}
          selectedVideo={selectedVideo}
          playing={playing}
          setPlaying={setPlaying}
          playStart={playStart}
          setPlayStart={setPlayStart}
          playEnd={playEnd}
          setPlayEnd={setPlayEnd}
          videoTime={videoTime}
        />
      </Modal>
    </div>
  );
};

export default SelectVideo;
