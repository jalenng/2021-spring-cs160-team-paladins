import React from "react";
 
import Timer from "./Timer.js";

import { Text } from '@fluentui/react/lib/Text';

const homeStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '30px',
  paddingLeft: '50px',
  textAlign: 'center',
  // Align home screen in center of Electron window.
  position: 'absolute', left: '50%', top: '50%',
  transform: 'translate(-50%, -50%)'
};

const titleStyle = {
  color: 'white',
  marginBottom: '20px',
}

let Title = () => {
  return (
    <div style={titleStyle}>
      <Text variant={'xxLarge'} block>iCare</Text>
      <Text variant={'medium'} block>A Break Timer App for Productivity</Text>
    </div>
  )
};

export default class HomeScreen extends React.Component {

  render() {
    return (    
      <div style={homeStyle}>
        <Title />
        <Timer />
      </div>
    );
  }
}

