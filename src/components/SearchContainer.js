import React, { useState, useEffect } from "react";
import SearchVideo from "./SearchVideo";

const SearchContainer = ({
  setPhase,
  setSelectedVideo,
  setIsSearchVisible,
}) => {
  return (
    <div>
      <SearchVideo setIsSearchVisible={setIsSearchVisible} setPhase={setPhase} setSelectedVideo={setSelectedVideo} />
    </div>
  );
};

export default SearchContainer;
