import React from 'react';
import Sidebar from '../Components/Sidebar'
import SwitchBtn from '../Components/SwitchBtn'
import DropdownMenu from '../Components/DropdownMenu'
import '../App.css';
import UploadFile from '../Components/UploadFile'


export default class Notification extends React.Component{
  render(){
    return(
      <div>
        <Sidebar />
        <div className = "switchBtn">
          
          <SwitchBtn />
          <DropdownMenu />
          <UploadFile />
          <button >Save</button>
        </div>
      </div>
    );
  }
}