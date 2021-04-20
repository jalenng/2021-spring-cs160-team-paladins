import React from 'react';

import HomeScreen from './HomeScreen';
import UsageScreen from './UsageScreen';
import InsightsScreen from './InsightsScreen';
import PreferencesScreen from './preferences/PreferencesScreen'

import { Text } from '@fluentui/react/lib/Text';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';

const { ipcRenderer } = window.require('electron');

const { getAccountStore } = require('./storeHelperFunctions');

const topRightDivStyle = {
  position: 'fixed',
  top: '3px',
  right: '3px',
};

const topRightCornerProps = {
  horizontal: true,
  verticalAlign: 'center', 
  style: topRightDivStyle,
  styles: { root: { height: 42} },
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

    const isSignedIn = this.state.account.token != null
    const displayName = this.state.account.accountInfo.displayName.toString()

    return (
      <div>  

        <Pivot linkSize='large'>
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

        {/* If signed in: show display name and persona */}
        {isSignedIn && (
          <Stack {...topRightCornerProps}>
            <Text>{displayName}</Text>
            <Persona
              size= {PersonaSize.size40}
              hidePersonaDetails={true}
              text={displayName}
            />
          </Stack>
        )}

        {/* If not signed in: show sign in button */}
        {!isSignedIn && (
          <Stack {...topRightCornerProps}>
            <DefaultButton text='Sign in'
              onClick={() => ipcRenderer.invoke('show-sign-in-popup')}
            /> 
          </Stack>
        )}     

      </div>
    );
  }
}