import React from 'react';
import {Persona, PersonaSize} from '@fluentui/react/lib'
import { Text } from '@fluentui/react/lib/Text';
import Sidebar from './Sidebar';
import '../App.css';

export default class Preference extends React.Component{
  constructor(props){
    super(props);
    this.state = { ownTime: '' };
  }
 
  handleChange = event => {
    this.setState({ ownTime: event.target.value });
  };

  render(){
    return(
      <div>
        <Sidebar />
        <div className = 'account'>
          <Text>Your Account</Text>
        </div>
        <div className ='persona'>
        <Persona 
        imageInitials = 'User'
        size={PersonaSize.size100}
        />
        </div>
        <div className = 'userName'>
          <label>Diana Young</label>
        </div>
        <div className = 'signoutBtn'>
          <button>Sign out</button>
        </div>
        <div className = 'customizedTime'>
          <form>
          <label htmlFor="ownTime">Customize own break time: </label><br></br>
            <input
              type="text"
              name="ownTime"
              value={this.state.ownTime}
              onChange={this.handleChange}
          />
          </form><br></br>
          <button>Save</button>
        </div>
      </div>
    );
  } 
}