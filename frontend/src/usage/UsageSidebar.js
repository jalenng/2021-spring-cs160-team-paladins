import React from 'react';

<<<<<<< HEAD
import { Nav } from '@fluentui/react/lib/Nav';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { IconButton } from '@fluentui/react/lib/Button';
import { MessageBarType } from '@fluentui/react/lib/MessageBar';
=======
import { 
  Nav,
  Stack,
  Text 
} from '@fluentui/react';
>>>>>>> frontend-dev

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
        name: 'Daily App Usage',
        icon: 'Favicon',
        key: 'daily_app_usage'
      },
      {
        name: 'Weekly App Usage',
        icon: 'Favicon',
        key: 'weekly_app_usage'
      },
      {
        name: 'Daily Timer Usage',
        icon: 'GoToToday',
        key: 'daily_timer_usage'
      },
      {
        name: 'Weekly Timer Usage',
        icon: 'CalendarWorkWeek',
        key: 'weekly_timer_usage'
      },
    ],
  },
];

export default class UsageSidebar extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.dataUsage = store.dataUsage.getAll();

    // Every 10 seconds, push unsynced data usage to the server.
    setInterval(this.syncUsage, 10000);
  }

  syncUsage() {
    store.dataUsage.push().then(result => {
      if (result.success) {
          store.dataUsage.reset();
          this.dataUsage = store.dataUsage.getAll();
          store.dataUsage.fetch();
        }
      });
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
 
