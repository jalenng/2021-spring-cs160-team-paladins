import React from "react";
import { Link } from "react-router-dom";
 
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { ActionButton, PrimaryButton } from '@fluentui/react/lib/Button';

const divStyle = {
  paddingTop: '10px',
  paddingLeft: '30px',
};

const columnProps = {
  tokens: { childrenGap: 15 },
};

export default class SignInScreen extends React.Component {
  render() {
    return (    

      <div style={divStyle}>
        <Text variant={'xxLarge'} block>
          <b>Sign in</b>
        </Text>

        <form style={{marginTop: '10px'}}>

          <Stack {...columnProps}>

            <Stack style={{ width: 240 }}>
              <TextField label="Email"/>
              <TextField label="Password" type="password" />
            </Stack>

            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 20 }}>
              <PrimaryButton text="Sign in"/>

              <Link to="/signup">
                <ActionButton> Don't have an account? </ActionButton>
              </Link>
              
            </Stack>

          </Stack>

        </form>
      </div>
    );
  }
}

