import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home.js";
import Lobby from "./pages/Lobby.js";
import SelectVideo from "./components/SelectVideo.js";
import Game from "./pages/Game.js";
import { UserProvider } from "./context/UserProvider";
import { SocketProvider } from "./context/SocketProvider";
import { RoomProvider } from "./context/RoomProvider.js";

const App = () => {
  return (
    <div>
      <RoomProvider>
        <SocketProvider>
          <UserProvider>
            <Router>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/game">
                  <Game />
                </Route>
                <Route path="/lobby">
                  <Lobby />
                </Route>
                <Route path="/test">
                  <SelectVideo />
                </Route>
              </Switch>
            </Router>
          </UserProvider>
        </SocketProvider>
      </RoomProvider>
    </div>
  );
};

export default App;
