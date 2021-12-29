import React, { useState, useEffect } from "react";
import SearchVideo from "./SearchVideo";

const SearchContainer = ({
  setPhase,
  selectVideo,
  setIsSearchVisible,
}) => {
  return (
    <div>
      <SearchVideo setIsSearchVisible={setIsSearchVisible} setPhase={setPhase} selectVideo={selectVideo} />
    </div>
  );
};

export default SearchContainer;
