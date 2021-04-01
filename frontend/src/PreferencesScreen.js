import React from 'react';

import { Nav } from '@fluentui/react/lib/Nav';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

const navStyles = {
  root: {
    width: 208,
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};

const bottomLeftOptionsStyle = {
  position: "fixed",
  bottom: "10px",
  left: "30px",
};

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px',
};

const navLinkGroups = [
  {
    links: [
      {
        name: 'Your accounts',
        icon: 'ContactInfo',
        key: 'your_accounts'
      },
      {
        name: 'Notifications',
        icon: 'CannedChat',
        key: 'notifications'
      },
      {
        name: 'Data usage',
        icon: 'BarChartVertical',
        key: 'data_usage'
      },
      {
        name: 'About',
        icon: 'Info',
        key: 'about'
      }
    ],
  },
];

export default class UserPreference extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      selectedKey: "your_accounts"
    };
  }

  render(){
    return(
      <div style={divStyle}>

        <Text variant={'xxLarge'} block>
          <b>Preferences</b>
        </Text>

        {/* Left nav sidebar */}
        <Nav
          selectedKey={this.state.selectedKey}
          styles={navStyles}
          groups={navLinkGroups}
          onLinkClick={(event, item) => {
            this.setState({ selectedKey: item.key })
          }}
        />

        {/* Bottom left options */}
        <Stack 
          vertical 
          style={bottomLeftOptionsStyle} 
          >

          <Toggle 
            label="Run app on system startup" 
            defaultChecked 
            onText="On" offText="Off"
          />

          <Toggle 
            label="Start timer on app startup" 
            defaultChecked 
            onText="On" offText="Off"
          />

        </Stack>

      </div>
    );
  }
}

