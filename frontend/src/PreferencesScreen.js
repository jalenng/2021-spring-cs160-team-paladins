import React from "react";
import UserPreference from './UserPreference'
// import Sidebar from './Components/Sidebar'
// import Toggle from './Components/Toggle'
// import Persona from './Components/Persona'

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px',
};


export default class PreferencesScreen extends React.Component {
  render() {
    return (    

      <div style={divStyle}>
        
        <UserPreference/>
        {/* <Persona />
        <Sidebar />
        <Toggle />
        <Persona /> */}
      </div>
    );
  }
}

