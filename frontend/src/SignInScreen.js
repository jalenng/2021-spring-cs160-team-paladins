import React from 'react';
import { Link } from 'react-router-dom';
 
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { ActionButton, PrimaryButton } from '@fluentui/react/lib/Button';
const { ipcRenderer } = window.require('electron');

const divStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',

  paddingTop: '10px',
  paddingLeft: '30px',
};

const columnProps = {
  tokens: { childrenGap: 15 },
};

export default class SignInScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      emailErrorMessage: "",
      passwordErrorMessage: ""
    }
  }

  render() {
    return (    

      <div style={divStyle}>
        <Text variant={'xxLarge'} block>
          <b>Sign in</b>
        </Text>

        <form style={{marginTop: '10px'}}>

          <Stack {...columnProps}>

            <Stack style={{ width: 240 }}>
              <TextField label='Email' type='email' id='email'
                errorMessage={this.state.emailErrorMessage}
              />
              <TextField label='Password' type='password' id='password' 
                errorMessage={this.state.passwordErrorMessage}
              />
            </Stack>

            <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 20 }}>
              <PrimaryButton 
              text='Sign in'
              onClick={() => {
                let email = document.getElementById('email').value;
                let pass = document.getElementById('password').value;

                ipcRenderer.invoke('sign-in', email, pass)
                  .then( result => {

                    console.log(result)
                    // If response indicates failure
                    this.setState({
                      passwordErrorMessage: result
                    });
                    
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

