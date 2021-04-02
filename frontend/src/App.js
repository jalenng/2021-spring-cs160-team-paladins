import React from "react";

import HomeScreen from './HomeScreen';
import UsageScreen from './UsageScreen';
import InsightsScreen from './InsightsScreen';
import PreferencesScreen from './preferences/PreferencesScreen'

import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';

const { ipcRenderer } = window.require('electron');

const { getAccountStore } = require('./storeHelperFunctions');

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",
};

const signInDivStyle = {
  position: "fixed",
  top: "3px",
  right: "3px",
};

export default class App extends React.Component {

  render() {

    // Account
    const accountStore = getAccountStore();

    const isSignedIn = accountStore.token != null
    const displayName = accountStore.accountInfo.displayName

    // Extract initials from display name. 
    let regex = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
    let displayInitials = [...displayName.matchAll(regex)] || [];
    displayInitials = (
        (displayInitials.shift()?.[1] || '') + (displayInitials.pop()?.[1] || '')
    ).toUpperCase();

    return (
      <div style={divStyle}>
        <Pivot aria-label="Basic Pivot Example" linkSize="large">
          <PivotItem itemIcon="Home">
            <HomeScreen/>
          </PivotItem>
          <PivotItem itemIcon="BarChartVertical">
            <UsageScreen/>
          </PivotItem>
          <PivotItem itemIcon="Lightbulb">
            <InsightsScreen/>
          </PivotItem>
          <PivotItem itemIcon="Settings">
            <PreferencesScreen/>
          </PivotItem>
        </Pivot>

        <Stack 
          horizontal 
          verticalAlign="center" 
          style={signInDivStyle} 
          tokens={{ childrenGap: 10 }}
          >
          <PrimaryButton
            text='Sign in'
            onClick={() => ipcRenderer.invoke('show-sign-in-popup')}
          />
          <Persona
            imageInitials={displayInitials}
            size= {PersonaSize.size40}
            hidePersonaDetails={true}
          />
        </Stack>
      </div>
        
    );
  }
}

