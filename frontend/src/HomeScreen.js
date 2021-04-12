import React from "react";
 
import Timer from "./Timer.js";

import { Text } from '@fluentui/react/lib/Text';

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '30px',
  paddingLeft: '50px',
  textAlign: 'center',
  alignItems: 'center',
};

export default class HomeScreen extends React.Component {
  render() {
    return (    
      <div style={divStyle}>
        <Timer />
      </div>
    );
  }
}

