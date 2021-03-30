import React from "react";

import { mergeStyles } from '@fluentui/react/lib/Styling';
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator'
import { FontIcon } from '@fluentui/react/lib/Icon';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",
};

const iconClass = mergeStyles({
  fontSize: 128,
  height: 128,
  width: 128,
  margin: '0 25px',
  color: 'deepskyblue'
});

export default class FullscreenOverlay extends React.Component {

  render() {
    return (    
      <div style={divStyle}>
        
        <div style={{
          position: 'absolute', 
          left: '50%', 
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <Stack token={{childrenGap: 10}}>
            <Stack.Item align="center">
              <FontIcon iconName="RedEye" className={iconClass} />
            </Stack.Item>

            <Stack.Item align="center">
              <Text variant={"xxLarge"}>
                Look at something 20 feet away.
              </Text>
            </Stack.Item>
              
            <Stack.Item align="center">
              <Text variant={"xLarge"} align="center">
                15 more seconds.
              </Text>
            </Stack.Item>

            <Stack.Item align="center">
              <ProgressIndicator percentComplete={0.5} />
            </Stack.Item>

          </Stack>
          
        </div>

        <div style={{
          position: 'absolute', 
          left: '50%', 
          top: '90%',
          transform: 'translate(-50%, -50%)'
        }}>
          <Text variant={"large"} align="center">
            The countdown will reset upon keyboard or mouse input.
          </Text>          
        </div>
        
      </div>

    );
  }
}

