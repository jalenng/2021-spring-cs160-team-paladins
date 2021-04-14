import React from 'react';

import { IconButton } from '@fluentui/react/lib/Button';
import { Dropdown, DropdownMenuItemType } from '@fluentui/react/lib/Dropdown';
import { Slider } from '@fluentui/react/lib/Slider';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';

const { ipcRenderer } = window.require('electron');

const {
    getAllPreferences,
    setPreference,
    getAllSounds, 
    addCustomSound
} = require('../storeHelperFunctions');


export default class Notifications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: getAllPreferences().notifications,
            sounds: getAllSounds()
        };
    };

    componentDidMount() {
        // Update this component's state when preferences are updated
        ipcRenderer.on('preferences-store-changed', () => {
            this.updateState();
        })

        ipcRenderer.on('sounds-store-changed', () => {
            this.updateState();
        })
    };

    updateState() {
        this.setState({
            notifications: getAllPreferences().notifications,
            sounds: getAllSounds()
        });
    };

    render() {

        let defaultSoundsHeader = [{ 
            key: 'defaultSoundsHeader', 
            text: 'Default', 
            itemType: DropdownMenuItemType.Header
        }];
        let customSoundsHeader = [{ 
            key: 'customSoundsHeader', 
            text: 'Custom', 
            itemType: DropdownMenuItemType.Header
        }];

        let divider = [{   
            key: 'div', 
            text: '-', 
            itemType: DropdownMenuItemType.Divider 
        }]

        let defaultSounds = this.state.sounds.defaultSounds;
        let customSounds = this.state.sounds.customSounds;
        
        let combinedSoundList = 
            defaultSoundsHeader
            .concat(defaultSounds)
            .concat(divider)
            .concat(customSoundsHeader)
            .concat(customSounds);
        
        return (

            <Stack id="notifications" tokens={{ childrenGap: 10 }}>

                <Text variant={'xLarge'} block> Notifications </Text>

                <Slider
                    label="Notification interval"
                    min={5} max={60} step={5}
                    showValue snapToStep
                    valueFormat={(number) => `${number} minutes`}
                    styles={{ root: { maxWidth: 300 } }}
                    value={this.state.notifications.interval}
                    onChange={number => setPreference("notifications.interval", number)}
                /> 

                <Toggle
                    label="Enable sound notifications"
                    onText="On" offText="Off"
                    checked={this.state.notifications.enableSound}
                    onChange={(event, checked) => setPreference("notifications.enableSound", checked)}
                />

                <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="end">

                    <Dropdown label="Sound"
                        styles={{ dropdown: { width: 300 } }}
                        selectedKey={this.state.notifications.sound}
                        options={combinedSoundList}
                        onChange={(event, option, index) => {
                            setPreference("notifications.sound", combinedSoundList[index].key)
                        }}
                    />

                    <TooltipHost content="Preview">
                        <IconButton
                            iconProps={{ iconName: 'Play' }}
                            onClick={() => {
                                ipcRenderer.invoke("play-sound", this.state.notifications.sound);
                            }}
                        />
                    </TooltipHost>

                    <TooltipHost content="Import">
                        <IconButton
                            iconProps={{ iconName: 'Add' }}
                            onClick={addCustomSound}
                        />
                    </TooltipHost>

                </Stack>

            </Stack>
        )
    }
}