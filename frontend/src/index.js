import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import LoginMenu from './LoginMenu';
import UserPreference from './UserPreference';
import About from './About';
import DataUsage from './DataUsage';
import Notification from './Notification';
import { BrowserRouter, Route } from "react-router-dom";
 
ReactDOM.render(
  <React.StrictMode>
     <BrowserRouter>
        <div className="App">
          <Route path="/" exact component={App} />
          <Route path="/LoginMenu" exact component={LoginMenu} />
          <Route path="/UserPreference" exact component={UserPreference} />
          <Route path="/About" exact component={About} />
          <Route path="/DataUsage" exact component={DataUsage} />
          <Route path="/Notification" exact component={Notification} />
        </div>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

