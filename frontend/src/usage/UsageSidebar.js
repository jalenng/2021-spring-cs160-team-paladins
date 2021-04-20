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

const groups = [
  {
    links: [
      {
        name: 'App Usage',
        icon: 'BarChartVertical',
        key: 'app_usage'
      },
      {
        name: 'Daily Usage',
        icon: 'BarChartVertical',
        key: 'daily_usage'
      },
      {
        name: 'Weekly Usage',
        icon: 'BarChartVertical',
        key: 'weekly_usage'
      },
      {
        name: 'Total Usage',
        icon: 'BarChartVertical',
        key: 'total_usage'
      },

    ],
  },
];

export default class UsageSidebar extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    console.log()
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

        <Text variant={'xxLarge'}>
          <b>Statistics</b>
        </Text>
    
        <Nav
          selectedKey={this.props.selectedKey}
          groups={groups}
          onLinkClick={this.handleChange}
        />
  
      </Stack>
    )
  }
}
 
