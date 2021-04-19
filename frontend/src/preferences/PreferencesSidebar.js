import React from 'react';

import { Nav } from '@fluentui/react/lib/Nav';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

const navStyles = {
  root: {
    width: 200,
    height: '100%',
    position: 'fixed',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
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
        icon: 'Ringer',
        key: 'notifications'
      },
      {
        name: 'Startup',
        icon: 'PowerButton',
        key: 'startup'
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

export default class PreferencesSidebar extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event, item) {
    const key = item.key;
    this.props.onUpdateSelectedKey(key);
  }

  render() {
    return (
      <Stack 
        tokens={{ childrenGap: 12 }} 
        styles={navStyles}>

        <Text variant={'xxLarge'} block>
          <b>Preferences</b>
        </Text>
    
        <Nav
          selectedKey={this.props.selectedKey}
          groups={navLinkGroups}
          onLinkClick={this.handleChange}
        />
  
      </Stack>
    )
  }
}
 
