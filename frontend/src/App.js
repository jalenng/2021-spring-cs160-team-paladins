import React from 'react';

import HomeScreen from './HomeScreen';
import UsageScreen from './UsageScreen';
import InsightsScreen from './InsightsScreen';
import PreferencesScreen from './preferences/PreferencesScreen'

import { Text } from '@fluentui/react/lib/Text';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';

const { ipcRenderer } = window.require('electron');

const { getAccountStore } = require('./storeHelperFunctions');

const divStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
};

const signInDivStyle = {
  position: 'fixed',
  top: '3px',
  right: '3px',
};

const topRightCornerProps = {
  horizontal: true,
  verticalAlign: 'center', 
  style: signInDivStyle,
  height: '54px',
  tokens: { childrenGap: 16 }
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      account: getAccountStore()
    }
  }

  componentDidMount() {
    // Update this component's state when account is updated
    ipcRenderer.on('account-store-changed', () => {
        this.updateState();
    })
  }

  updateState() {
    this.setState({ account: getAccountStore() });
  }

  render() {

    console.log(this.state.account)

    const isSignedIn = this.state.account.token != null
    const displayName = this.state.account.accountInfo.displayName

    // Extract initials from display name. 
    let regex = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
    let displayInitials = [...displayName.matchAll(regex)] || [];
    displayInitials = (
        (displayInitials.shift()?.[1] || '') + (displayInitials.pop()?.[1] || '')
    ).toUpperCase();

    // Choose what to show on the top right corner based on sign-in status
    let topRightCorner;

    if (isSignedIn) {
      // If signed in, show PFP and display name
      topRightCorner =  <Stack {...topRightCornerProps}>
                            
                          <Text>{displayName}</Text>
                          <Persona
                            imageInitials={displayInitials}
                            size= {PersonaSize.size40}
                            hidePersonaDetails={true}
                          />

                        </Stack>
    }
    else {
      // Otherwise, simply show a sign-in button
      topRightCorner =  <Stack {...topRightCornerProps}>

                          <PrimaryButton text='Sign in'
                            onClick={() => ipcRenderer.invoke('show-sign-in-popup')}
                          /> 

                        </Stack>
    }

    return (
      <div style={divStyle}>

        <Pivot aria-label='Basic Pivot Example' linkSize='large'>
          <PivotItem itemIcon='Home'>
            <HomeScreen/>
          </PivotItem>
          <PivotItem itemIcon='BarChartVertical'>
            <UsageScreen/>
          </PivotItem>
          <PivotItem itemIcon='Lightbulb'>
            <InsightsScreen/>
          </PivotItem>
          <PivotItem itemIcon='Settings'>
            <PreferencesScreen/>
          </PivotItem>
        </Pivot>
            
        {topRightCorner}

      </div>
    );
  }
}