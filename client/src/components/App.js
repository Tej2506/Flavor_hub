//App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import UserProfile from './UserProfile';
import PublicFeed from './PublicFeed';
import Feedback from './Feedback';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <Route exact path = "/userprofile" component={UserProfile}/>
          <Route exact path = "/user/publicfeed" component={PublicFeed}/>
          <Route exact path = "/user/feedback" component={Feedback}/>
        </Switch>
      </div>
    </Router>
  
   
  );
}

export default App;
