import React from 'react';
import Sidebar from './Sidebar'
import { Text } from '@fluentui/react/lib/Text';
import NavigationMenu from '../NavigationMenu'
import '../App.css';

export default class DataUsage extends React.Component{
  render(){
    return(
      <div>
        <NavigationMenu />
        <Sidebar />
        <Text>This is your x day using icare</Text>
      </div>
    );
  }
}