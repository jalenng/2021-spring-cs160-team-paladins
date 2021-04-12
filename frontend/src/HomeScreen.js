import React from "react";
 
import Timer from "./Timer.js";

import { Text } from '@fluentui/react/lib/Text';

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px',
  textAlign: 'center',
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

