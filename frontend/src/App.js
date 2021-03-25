import React from "react";
// import { Link } from "react-router-dom";

import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Text } from '@fluentui/react/lib/Text';

const { ipcRenderer } = window.require('electron');

const divStyle = {
  paddingTop: '10px',
  paddingLeft: '30px',
};

export default class App extends React.Component {
  render() {

    return (
      <div style={divStyle}>
        <Text variant={'xxLarge'} block>
          <b>Welcome to iCare</b>
        </Text>

        <PrimaryButton
            text='Sign In'
            onClick={() => ipcRenderer.invoke('show-sign-in-popup')}
        />

      </div>
    );
  }
}