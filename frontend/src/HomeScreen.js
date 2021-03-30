import React from "react";
 
import Timer from "./Timer.js";

import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Text } from '@fluentui/react/lib/Text';

const { ipcRenderer } = window.require('electron');

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px',
};


export default class HomeScreen extends React.Component {
  render() {
    return (    

      <div style={divStyle}>
        <Text variant={'xxLarge'} block>
          <b>Home</b>
        </Text>

        <Timer/>

        <PrimaryButton
          text='Test overlay'
          onClick={() => ipcRenderer.invoke('handle-break')}
        />

      </div>
      
    );
  }
}

