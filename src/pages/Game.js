import React, { useState, useEffect } from "react";

const Game = () => {
  const [submitted, setSubmitted] = useState(false)
  const [query, setQuery] = useState({})
  const [isChooser, setIsChooser] = useState(true)
  const [search, setSearch] = useState("");
  // dictionary playerID -> guess
  const [guess, setGuess] = useState("");
  const [chooserID, setChooserID] = useState("");

  // phase toggle: 'search', 'guess', 'score'
  // initially search
  const [phase, setPhase] = useState("search");

  // clear state for next round
  const nextRound = () => {
    // reset search, player guesses
    setSearch("");
    setGuess("");
  };

  // mutate users in context
  const chooseChooser = () => {
    // use modulus %, emit to server
    // server will broadcast and update the other users' state
  };

  // give points to selected players
  // called once Chooser submits correct players
  const updatePoints = () => {};
  
  const handleFinish = (values) => {
    console.log(values.search)
    setSearch(values.search)
  }
  const handleFinishFailed = (e) => {
    console.log("Finished Failed")
  }

 

  useEffect(() => {
    if (search != "") {
      fetch(`https://song-searcher-backend-thing.weelam.repl.co/get/${search}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setQuery(data);
          setSubmitted(true);
        })
        .catch((err) => console.log(err));
    }
  }, [search]);

  return (
    <div>
      <h1>game</h1>
      
      
      {
        // moving the searching stuff here for now
        // allow user to search if it's there turn
        isChooser && (
          <>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
              // onFieldsChange={handleFieldsChange}
              autoComplete="off"
            >
              <Form.Item
                name="search"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="Search..." />
              </Form.Item>
            </Form>

          </>
        )
      }
    </div>
  );
};

export default Game;
