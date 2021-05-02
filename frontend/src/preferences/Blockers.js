import React from 'react';

import {
    DetailsList,
    Dropdown,  
    Stack, 
    Text, 
    Toggle
} from '@fluentui/react/lib';

import { level1Props, level2Props } from './PrefsStackProps';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.preferences.getAll().blockers;
    };

    componentDidMount() {
        // Update this component's state when preferences are updated
        store.preferences.eventSystem.on('changed', () => this.updateState())
    };

    updateState() {
        this.setState(store.preferences.getAll().blockers);
    };

    render() {

        // Map the list of objects about each window to a list of selectable options...
        let openWindowsOptions = getOpenWindows().map( process => {
            return {
                key: process.path, 
                text: process.name, 
            }
        })
        // ...then sort the list alphabetically.
        .sort((a, b) => {
            var textA = a.text.toUpperCase();
            var textB = b.text.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        
        let appBlockersListColumns = [
            { key: '1', name: 'Name', fieldName: 'name', isResizable: false },
        ];

        let appBlockers = [
            {
                key: 1,
                name: 'Item 1'
            },
            {
                key: 2,
                name: 'Item 2'
            }
        ]


        return (

            <Stack id="blockers" {...level1Props}>

                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> App blockers </Text>

                    <Dropdown label="Add an app blocker"
                        styles={{ dropdown: { width: 300 } }}
                        options={openWindowsOptions}
                        selectedKey={null}
                        placeholder='Select an app'
                        onChange={(event, option, index) => {
                            // store.preferences.set("notifications.sound", combinedSoundList[index].key)
                        }}
                    />

                    <DetailsList
                        compact={true}
                        items={appBlockers}
                        columns={appBlockersListColumns}
                        selectionPreservedOnEmptyClick={true}
                        onItemInvoked={this._onItemInvoked}
                    />

                </Stack>

                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> Other blockers </Text>

                    <Toggle
                        label="Block timer when battery is below 20%"
                        onText="On" offText="Off"
                        checked={this.state.blockOnLowBattery}
                        onChange={(event, checked) => store.preferences.set("blockers.blockOnLowBattery", checked)}
                    />

                </Stack>

            </Stack>
        )
    }
}