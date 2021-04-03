import React from 'react';

import { IconButton } from '@fluentui/react/lib/Button';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { Slider } from '@fluentui/react/lib/Slider';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Toggle } from '@fluentui/react/lib/Toggle';

const {
    getAllPreferences,
    setPreference,
    getAllSounds, 
    addCustomSound
} = require('../storeHelperFunctions');


export default class Notifications extends React.Component {

    render() {

        // Get preferences from preferences store
        const preferences = getAllPreferences();
        const notifications = preferences.notifications;

        // Get sounds from sounds store
        const sounds = getAllSounds();
        const defaultSounds = sounds.defaultSounds;
        const customSounds = sounds.customSounds;

        const combinedSoundList = defaultSounds.concat(customSounds);
        
        return (

            <Stack id="notifications" tokens={{ childrenGap: 10 }}>

                <Text variant={'xLarge'} block> Notifications </Text>

                <Slider
                    label="Notification interval"
                    min={5} max={60} step={5}
                    showValue snapToStep
                    valueFormat={(number) => `${number} minutes`}
                    styles={{ root: { maxWidth: 300 } }}
                    defaultValue={notifications.interval}
                    onChange={number => setPreference("notifications.interval", number)}
                />

                <Toggle
                    label="Enable sound notifications"
                    onText="On" offText="Off"
                    defaultChecked={notifications.enableSound}
                    onChange={(event, checked) => setPreference("notifications.enableSound", checked)}
                />

                <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="end">

                    <Dropdown label="Sound"
                        styles={{ dropdown: { width: 300 } }}
                        defaultSelectedKey={notifications.sound}
                        options={combinedSoundList}
                        onChange={(event, option, index) => {
                            setPreference("notifications.sound", combinedSoundList[index].key)
                        }}
                    />

                    <IconButton
                        iconProps={{ iconName: 'Add' }}
                        onClick={addCustomSound}
                    />

                </Stack>

            </Stack>

        )
    }
}