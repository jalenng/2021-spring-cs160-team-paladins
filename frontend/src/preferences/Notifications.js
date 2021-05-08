import React from 'react';

import { IconButton } from '@fluentui/react/lib/Button';
import { Dropdown, DropdownMenuItemType } from '@fluentui/react/lib/Dropdown';
import { Slider } from '@fluentui/react/lib/Slider';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: store.preferences.getAll().notifications,
            sounds: store.sounds.getAll()
        };
    };

    componentDidMount() {
        // Update this component's state when preferences are updated
        store.preferences.eventSystem.on('changed', () => {
            this.updateState();
        })

        store.sounds.eventSystem.on('changed', () => {
            this.updateState();
        })
    };

    updateState() {
        this.setState({
            notifications: store.preferences.getAll().notifications,
            sounds: store.sounds.getAll()
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

            <Stack id="notifications" tokens={{ childrenGap: 10 }} style={{ paddingBottom: '20px' }}>

                <Text variant={'xLarge'} block> Notifications </Text>

                <Slider
                    id="notifSlider"
                    label="Notification interval"
                    min={5} max={60} step={5}
                    showValue snapToStep
                    valueFormat={(number) => `${number} minutes`}
                    styles={{ root: { maxWidth: 300 } }}
                    value={this.state.notifications.interval}
                    onChange={number => store.preferences.set("notifications.interval", number)}
                /> 

                <Toggle
                    id="soundNotifsToggle"
                    label="Enable sound notifications"
                    onText="On" offText="Off"
                    checked={this.state.notifications.enableSound}
                    onChange={(event, checked) => store.preferences.set("notifications.enableSound", checked)}
                />

                <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="end">

                    <Dropdown label="Sound"
                        id="soundDropdown"
                        styles={{ dropdown: { width: 300 } }}
                        selectedKey={this.state.notifications.sound}
                        options={combinedSoundList}
                        onChange={(event, option, index) => {
                            store.preferences.set("notifications.sound", combinedSoundList[index].key)
                        }}
                    />

                    <TooltipHost content="Preview">
                        <IconButton
                            id='playSoundBtn'
                            iconProps={{ iconName: 'Play' }}
                            onClick={ playSound }
                        />
                    </TooltipHost>

                    <TooltipHost content="Import">
                        <IconButton
                            iconProps={{ iconName: 'Add' }}
                            onClick={store.sounds.add}
                        />
                    </TooltipHost>

                </Stack>

            </Stack>
        )
    }
}