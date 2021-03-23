import React from "react";
import { Link } from "react-router-dom";
 
export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to iCare</h1>
        <Link to="/LoginMenu">Login</Link>
      </div>
    );
  }
}