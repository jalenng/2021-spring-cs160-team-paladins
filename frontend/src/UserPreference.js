import React from 'react';
import Sidebar from './Components/Sidebar'
import Toggle from './Components/Toggle'
import Persona from './Components/Persona'

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

