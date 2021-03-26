import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import LoginMenu from './LoginMenu';
import userPreference from './userPreference';



import { BrowserRouter, Route } from "react-router-dom";
 
ReactDOM.render(
  <React.StrictMode>
     <BrowserRouter>
        <div className="App">
          <Route path="/" exact component={App} />
          <Route path="/LoginMenu" exact component={LoginMenu} />
          <Route path="/userPreference" exact component={userPreference} />
        </div>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
