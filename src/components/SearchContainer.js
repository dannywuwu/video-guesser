import React, { useState, useEffect } from "react";

import { Input } from "antd";

const SearchContainer = () => {
  const [search, setSearch] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const onSearch = (value) => {
    console.log("queryResult:", value);
    setQueryResult(value);
    setSearch("");
    setInputDisabled(true);
  };

  useEffect(() => {
    if (search != "") {
      fetch(`https://song-searcher-backend-thing.weelam.repl.co/get/${search}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setQueryResult(data);
        })
        .catch((err) => console.log(err));
    }
  }, [search]);

  return (
    <div>
      <h1>sergio bar</h1>
      <Input
        placeholder="Search for YouTube video"
        allowClear
        onPressEnter={onSearch}
        disabled={inputDisabled}
        style={{ width: 200 }}
      />
    </div>
  );
};

export default SearchContainer;
