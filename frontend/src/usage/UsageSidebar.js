import React from 'react';

import { Nav } from '@fluentui/react/lib/Nav';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { IconButton } from '@fluentui/react/lib/Button';
import { MessageBarType } from '@fluentui/react/lib/MessageBar';

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
    console.log()
    this.handleRefreshBtn = this.handleRefreshBtn.bind(this);
  }

  handleChange(event, item) {
    const key = item.key;
    this.props.onUpdateSelectedKey(key);
  }

  handleRefreshBtn() {
    store.dataUsage.push()
        .then(result => {
            if (!result.success) {
                store.messages.add({
                    type: MessageBarType.error,
                    contents: `Failed to retrieve data usage: ${result.data.message}`
                });
            } 
            else {
              console.log('push success');
              global.store.set('dataUsage.unsynced.timerUsage', {
                screenTime: 0,
                timerCount: 0,
                usageDat: null,
              });
            }
        });
}

  render() {
    return (
      <Stack 
        tokens={{ childrenGap: 12 }} 
        styles={navStyles}>

        <Text variant={'xxLarge'}>
          <b>Statistics</b>
          <TooltipHost content="Refresh">
            <IconButton
                iconProps={{ iconName: 'Refresh' }}
                onClick={this.handleRefreshBtn}
            />
           </TooltipHost>
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
 
