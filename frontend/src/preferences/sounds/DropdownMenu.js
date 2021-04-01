import React from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const soundOptions = [
  { label: "sound1", value: 1 },
  { label: "sound2", value: 2 },
  { label: "sound3", value: 3 },
];

const fontColor = {
  color: "white"
}


export default class DropdownMenu extends React.Component {
  render() {
    return (
        <div className='dropdownMenu'>
            <label style={fontColor}>Select the sound notification</label>
            <div className="col-md-10">
                <Select options={soundOptions}  /><br />
            </div>
        </div>  
    );
  }
}
