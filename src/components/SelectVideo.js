import { Button, Modal } from "antd";
import React, { useState } from "react";
import SearchContainer from "./SearchContainer";

const SelectVideo = ({ phase, updatePhase, updateVideo }) => {
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
        <SearchContainer setIsSearchVisible={setIsSearchVisible} updatePhase={updatePhase} updateVideo={updateVideo}/>
      </Modal>
    </div>
  );
};

export default SelectVideo;
