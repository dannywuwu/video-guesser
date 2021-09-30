import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home.js";
import Lobby from "./pages/Lobby.js";
import GameTest from "./pages/GameTest.js";
import { UserProvider } from "./context/UserProvider";
import { SocketProvider } from "./context/SocketProvider";

const App = () => {
  return (
    <div>
      <SocketProvider>
        <UserProvider>
          <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
                <Route path="/game">
                <GameTest />
              </Route>
              <Route path="/lobby">
                <Lobby />
              </Route>
            </Switch>
          </Router>
        </UserProvider>
      </SocketProvider>
    </div>
  );
};

export default App;
