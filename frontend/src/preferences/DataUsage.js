import React from 'react';

import { Toggle } from '@fluentui/react/lib/Toggle';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

const {
    getAllPreferences, 
    setPreference, 
} = require('../storeHelperFunctions');


export default class DataUsage extends React.Component {

    render() {

        // Get preferences from preferences store
        const preferences = getAllPreferences();
        const dataUsage = preferences.dataUsage;


        return (

            <Stack id="data_usage" tokens={{ childrenGap: 10 }}>

                <Text variant={'xLarge'} block> Data usage </Text>

                <Toggle label="Track my application usage statistics"
                    onText="On" offText="Off"
                    defaultChecked={dataUsage.trackAppUsageStats}
                    onChange={(event, checked) => setPreference("dataUsage.trackAppUsageStats", checked)}
                />
                <Toggle label="Enable weekly usage statistics"
                    onText="On" offText="Off"
                    defaultChecked={dataUsage.enableWeeklyUsageStats}
                    onChange={(event, checked) => setPreference("dataUsage.enableWeeklyUsageStats", checked)}
                />

            </Stack>

        )
    }
}