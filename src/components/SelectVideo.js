import { Button, Modal } from "antd";
import React, { useState } from "react";
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

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const handleCancel = () => {
    setIsSearchVisible(false);
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
        footer={null}
      >
        <SearchContainer
          setIsSearchVisible={setIsSearchVisible}
          updatePhase={updatePhase}
          updateVideo={updateVideo}
          selectedVideo={selectedVideo}
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
