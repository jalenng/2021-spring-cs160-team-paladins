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
} from '@fluentui/react';

import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appDropdownSelection: null,
            blockers: store.preferences.getAll().blockers
        };
        this.handleAppDropdown = this.handleAppDropdown.bind(this);
        this.handleAppAdd = this.handleAppAdd.bind(this);
        this.handleAppDelete = this.handleAppDelete.bind(this);
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

    handleAppDropdown(value) {
        let state = this.state;
        state.appDropdownSelection = value;
        this.setState(state);
    };

    handleAppAdd() {
        if (this.state.appDropdownSelection === null) return 
        let appBlockers = this.state.blockers.apps;
        appBlockers.push(this.state.appDropdownSelection);
        store.preferences.set("blockers.apps", appBlockers);
    }

    handleAppDelete() {
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

                        <Dropdown label="Add an app"
                            styles={{ dropdown: { width: 300 } }}
                            options={openWindowsOptions}
                            selectedKey={this.state.appDropdownSelection}
                            placeholder='Select an app'
                            onChange={(event, option, index) => {
                                this.handleAppDropdown(openWindowsOptions[index].key)
                            }}
                        />

                        <DefaultButton
                            text='Add'
                            onClick={this.handleAppAdd}
                        />

                    </Stack>

                    {/* Manage existing app blockers */}
                    <ActionButton
                        iconProps={{ iconName: 'Delete' }}
                        text='Delete'
                        onClick={this.handleAppDelete}
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