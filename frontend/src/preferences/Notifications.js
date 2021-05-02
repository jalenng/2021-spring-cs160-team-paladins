import React from 'react';

import { 
    IconButton,
    Dropdown, DropdownMenuItemType,
    Slider,
    Stack,
    Text,
    Toggle,
    TooltipHost
} from '@fluentui/react';

import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps';

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

            <Stack id="notifications" {...level1Props}>

                <Stack {...level2Props}>
                    <Text variant={'xLarge'} block> Notifications </Text>

                    <Slider
                        label="Notification interval"
                        min={5} max={60} step={5}
                        showValue snapToStep
                        valueFormat={(number) => `${number} minutes`}
                        styles={{ root: { maxWidth: 300 } }}
                        value={this.state.notifications.interval}
                        onChange={number => store.preferences.set("notifications.interval", number)}
                    /> 

                    <Toggle
                        label="Enable sound notifications"
                        onText="On" offText="Off"
                        checked={this.state.notifications.enableSound}
                        onChange={(event, checked) => store.preferences.set("notifications.enableSound", checked)}
                    />

                    <Stack {...level2HorizontalProps} verticalAlign='end'>

                        <Dropdown label="Sound"
                            styles={{ dropdown: { width: 300 } }}
                            selectedKey={this.state.notifications.sound}
                            options={combinedSoundList}
                            onChange={(event, option, index) => {
                                store.preferences.set("notifications.sound", combinedSoundList[index].key)
                            }}
                        />

                        <TooltipHost content="Preview">
                            <IconButton
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

            </Stack>
        )
    }
}