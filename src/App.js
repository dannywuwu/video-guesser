import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home.js'
import Game from './pages/Game.js'
import { RoomProvider } from './context/RoomProvider';

function App() {

  return (
    <RoomProvider>
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
    </RoomProvider>
  );
}

export default App;
