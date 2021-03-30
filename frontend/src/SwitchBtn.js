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

// import React, { Component } from "react";
// import Switch from "react-switch";

// const textSwitch = {
//   display: "flex",
//   justifyContent:"center",
//   alignItems:"center",
//   height:"100%",
//   fontsize:15,
//   color:"#fff",
//   paddingRight:2
// }

// export default class ToggleBtn extends Component {
//   constructor() {
//     super();
//     this.state = { checked: false };
//     this.handleChange = this.handleChange.bind(this);
//   }

//   handleChange(checked) {
//     this.setState({ checked });
//   }

//   render() {
//     return (
//       <div>
//         <Switch 
//           className = "togglebtn1"
//           handleDiameter={15}
//           height={20}
//           weight={15}
//           onChange={this.handleChange} 
//           checked={this.state.checked} 
//           checkedIcon={
//             <div style={textSwitch}>on</div>
//           }
//           uncheckedIcon={
//             <div style={textSwitch}>off</div>
//           }
//         />
//       </div>
//     );
//   }
// }
