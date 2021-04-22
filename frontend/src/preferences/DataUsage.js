import React from 'react';

import { Toggle } from '@fluentui/react/lib/Toggle';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.preferences.getAll().dataUsage;
    }

    componentDidMount() {
        // Update this component's state when preferences are updated
        store.preferences.eventSystem.on('changed', () => {
            this.updateState();
        })
    }

    updateState() {
        this.setState(store.preferences.getAll().dataUsage);
    }

    render() {

        return (

            <Stack id="data_usage" tokens={{ childrenGap: 10 }} style={{ paddingBottom: '20px' }}>

                <Text variant={'xLarge'} block> Data usage </Text>

                <Toggle label="Track my application usage statistics"
                    onText="On" offText="Off"
                    checked={this.state.trackAppUsageStats}
                    onChange={(event, checked) => store.preferences.set("dataUsage.trackAppUsageStats", checked)}
                />
                <Toggle label="Enable weekly usage statistics"
                    onText="On" offText="Off"
                    checked={this.state.enableWeeklyUsageStats}
                    onChange={(event, checked) => store.preferences.set("dataUsage.enableWeeklyUsageStats", checked)}
                />

            </Stack>

        )
    }
}