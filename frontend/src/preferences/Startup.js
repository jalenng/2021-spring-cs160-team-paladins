import React from 'react';

import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Toggle } from '@fluentui/react/lib/Toggle';

const { ipcRenderer } = window.require('electron');

const {
    getAllPreferences,
    setPreference,
} = require('../storeHelperFunctions');


export default class Startup extends React.Component {

    constructor(props) {
        super(props);
        this.state = getAllPreferences().startup;
    }

    componentDidMount() {
        // Update this component's state when preferences are updated
        ipcRenderer.on('preferences-store-changed', () => {
            this.updateState();
        })
    }

    updateState() {
        this.setState(getAllPreferences().startup);
    }

    render() {
        return (
            <Stack id="startup" tokens={{ childrenGap: 10 }}>

                <Text variant={'xLarge'} block> Startup </Text>

                <Toggle label="Start app on login"
                    onText="On" offText="Off"
                    checked={this.state.startAppOnLogin}
                    onChange={(event, checked) => setPreference("startup.startAppOnLogin", checked)}
                />
                <Toggle label="Start timer on app startup"
                    onText="On" offText="Off"
                    checked={this.state.startTimerOnAppStartup}
                    onChange={(event, checked) => {
                        setPreference("startup.startTimerOnAppStartup", checked);
                    }}
                />

            </Stack>
        )
    }
}