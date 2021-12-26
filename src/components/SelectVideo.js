import { Button, Modal } from "antd";
import React, { useState } from "react";
import SearchContainer from "./SearchContainer";

const SelectVideo = ({ phase, setPhase, setSelectedVideo }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const handleCancel = () => {
    setIsSearchVisible(false);
  };
  return (
    <div>
      <Button onClick={toggleSearch} disabled={phase === "search" ? false : true}> Open Search </Button>
      <Modal
        visible={isSearchVisible}
        width={1000}
        onCancel={handleCancel}
        footer={null}
      >
        <SearchContainer setIsSearchVisible={setIsSearchVisible} setPhase={setPhase} setSelectedVideo={setSelectedVideo}/>
      </Modal>
    </div>
  );
};

export default SelectVideo;
