import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link}  from "react-router-dom";
import { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import Sidebar from './Sidebar'
import SwitchBtn from './SwitchBtn'
import DropdownMenu from './DropdownMenu'
import './App.css';
const {ipcRenderer} = window.require('electron');

export default class Notification extends React.Component{
  render(){
    return(
      <div>
        <Sidebar />
        <div className = "switchBtn">
          <SwitchBtn />
          <DropdownMenu />
          <button>Save</button>
        </div>
      </div>
    );
  }
}