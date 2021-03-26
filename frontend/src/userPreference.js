import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";

const {ipcRenderer} = window.require('electron');


export default class UserPreference extends React.Component {
    render() {
      return (
        <div>
           <h1>Preference</h1>
           <button><Link to='/' >Home</Link></button>
           <button><Link to='/notification' >Notifications</Link></button>
           <button><Link to='/dataUsage' >Data usage</Link></button>
           <button><Link to='/about' >About</Link></button>
        </div>
      );
    }
  }
