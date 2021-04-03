import React from 'react';

import { Toggle } from '@fluentui/react/lib/Toggle';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

const { ipcRenderer } = window.require('electron');

const {
    getAllPreferences, 
    setPreference, 
} = require('../storeHelperFunctions');


export default class DataUsage extends React.Component {

    constructor(props) {
        super(props);
        this.state = getAllPreferences().dataUsage;
    }

    componentDidMount() {
        // Update this component's state when preferences are updated
        ipcRenderer.on('preferences-store-changed', () => {
            this.updateState();
        })
    }

    updateState() {
        this.setState(getAllPreferences().dataUsage);
    }

    render() {

        return (

            <Stack id="data_usage" tokens={{ childrenGap: 10 }}>

                <Text variant={'xLarge'} block> Data usage </Text>

                <Toggle label="Track my application usage statistics"
                    onText="On" offText="Off"
                    checked={this.state.trackAppUsageStats}
                    onChange={(event, checked) => setPreference("dataUsage.trackAppUsageStats", checked)}
                />
                <Toggle label="Enable weekly usage statistics"
                    onText="On" offText="Off"
                    checked={this.state.enableWeeklyUsageStats}
                    onChange={(event, checked) => setPreference("dataUsage.enableWeeklyUsageStats", checked)}
                />

            </Stack>

        )
    }
}