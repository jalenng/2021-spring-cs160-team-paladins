import React from 'react';

import {
    IconButton, 
    Dropdown, 
    DropdownMenuItemType, 
    Stack, 
    Text, 
    Toggle, 
    TooltipHost 
} from '@fluentui/react/lib';

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

            <Stack id="blockers" tokens={{ childrenGap: 24 }} style={{ paddingBottom: '20px' }}>

                <Stack tokens={{ childrenGap: 8 }}>

                    <Text variant={'xLarge'} block> App blockers </Text>

                    <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="end">

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
                                onClick={playSound}
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

                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'xLarge'} block> Other blockers </Text>

                    <Toggle
                        label="Block timer when battery is below 20%"
                        onText="On" offText="Off"
                        checked={this.state.notifications.enableSound}
                        onChange={(event, checked) => store.preferences.set("notifications.enableSound", checked)}
                    />
                </Stack>

            </Stack>
        )
    }
}