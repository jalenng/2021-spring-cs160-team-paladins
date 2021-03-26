import React from "react";
import { Link } from "react-router-dom";

import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';

const {ipcRenderer} = window.require('electron');

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to iCare</h1>
        <Link to="/LoginMenu">Login</Link>
        <br></br>
        <Link to="/userPreference">Preference</Link>
        <Stack horizontal tokens={{ childrenGap: 40 }}>

          <PrimaryButton 
            text="Test button 1 (temporary button)" 
            onClick={() => ipcRenderer.invoke('log-to-console', '1')}  
          />

          <PrimaryButton 
            text="Test button 2 (temporary button)" 
            onClick={() => ipcRenderer.invoke('log-to-console', '2')} 
          />

        </Stack>
      </div>
    );
  }
}