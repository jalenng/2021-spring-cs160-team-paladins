import React from "react";

import { IconButton } from '@fluentui/react/lib/Button';
import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { ImageFit } from '@fluentui/react/lib/Image';
import { 
  DocumentCard, 
  DocumentCardImage,
  DocumentCardActions 
} from '@fluentui/react/lib/DocumentCard';


const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px'
};

const cardStyles = {
  root: { 
    display: 'inline-block',
    width: 300,
    marginRight: '16px',
    marginBottom: '16px'
  }
}

const cardStackStyle = {
  marginTop: "8px",
  marginLeft: "16px",
  marginRight: "16px",
  height: "auto"
}

const iconProps = {
  iconName: 'RedEye',
  styles: { root: { color: '#ffffff', fontSize: '96px', width: '96px', height: '96px' } },
};

export default class InsightsScreen extends React.Component {  

  render() {
    
    var card = (
      <DocumentCard styles={cardStyles} >

        {/* Card image */}
        <DocumentCardImage height={100} imageFit={ImageFit.cover} iconProps={iconProps} />

        {/* Card contents/stack */}
        <Stack style={cardStackStyle} tokens={{ childrenGap: 8 }}>

          <Text variant="large" block> 
            Insight card! 
          </Text>
          <Text block> 
            This is an insight card. Let's pretend that this card is saying something very, very insightful. So, so, so insightful. Wow, would you look at this insight! I love insights. 
          </Text>

        </Stack>

        {/* Card action buttons */}
        <DocumentCardActions actions={[
            {
              iconProps: { iconName: 'Cancel' },
              onClick: () => {alert('clicked')}
            }
          ]}/>

      </DocumentCard>
    );

    return (

      <div style={divStyle}>

        <Text variant={'xxLarge'} block>
          <b>Insights</b>
        </Text>

        <ScrollablePane style={{
          position: "absolute",
          top: "105px",
          left: "30px",
          paddingBottom: "260px",
          paddingRight: "40px"
        }}>

          {card}
          {card}
          {card}
          {card}
          {card}
          {card}
          {card}

        </ScrollablePane>

      </div>
        
    );
  }
}

