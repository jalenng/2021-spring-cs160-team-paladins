import React from "react";

import UserPreference from './UserPreference'
import { Text } from '@fluentui/react/lib/Text';

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

      </div>
    );
  }
}

