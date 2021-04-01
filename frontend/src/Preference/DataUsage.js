import React from 'react';
import Sidebar from '../Components/Sidebar'
import '../App.css';

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