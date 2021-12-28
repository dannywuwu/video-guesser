import React, { useState, useEffect } from "react";
import SearchVideo from "./SearchVideo";

const SearchContainer = ({
  updatePhase,
  updateVideo,
  setIsSearchVisible,
}) => {
  return (
    <div>
      <SearchVideo setIsSearchVisible={setIsSearchVisible} updatePhase={updatePhase} updateVideo={updateVideo} />
    </div>
  );
};

export default SearchContainer;
