import React from 'react';
import Sidebar from './Sidebar'
import Toggle from '../Toggle'
import Account from './Account'

export default class UserPreference extends React.Component{
  render(){
    return(
      <div>
        <Sidebar />
        <Toggle />
      </div>
    );
  }
}

