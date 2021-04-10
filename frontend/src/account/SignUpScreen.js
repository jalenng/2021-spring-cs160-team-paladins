import React from 'react';
import { Link } from 'react-router-dom';

import { Dialog } from '@fluentui/react/lib/Dialog';
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { ActionButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const { signUp } = require('../storeHelperFunctions');

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
                confirm: ''
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

    // Handles changes to the TextFields by updating the state
    handleChange(event) {
        let state = this.state;
        state.inputs[event.target.id] = event.target.value;
        this.setState(state);
        this.verifyPasswords();
    }

    // Verify if passwords are the same
    verifyPasswords() {
        let state = this.state;

        // Show error if passwords do not match
        if (state.inputs.password != state.inputs.confirm
            && state.inputs.confirm.length != 0)
            state.errors.password = 'Passwords do not match';
        else
            state.errors.password = '';

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

        // If passwords do not match, don't continue with sign-up
        if (this.state.inputs.password != this.state.inputs.confirm)
            return;

        this.setSpinner(true);
        let state = this.state;
        
        // Get email and passwords from TextFields
        let email = state.inputs.email;
        let password = state.inputs.password;
        let displayName = state.inputs.displayName;

        // Authenticate user with sign-up
        signUp(email, password, displayName)
            .then(result => {

                // If sign-in was successful, close the window
                if (result.success) window.close()

                // Else, update state
                else {  
                    state.errors = {    // Update error messages
                        email: '',
                        displayName: '',
                        password: ''
                    }

                    switch (result.data.reason) {
                        case 'BAD_EMAIL':
                            state.errors.email = result.data.message;
                            break;
                        case 'BAD_DISPLAY_NAME':
                            state.errors.displayName = result.data.message;
                            break;
                        default:
                            state.errors.password = result.data.message;
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
                    <b>Sign up</b>
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
                            <TextField label='Password' type='password' id='password'
                                styles={textFieldStyles}
                                value={this.state.inputs.password}
                                onChange={this.handleChange}
                            />
                            <TextField label='Confirm password' type='password' id='confirm'
                                styles={textFieldStyles}
                                value={this.state.inputs.confirm}
                                onChange={this.handleChange}
                                errorMessage={this.state.errors.password}
                            />
                        </Stack>

                        <Stack 
                            horizontal 
                            verticalAlign='center' 
                            tokens={{ childrenGap: 20 }}>
                                
                            <PrimaryButton
                                text='Sign up'
                                type='submit'
                                onClick={this.handleSubmit}
                            />

                            <Link to='/signin'>
                                <ActionButton> Already have an account? </ActionButton>
                            </Link>

                        </Stack>

                    </Stack>
                </form>
                
                {/* Spinner that shows when loading */}
                <Dialog hidden={!this.state.isLoading}>
                    <Spinner label='Signing you up' size={SpinnerSize.large} />
                </Dialog>

            </div>
        );
    }
}