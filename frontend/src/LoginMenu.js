import React from "react";
import { Link } from "react-router-dom";
 
export default class LoginMenu extends React.Component {
  render() {
    return (
      <div>
        <Link to="/">Home</Link>
        <h3>Sign in</h3>
        <div>
            <form>
                <label>Username</label>
                <input type="text" name="username" />
                <label>Password</label>
                <input type="text" name="password" />
                <input type="submit" value="Submit" />
            </form>
        </div>
      </div>
    );
  }
}