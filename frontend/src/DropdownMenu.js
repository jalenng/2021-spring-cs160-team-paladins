import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import 'bootstrap/dist/css/bootstrap.min.css';

//const animatedComponents = makeAnimated();

const soundOptions = [
  { label: "sound1", value: 1 },
  { label: "sound2", value: 2 },
  { label: "sound3", value: 3 },
];

export default class DropdownMenu extends React.Component {
  render() {
    return (
        <div>
            <label>Select the sound notification</label>
            <div className="col-md-10">
                <Select options={soundOptions}  />
            </div>
            <label>Select the sound notification from computer</label>
            <br></br>
        </div>  
    );
  }
}


// import React from "react";
// import Button from "@material-ui/core/Button";
// import Menu from "@material-ui/core/Menu";
// import MuiMenuItem from "@material-ui/core/MenuItem";
// import styled from "styled-components";

// const MenuItem = styled(MuiMenuItem)`
//   justify-content: flex-end;
// `;

// export default function SoundMenu() {
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleClick = event => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <Button
//         aria-controls="simple-menu"
//         aria-haspopup="true"
//         onClick={handleClick}
//       >
//         Choose the sound notification you like
//       </Button>
//       <Menu
//         id="soundMenu"
//         anchorEl={anchorEl}
//         keepMounted
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         getContentAnchorEl={null}
//         anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
//         transformOrigin={{vertical: 'top', horizontal: 'center'}}
//       >
//         <MenuItem onClick={handleClose}>1</MenuItem>
//         <MenuItem onClick={handleClose}>2</MenuItem>
//         <MenuItem onClick={handleClose}>3</MenuItem>
//       </Menu>
//     </div>
//   );
// }