import React from 'react';

import {
    ActionButton,
    DefaultButton,
    DetailsList,
    Dropdown,
    Stack,
    Text,
    Toggle,
    Selection
} from '@fluentui/react/lib';

import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appDropdownSelection: null,
            blockers: store.preferences.getAll().blockers
        };
        this.handleAppBlockerDropdownChange = this.handleAppBlockerDropdownChange.bind(this);
        this.handleAddAppBlocker = this.handleAddAppBlocker.bind(this);
        this.addAppBlocker = this.handleAddAppBlocker.bind(this);
        this.handleDeleteAppBlocker = this.handleDeleteAppBlocker.bind(this);
        this.selection = new Selection();
    };

    componentDidMount() {
        // Update this component's state when preferences are updated
        store.preferences.eventSystem.on('changed', () => this.updateState())
    };

    updateState() {
        let state = this.state;
        state.blockers = store.preferences.getAll().blockers;
        this.setState(state);
    };

    handleAppBlockerDropdownChange(value) {
        let state = this.state;
        state.appDropdownSelection = value;
        this.setState(state);
    };

    handleAddAppBlocker() {
        if (this.state.appDropdownSelection === null) return 
        let appBlockers = this.state.blockers.apps;
        appBlockers.push(this.state.appDropdownSelection);
        store.preferences.set("blockers.apps", appBlockers);
    }

    handleDeleteAppBlocker() {
        let selectionKeys = this.selection.getSelection().map(selection => selection.key);
        let appBlockers = this.state.blockers.apps;
        appBlockers = appBlockers.filter(path => {
            return selectionKeys.indexOf(path) === -1
        })
        store.preferences.set("blockers.apps", appBlockers);
    }

    render() {

        const appNames = store.appNames.getAll();

        // Map the list of objects about each window to a list of selectable options...
        let openWindowsOptions = getOpenWindows().map(process => {
            return {
                key: process.path,
                text: appNames[process.path],
            }
        })
            // ...then sort the list alphabetically.
            .sort((a, b) => {
                var textA = a.text.toUpperCase();
                var textB = b.text.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

        let appBlockersColumns = [
            { key: '1', name: 'Name', fieldName: 'name', isResizable: true },
            { key: '2', name: 'Path', fieldName: 'key', isResizable: true }
        ];

        let appBlockers = this.state.blockers.apps.map( path => {
            console.log(path)
            return {
                key: path,
                name: appNames[path],
            }
        });

        return (

            <Stack id="blockers" {...level1Props}>

                {/* App blocker settings */}
                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> App blockers </Text>

                    {/* Add app blockers */}
                    <Stack {...level2HorizontalProps} verticalAlign='end'>

                        <Dropdown label="Add an app blocker"
                            styles={{ dropdown: { width: 300 } }}
                            options={openWindowsOptions}
                            selectedKey={this.state.appDropdownSelection}
                            placeholder='Select an app'
                            onChange={(event, option, index) => {
                                this.handleAppBlockerDropdownChange(openWindowsOptions[index].key)
                            }}
                        />

                        <DefaultButton
                            text='Add'
                            onClick={this.handleAddAppBlocker}
                        />

                    </Stack>

                    {/* Manage existing app blockers */}
                    <ActionButton
                        iconProps={{ iconName: 'Delete' }}
                        text='Delete'
                        onClick={this.handleDeleteAppBlocker}
                    />

                    <DetailsList
                        compact={true}
                        items={appBlockers}
                        columns={appBlockersColumns}
                        selectionPreservedOnEmptyClick={true}
                        selection={this.selection}
                    />

                </Stack>

                {/* Other blocker settings */}
                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> Other blockers </Text>

                    <Toggle
                        label="Block timer when on battery power"
                        onText="On" offText="Off"
                        checked={this.state.blockers.blockOnBattery}
                        onChange={(event, checked) => store.preferences.set("blockers.blockOnBattery", checked)}
                    />

                </Stack>

            </Stack>
        )
    }
}