import React from 'react';
import Sidebar from './Sidebar'
import Toggle from './Toggle'
import Persona from './Persona'

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

