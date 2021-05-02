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

        // Map the list of objects about each window to a list of selectable options...
        let openWindowsOptions = getOpenWindows().map(process => {
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

        let appBlockersColumns = [{ key: '1', name: 'Name', fieldName: 'name', isResizable: false }];

        let appBlockers = this.state.blockers.apps.map( path => {
            console.log(path)
            return {
                key: path,
                name: path,
            }
        });

        return (

            <Stack id="blockers" {...level1Props}>

                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> App blockers </Text>

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