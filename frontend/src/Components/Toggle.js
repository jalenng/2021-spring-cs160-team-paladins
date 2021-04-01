import React from 'react';
import {FormControl,FormGroup,FormControlLabel,Switch} from '@material-ui/core';
import '../App.css';

export default function SwitchesGroup() {
  const [state, setState] = React.useState({
    appStartup: false,
    timerStartup: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div className ='toggleBtn'>
      <FormControl component="fieldset">
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={state.appStartup} onChange={handleChange} name="appStartup" color='primary'/>}
          label="Run app on system startup"
        />
        <FormControlLabel
          control={<Switch checked={state.timerStartup} onChange={handleChange} name="timerStartup" color='primary'/>}
          label="Start timer on app startup"
        />
      </FormGroup>
    </FormControl>
    </div>
  );
}


