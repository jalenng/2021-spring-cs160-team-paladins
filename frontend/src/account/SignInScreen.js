import React from 'react';
import { Link } from 'react-router-dom';

import { Dialog } from '@fluentui/react/lib/Dialog';
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { ActionButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

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
                password: ''
            },
            errors: {
                email: '',
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
    }

    // Change spinner status
    setSpinner(isLoading) {
        let state = this.state;
        state.isLoading = isLoading;
        this.setState(state);
    }

    // Handles a submit
    handleSubmit(event) {
        event.preventDefault();
        this.setSpinner(true);
        let state = this.state;
        
        // Authenticate user with sign-in
        let email = state.inputs.email;
        let password = state.inputs.password;

        store.accounts.signIn(email, password)
            .then(result => {

                // If sign-in was successful, close the window
                if (result.success) window.close()
                
                else {
                    state.errors.password = result.data.message;   // Update error message
                    this.setState(state);
                    this.setSpinner(false);
                }

            });
    }

    render() {
        return (
            <div style={divStyle}>
                <Text variant={'xxLarge'} block>
                    <b>Sign in</b>
                </Text>

                <form>
                    <Stack 
                        style={{ marginTop: '10px' }}
                        tokens={{ childrenGap: 15 }}>

                        <Stack style={{ width: 240 }}>
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
                                errorMessage={this.state.errors.password}
                            />
                        </Stack>

                        <Stack 
                            horizontal 
                            verticalAlign='center' 
                            tokens={{ childrenGap: 20 }}>

                            <PrimaryButton
                                id='submitButton'
                                text='Sign in'
                                type='submit'
                                onClick={this.handleSubmit}
                            />

                            <Link to='/signup'>
                                <ActionButton text="Don't have an account?"/>
                            </Link>

                        </Stack>

                    </Stack>
                </form>

                {/* Spinner that shows when loading */}
                <Dialog hidden={!this.state.isLoading}>
                    <Spinner 
                    label='Signing you in' size={SpinnerSize.large} />
                </Dialog>

            </div>
        );
    }
}