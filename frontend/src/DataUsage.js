import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link}  from "react-router-dom";
import { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import Sidebar from './Sidebar'
import './App.css';
const {ipcRenderer} = window.require('electron');

export default class DataUsage extends React.Component{
  render(){
    return(
      <div>
        <Sidebar />
        <text>This is your x day using icare</text>
      </div>
    );
  }
}