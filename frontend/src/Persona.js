import React from 'react';
import {Persona, PersonaSize, Stack} from '@fluentui/react/lib'
import './App.css';
import { Button } from '@material-ui/core';

export default class Preference extends React.Component{
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
              <text>Diana Young</text>
            </div>
            <div className = 'signoutBtn'>
              <Button color='primary'>Sign Out</Button>
            </div>
          </div>
        );
    }
}