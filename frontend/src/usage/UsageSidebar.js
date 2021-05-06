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
    this.dataUsage = store.dataUsage.getAll();
  }

  handleChange(event, item) {
    const key = item.key;
    this.props.onUpdateSelectedKey(key);
  }

  handleRefreshBtn() {
    console.log(this.dataUsage);

    // Update data usage 
    store.dataUsage.push()
    .then(result => {
        if (!result.success) {
            store.messages.add({
                type: MessageBarType.error,
                contents: `Failed to update data usage: ${result.data.message}`
            });
        } 
        else {
          console.log(this.dataUsage.unsynced.timerUsage.screenTime);
          store.dataUsage.reset();
          let screenTime = store.dataUsage.getAll().unsynced.timerUsage.screenTime;
          console.log(screenTime);
        }
    })

    // Fetch the latest changes
    store.dataUsage.fetch()
    .then(result => {
        if (!result.success) {
            store.messages.add({
                type: MessageBarType.error,
                contents: `Failed to retrieve data usage: ${result.data.message}`
            });
        } 
        else {
          console.log('fetched');
          console.log(this.dataUsage.fetched.timerUsage);
        }
    })
  };


    // store.dataUsage.push()
    //     .then(result => {
    //         if (!result.success) {
    //             store.messages.add({
    //                 type: MessageBarType.error,
    //                 contents: `Failed to retrieve data usage: ${result.data.message}`
    //             });
    //         } 
    //         // If success, reset unsynced usage & update fetched usage.
    //         else if (result.success) {
    //           console.log('push success');
    //           global.store.set('dataUsage.unsynced.timerUsage', {
    //             screenTime: 0,
    //             numBreaks: 0,
    //             usageDate: '2021-05-03T07:00:00.000Z'
    //           });
            // store.dataUsage.fetch();
        //     }
        // });

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
 
