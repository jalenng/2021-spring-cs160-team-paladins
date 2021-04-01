import React from 'react';
import Sidebar from './Sidebar'
import { Text } from '@fluentui/react/lib/Text';
import NavigationMenu from '../NavigationMenu'
import '../App.css';

export default class About extends React.Component{
  render(){
    return(
      <div className = "about">
        <NavigationMenu />
        <Sidebar />
        <Text>About us</Text>
      </div>
    );
  }
}