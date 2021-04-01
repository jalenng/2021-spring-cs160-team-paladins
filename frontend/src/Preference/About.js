import React from 'react';
import Sidebar from '../Components/Sidebar'
import '../App.css';

export default class About extends React.Component{
  render(){
    return(
      <div className = "about">
        <Sidebar />
        <text>About us</text>
      </div>
    );
  }
}