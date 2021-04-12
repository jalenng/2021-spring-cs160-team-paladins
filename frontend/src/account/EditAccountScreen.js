import React from 'react';

import { Dialog } from '@fluentui/react/lib/Dialog';
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Separator } from '@fluentui/react/lib/Separator';

const { getAccountStore, updateAccountInfo } = require('../storeHelperFunctions');

const divStyle = {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',

    paddingTop: '10px',
    paddingLeft: '30px',
};

const textFieldStyles = {
    // Make error message more legible over a dark background
    errorMessage: { color: '#F1707B' }
}

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            inputs: {
                email: '',
                displayName: '',
                password: '',
            },
            errors: {
                email: '',
                displayName: '',
                password: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Load default values for inputs
    componentDidMount() {
        let accountInfo = getAccountStore().accountInfo;
        let state = this.state;
        let inputs = {
            email: accountInfo.email,
            displayName: accountInfo.displayName,
        }
        state.inputs = inputs;
        this.setState(state);
    }

    // Handles changes to the TextFields by updating the state
    handleChange(event) {
        let state = this.state;
        state.inputs[event.target.id] = event.target.value;
        this.setState(state);
    }

    // Change spinner status
    setSpinner(isLoading) {
        let state = this.state;
        state.isLoading = isLoading;
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setSpinner(true);
        let state = this.state;

        // Get email and passwords from TextFields
        let email = state.inputs.email;
        let displayName = state.inputs.displayName;
        let password = state.inputs.password;

        // Update user account info
        updateAccountInfo(email, displayName, password)
            .then(result => {

                // If sign-in was successful, close the window
                if (result.success) window.close()

                // Else, update state
                else {  
                    let data = result.data;

                    state.errors = {    // Update error messages
                        email: '',
                        displayName: '',
                        password: ''
                    }

                    switch (data.reason) {
                        case 'BAD_EMAIL':
                            state.errors.email = data.message;
                            break;
                        case 'BAD_DISPLAY_NAME':
                            state.errors.displayName = data.message;
                            break;
                        default:
                            state.errors.password = data.message;
                            break;
                    }

                    this.setState(state);

                    this.setSpinner(false);
                }

            });

    }

    render() {
        return (
            <div style={divStyle}>
                <Text variant={'xxLarge'} block>
                    <b>Edit account</b>
                </Text>

                <form>
                    <Stack
                        style={{ marginTop: '10px' }}
                        tokens={{ childrenGap: 15 }}>

                        <Stack style={{ width: 240 }}>
                            <TextField label='Name' id='displayName'
                                styles={textFieldStyles}
                                onChange={this.handleChange}
                                value={this.state.inputs.displayName}
                                errorMessage={this.state.errors.displayName}
                            />
                            <TextField label='Email' id='email'
                                styles={textFieldStyles}
                                value={this.state.inputs.email}
                                onChange={this.handleChange}
                                errorMessage={this.state.errors.email}
                            />

                            <Separator/>

                            <TextField label='Confirm password' type='password' id='password'
                                styles={textFieldStyles}
                                value={this.state.inputs.password}
                                onChange={this.handleChange}
                                errorMessage={this.state.errors.password}
                            />
                        </Stack>

                        <Stack 
                            horizontal 
                            verticalAlign='center' 
                            tokens={{ childrenGap: 20 }}>
                                
                            <PrimaryButton
                                text='Save'
                                type='submit'
                                onClick={this.handleSubmit}
                            />

                        </Stack>

                    </Stack>
                </form>
                
                {/* Spinner that shows when loading */}
                <Dialog hidden={!this.state.isLoading}>
                    <Spinner label='Saving your changes' size={SpinnerSize.large} />
                </Dialog>

            </div>
        );
    }
}