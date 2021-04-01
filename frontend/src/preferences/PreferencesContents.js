import React from 'react';

import { Dropdown } from '@fluentui/react/lib/Dropdown'
import { DefaultButton, ActionButton } from '@fluentui/react/lib/Button';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';
import { Slider } from '@fluentui/react/lib/Slider';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

const stackTokens = {
  sectionStack: {
    childrenGap: 32,
  },
  headingStack: {
    childrenGap: 10,
  },
};

const yourAccountsPersona = {
  imageInitials: 'IC',
  text: 'iCare user',
  onRenderSecondaryText: () => {
    return (
      <Stack horizontal 
        verticalAlign="center" 
        style={{ marginTop: "6px" }}
        tokens={{ childrenGap: 20 }}
      >
        
        <DefaultButton text="Sign out"/>    
        <ActionButton>
          Delete account
        </ActionButton>  
        
      </Stack>  
    )
  }
};


export default class PreferencesContents extends React.Component {

  render() {
    return (
      <ScrollablePane
        style={{ top: '60px' }}
      >

        <Stack
          style={{
            position: "absolute",
            left: "260px",
            paddingBottom: "260px",
            right: "40px"
          }}
          tokens={stackTokens.sectionStack}
        >

          {/* Your accounts */}
          <Stack 
            id="your_accounts" 
            tokens={stackTokens.headingStack}
          >
            <Text variant={'xLarge'} block>
              <b>Your accounts</b>
            </Text>
            <Persona
              {...yourAccountsPersona}
              size={PersonaSize.size100}
              imageAlt="Annie Lindqvist, status is away"
            />
          </Stack>

          {/* Notifications */}
          <Stack 
            tokens={stackTokens.headingStack}
            id="notifications" 
          >
            <Text variant={'xLarge'} block>
              <b>Notifications</b>
            </Text>
            <Slider
              label="Notification interval"
              min={5}
              max={60}
              step={5}
              defaultValue={20}
              valueFormat={(number) => `${number} minutes`}
              showValue snapToStep />
            <Toggle
              label="Enable sound notifications"
              defaultChecked
              onText="On" offText="Off"
            />
            <Dropdown 
              label="Sound"
              options={[
                { key: '1', text: 'Sound 1' },
                { key: '2', text: 'Sound 2' },
                { key: '3', text: 'Sound 3' },
              ]}
            />
          </Stack>

          {/* Startup */}
          <Stack 
            id="startup" 
            tokens={stackTokens.headingStack}
          >
            <Text variant={'xLarge'} block>
              <b>Startup</b>
            </Text>
            <Toggle
              label="Start app on login"
              defaultChecked
              onText="On" offText="Off"
            />
            <Toggle
              label="Start timer on app startup"
              defaultChecked
              onText="On" offText="Off"
            />
          </Stack>

          {/* Data Usage */}
          <Stack 
            id="data_usage" 
            tokens={stackTokens.headingStack}
          >
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

          {/* About */}
          <Stack 
            id="about" 
            tokens={stackTokens.headingStack}
          >
            <Text variant={'xLarge'} block>
              <b>About</b>
            </Text>
            <Stack tokens={stackTokens.headingStack}>
              <Text variant={'large'} block>
                Contributors
              </Text>
              <Text variant={'large'} block>
                Open-source libraries
              </Text>
            </Stack>
          </Stack>

        </Stack>

      </ScrollablePane>

    )
  }
}