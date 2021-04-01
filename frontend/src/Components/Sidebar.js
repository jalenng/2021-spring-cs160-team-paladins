import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Text } from '@fluentui/react/lib/Text';
import { useHistory } from 'react-router-dom';

export default function Sidebar(){ 
    const history = useHistory();
    return(
      <div className = 'sidebar'>
      <Text variant={'xxLarge'} block>
        <b>Preferences</b>
      </Text>
      <div className = 'BtnGroup' >
      <ButtonGroup
      orientation="vertical"
      color="primary"
      aria-label="Button Group"
      variant="contained" 
    >
      <Button onClick={()=> history.push("/HomeScreen")}>Home</Button>
      <Button onClick={()=> history.push("/UserPreference")}>Account</Button>
      <Button onClick={()=> history.push("/Preference/Notification")}>Notification</Button>
      <Button onClick={()=> history.push("/Preference/DataUsage")}>Data Usage</Button>
      <Button onClick={()=> history.push("/Preference/About")}>About</Button>
      </ButtonGroup>
      </div>
    </div>
    );  
}


        

  