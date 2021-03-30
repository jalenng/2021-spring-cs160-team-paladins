import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function SwitchLabels() {
  const [state, setState] = React.useState({
    defaultSound: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={state.defaultSound}
            onChange={handleChange}
            name="defaultSound"
            color="primary"
          />
        }
        label="Default Sound Notification"
      />
    </FormGroup>
  );
}

