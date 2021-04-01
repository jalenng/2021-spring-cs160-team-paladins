import React from 'react';
import Sidebar from './Sidebar'
import { Text } from '@fluentui/react/lib/Text';
import '../App.css';

export default class DataUsage extends React.Component{
  render(){
    return(
      <div>
        <Sidebar />
        <Text>This is your x day using icare</Text>
      </div>
    );
  }
}