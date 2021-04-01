import React from 'react';
import Sidebar from '../Sidebar'
import SwitchBtn from './SwitchBtn'
import DropdownMenu from './DropdownMenu'
import UploadFile from './UploadFile'
import NavigationMenu from '../../NavigationMenu'
import '../../App.css'


export default class Notification extends React.Component{
  render(){
    return(
      <div> 
        <Sidebar />
        <div className = 'switchBtn'>
          <SwitchBtn />
          <DropdownMenu />
          <UploadFile />
          <button >Save</button>
        </div>
      </div>
    );
  }
}