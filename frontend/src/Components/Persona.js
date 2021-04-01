import React from 'react';
import {Persona, PersonaSize} from '@fluentui/react/lib'
import '../App.css';

export default class Preference extends React.Component{
  constructor(props){
    super(props);
    this.state = { ownTime: '' };
  }
 
  handleChange = event => {
    this.setState({ ownTime: event.target.value });
  };

  handleClick = () =>{
    console.log(this.state);
  }

  handleSubmit = event =>{
    event.preventDefault();
  }

  render(){
    return(
      <div>
        <div className = 'account'>
          <text>Your Account</text>
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
          <form onSubmit={this.handleSubmit}>
          <label htmlFor="ownTime">Customize own break time: </label><br></br>
            <input
              type="text"
              name="ownTime"
              value={this.state.ownTime}
              onChange={this.handleChange}
          />
          </form><br></br>
          <button onClick={this.handleClick}>Save</button>
        </div>
      </div>
    );
  } 
}