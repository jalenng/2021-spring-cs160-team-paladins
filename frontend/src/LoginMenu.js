import React from "react";
import { Link } from "react-router-dom";
const {ipcRenderer} = window.require('electron');

 
export default class LoginMenu extends React.Component {
  render() {
    return (
      <div>
        <Link to="/">Home</Link>
        <h3>Sign in</h3>
        <div>
            <form>
                <label>Username</label>
                <input type="text" name="username" id="user" />
                <label>Password</label>
                <input type="text" name="password" id="pass" />
                <input type="submit" value="Submit" 
                onClick={() => ipcRenderer.invoke('sign-in', document.getElementById("user").value, document.getElementById('pass').value)}  
                />
            </form> 
        </div>
      </div>
    );
  }
}