import React from 'react';

import { Dialog } from '@fluentui/react/lib/Dialog';
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const { deleteAccount } = require('../storeHelperFunctions');

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

    handleSubmit(event) {
        event.preventDefault();

        // Start spinner
        let state = this.state;
        state.isLoading = true;
        this.setState(state);

        // Get passwords from TextField
        let password = state.inputs.password;

        // Delete account
        deleteAccount(password)
            .then(result => {
                console.log(result);
                // If deletion was successful, close the window
                if (result.success) window.close()

                // Else, update state
                else {  
                    let data = result.data;
                    let state = this.state;
                    state.isLoading = false;    // Stop spinner

                    state.errors.password = data.message;

                    this.setState(state);
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
                                text='Delete account'
                                type='submit'
                                onClick={this.handleSubmit}
                            />
                        </Stack>
                        
                    </Stack>
                </form>
                
                {/* Spinner that shows when loading */}
                <Dialog hidden={!this.state.isLoading}>
                    <Spinner label='Deleting your account' size={SpinnerSize.large} />
                </Dialog>

            </div>
        );
    }
}