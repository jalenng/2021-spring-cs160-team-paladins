import React from 'react';
import { Link } from 'react-router-dom';
 
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { ActionButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const { ipcRenderer } = window.require('electron');

const divStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',

  paddingTop: '10px',
  paddingLeft: '30px',
};

const textFieldStyles = {
  // Make error message more legible over a dark background
  errorMessage: {color: '#F1707B'}
}

const columnProps = {
  tokens: { childrenGap: 15 },
};

export default class SignInScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      emailErrorMessage: '',
      passwordErrorMessage: ''
    }
  }

  render() {

    // Show spinner if signing in
    if (this.state.isLoading) {
      return (
        <div style={{
          position: 'absolute', 
          left: '50%', 
          top: '50%',
          transform: 'translate(-50%, -50%)'
          }}>
          <Spinner label="Signing you in." size={SpinnerSize.large}/>
        </div>
      )
    }

    // Otherwise, show normal sign-in menu
    return (    

      <div style={divStyle}>
        <Text variant={'xxLarge'} block>
          <b>Sign in</b>
        </Text>

        <form style={{marginTop: '10px'}}>

          <Stack {...columnProps}>

            <Stack style={{ width: 240 }}>
              <TextField label='Email' id='email'
                styles={textFieldStyles}
                errorMessage={this.state.emailErrorMessage}
              />
              <TextField label='Password' 
                type='password' id='password' 
                styles={textFieldStyles}
                errorMessage={this.state.passwordErrorMessage}
              />
            </Stack>

            <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 20 }}>
              <PrimaryButton 
              text='Sign in'
              type='submit'
              onClick={() => {

                this.setState({
                  isLoading: true,
                  passwordErrorMessage: ''
                });  

                // Get email and password from TextFields
                let email = document.getElementById('email').value;
                let pass = document.getElementById('password').value;

                // Invoke main process to handle sign-in
                ipcRenderer.invoke('sign-in', email, pass)
                  .then( result => {

                    // If sign-in was successful, close the window
                    if (result.success) window.close()

                    // Else, display error
                    else {
                      this.setState({
                        isLoading: false,
                        passwordErrorMessage: result.message
                      });  
                    }
                    
                  });
              }}
              />
              <Link to='/signup'>
                <ActionButton> Don't have an account? </ActionButton>
              </Link>
              
            </Stack>

          </Stack>

        </form>
      </div>
    );
  }
}