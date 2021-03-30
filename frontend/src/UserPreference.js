import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link}  from "react-router-dom";
import { Component } from 'react'
import Sidebar from './Sidebar'
import Toggle from './Toggle'
import Persona from './Persona'
const {ipcRenderer} = window.require('electron');

export default class UserPreference extends React.Component{
  render(){
    return(
      <div>
        <Persona />
        <Sidebar />
        <Toggle />
        <Persona />
      </div>
    );
  }
}

