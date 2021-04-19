import React from 'react';

import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';

import UsageSidebar from './charts/UsageSidebar';
import BarChart from './charts/BarChart';

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px',

  display: "grid"
};

const usagePages = {
  daily_usage: <BarChart/>,
  weekly_usage: <BarChart/>,
  monthly_usage: <BarChart/>,
  app_usage: <BarChart/>,
}

export default class UsageScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedKey: 'daily_usage' };
  }

  render() {
    const selectedKey = this.state.selectedKey;
    let usagePage = usagePages[selectedKey];
    
    return (
      <div style={divStyle}>

        <ScrollablePane style={{
          position: "absolute",
          top: "60px",
          left: "260px",
          paddingBottom: "260px",
          paddingRight: "40px"
        }}>

          {usagePage}

        </ScrollablePane>
                
        <UsageSidebar
          selectedKey={selectedKey} 
          onUpdateSelectedKey={(key) => {
            this.setState({ selectedKey: key });
          }}
        />

      </div>
    );
  }
}

