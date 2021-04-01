import React from 'react';

import { Nav } from '@fluentui/react/lib/Nav';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Slider } from '@fluentui/react/lib/Slider';
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

  display: "grid"
};

const stackTokens = {
  sectionStack: {
    childrenGap: 16,
  },
  headingStack: {
    childrenGap: 8,
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

export default class UserPreference extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedKey: "your_accounts"
    };
  }

  render() {
    return (
      <div style={divStyle}>

        {/* Left nav sidebar */}
        <Stack tokens={{ childrenGap: 12 }} styles={navStyles}>

          <Text variant={'xxLarge'} block>
            <b>Preferences</b>
          </Text>

          <Nav
            selectedKey={this.state.selectedKey}
            groups={navLinkGroups}
            onLinkClick={(event, item) => {
              this.setState({ selectedKey: item.key })
            }}
          />

        </Stack>

        {/* Preferences */}
        <Stack
          style={{
            position: "absolute",
            left: "260px",
            right: "30px"
          }}
          tokens={stackTokens.sectionStack}
        >

          <Stack tokens={stackTokens.headingStack}>
            <Text variant={'xLarge'} block>
              <b>Your accounts</b>
            </Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            </Text>
          </Stack>

          <Stack tokens={stackTokens.headingStack}>
            <Text variant={'xLarge'} block>
              <b>Notifications</b>
            </Text>
            <Slider 
              label="Notification interval" 
              min={5} 
              max={60} 
              step={5} 
              defaultValue={20} 
              showValue snapToStep />
            <Toggle
              label="Enable sound notifications"
              defaultChecked
              onText="On" offText="Off"
            />
          </Stack>

          <Stack tokens={stackTokens.headingStack}>
            <Text variant={'xLarge'} block>
              <b>Data usage</b>
            </Text>
            <Toggle
              label="Track my application usage statistics"
              defaultChecked
              onText="On" offText="Off"
            />
            <Toggle
              label="Enable weekly usage statistics"
              defaultChecked
              onText="On" offText="Off"
            />
          </Stack>

          <Stack tokens={stackTokens.headingStack}>
            <Text variant={'xLarge'} block>
              <b>About</b>
            </Text>
            <Stack tokens={stackTokens.headingStack}>
              <Text variant={'large'} block>
                <b>Contributors</b>
              </Text>
              <Text variant={'large'} block>
                <b>Open-source libraries</b>
              </Text>
            </Stack>
          </Stack>

        </Stack>

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

