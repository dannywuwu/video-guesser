import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home.js'
import Game from './pages/Game.js'
import { UserProvider } from './context/UserProvider';
import { SocketProvider } from './context/SocketProvider';


function App() {

  return (
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
          </Switch>

        </Router>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;
