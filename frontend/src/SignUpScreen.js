import React from "react";
import { Link } from "react-router-dom";
 
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { ActionButton, PrimaryButton } from '@fluentui/react/lib/Button';

const { ipcRenderer } = window.require('electron');

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px',
};

const columnProps = {
  tokens: { childrenGap: 15 }
};

export default class SignUpScreen extends React.Component {
  
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
          <b>Sign up</b>
        </Text>

        <form style={{marginTop: '10px'}}>

          <Stack {...columnProps}>

            <Stack style={{ width: 240 }}>
              <TextField label='Email' id='email'
                errorMessage={this.state.emailErrorMessage}
              />
              <TextField label="Password" type="password" id='password1'/>
              <TextField label='Confirm password' type='password' id='password2' 
                errorMessage={this.state.passwordErrorMessage}
              />
            </Stack>

            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 20 }}>
              <PrimaryButton 
                text="Sign up"
                onClick={() => {
                  let email = document.getElementById('email').value;
                  let pass1 = document.getElementById('password1').value;
                  let pass2 = document.getElementById('password2').value;

                  ipcRenderer.invoke('sign-up', email, pass1, pass2)
                    .then( result => {
                      
                      // If response indicates failure
                      this.setState({
                        passwordErrorMessage: result
                      });

                    });
                }}
              />

              <Link to="/signin">
                <ActionButton> Already have an account? </ActionButton>
              </Link>

            </Stack>

          </Stack>

        </form>
      </div>
    );
  }
}

