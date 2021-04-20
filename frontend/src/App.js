import React from 'react';

import HomeScreen from './HomeScreen';
import UsageScreen from './UsageScreen';
import InsightsScreen from './InsightsScreen';
import PreferencesScreen from './preferences/PreferencesScreen'

import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Text } from '@fluentui/react/lib/Text';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';

const { ipcRenderer } = window.require('electron');

const { getAccountInfo, getAccountStore } = require('./storeHelperFunctions');

const topRightCornerProps = {
  horizontal: true,
  verticalAlign: 'center', 
  style: {
    position: 'fixed',
    top: '3px',
    right: '3px',
  },
  styles: { root: { height: 42} },
  tokens: { childrenGap: 16 }
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      account: getAccountStore()
    }
  }

  componentDidMount() {
    
    // Update this component's state when account is updated
    ipcRenderer.on('account-store-changed', () => {
        this.updateAccountState();
    })

    // Get the latest account info 
    const isSignedIn = this.state.account.token != null
    if (isSignedIn) {
      getAccountInfo().then(result => {

        // If information retrieval was not successful, show error message
        if (!result.success) this.addMessage({
          type: MessageBarType.error,
          contents: `Failed to retrieve account information: ${result.data.message}`
        })
          
      });
    }
    
  }

  updateAccountState() {
    let state = this.state;
    state.account = getAccountStore();
    this.setState(state);
  }

  removeMessage(index) {
    let state = this.state;
    state.messages.splice(index, 1);
    this.setState(state);
  }

  addMessage(message) {
    let state = this.state;
    state.messages = [...state.messages, message];
    this.setState(state);
  }

  render() {

    const isSignedIn = this.state.account.token != null
    const displayName = this.state.account.accountInfo.displayName.toString()

    const messages = this.state.messages.map( (message, index) => {
      return (
        <MessageBar
          messageBarType={message.type}
          onDismiss={() => this.removeMessage(index)}
        >
          {message.contents}
        </MessageBar>
      )
    })

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

        {/* Show app messages */}
        <Stack reversed
          tokens={{ childrenGap: 8 }}
          style={{
            position: 'fixed',
            bottom: '8px',
            right: '8px',
            width: '300px'
          }}
        >
          {messages}        
        </Stack>

      </div>
    );
  }
}