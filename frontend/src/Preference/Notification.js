import React from 'react';
import Sidebar from '../Sidebar'
import SwitchBtn from '../SwitchBtn'
import DropdownMenu from '../DropdownMenu'
import '../App.css';


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