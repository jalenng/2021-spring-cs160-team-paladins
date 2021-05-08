import React from 'react';

import DialogSpinner from "../DialogSpinner";

import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';

const divStyle = {
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
                password: '',
            },
            errors: {
                password: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Handles changes to the TextFields by updating the state
    handleChange(event) {
        let state = this.state;
        state.inputs[event.target.id] = event.target.value
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

        // Get passwords from TextField
        let password = state.inputs.password;

        // Delete account
        store.accounts.delete(password)
            .then(result => {
                console.log(result);
                // If deletion was successful, close the window
                if (result.success) window.close()

                // Else, update state
                else {  
                    state.errors.password = result.data.message;
                    this.setState(state);
                    this.setSpinner(false);
                }
            });
    }

    render() {
        return (
            <div style={divStyle}>
                <Text variant={'xxLarge'} block>
                    <b>Delete account</b>
                </Text>

                <form>
                    <Stack
                        style={{ marginTop: '10px' }}
                        tokens={{ childrenGap: 15 }}>

                        <Stack style={{ width: 240 }}>
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
                                text='Delete account'
                                type='submit'
                                onClick={this.handleSubmit}
                            />
                        </Stack>
                        
                    </Stack>
                </form>
                
                <DialogSpinner
                    show={this.state.isLoading}
                    text='Deleting your account'
                />

            </div>
        );
    }
}