import React from 'react';
import Sidebar from './Sidebar'
import Toggle from '../Toggle'
import Account from './Account'

import { Nav } from '@fluentui/react/lib/Nav';
import { Text } from '@fluentui/react/lib/Text';

const navStyles = {
  root: {
    width: 208,
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
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

        <Nav
          selectedKey={this.state.selectedKey}
          styles={navStyles}
          groups={navLinkGroups}
          onLinkClick={(event, item) => {
            this.setState({ selectedKey: item.key })
          }}
        />

        {/* <Toggle /> */}
      </div>
    );
  }
}

