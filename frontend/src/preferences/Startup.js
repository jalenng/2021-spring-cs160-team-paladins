import React from 'react';

import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Toggle } from '@fluentui/react/lib/Toggle';

const {
    getAllPreferences,
    setPreference,
} = require('../storeHelperFunctions');


export default class Startup extends React.Component {

    render() {

        // Get preferences from preferences store
        const preferences = getAllPreferences();
        const startup = preferences.startup;
        
        return (

            <Stack id="startup" tokens={{ childrenGap: 10 }}>

                <Text variant={'xLarge'} block> Startup </Text>

                <Toggle label="Start app on login"
                    onText="On" offText="Off"
                    defaultChecked={startup.startAppOnLogin}
                    onChange={(event, checked) => setPreference("startup.startAppOnLogin", checked)}
                />
                <Toggle label="Start timer on app startup"
                    onText="On" offText="Off"
                    defaultChecked={startup.startTimerOnAppStartup}
                    onChange={(event, checked) => {
                        setPreference("startup.startTimerOnAppStartup", checked);
                    }}
                />

            </Stack>
            
        )
    }
}