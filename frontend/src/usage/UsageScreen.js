import React from 'react';

import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';

import UsageSidebar from './UsageSidebar';
import AppUsage from './AppUsage';
import DailyUsage from './DailyUsage'
import WeeklyUsage from './WeeklyUsage';
import TotalUsage from './TotalUsage';


const divStyle = {
  paddingTop: '10px',
  paddingLeft: '30px',
  display: "grid"
};

const usagePages = {
  app_usage: <AppUsage/>,
  daily_usage: <DailyUsage/>,
  weekly_usage: <WeeklyUsage/>,
  total_usage: <TotalUsage/>,
}

export default class UsageScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedKey: 'app_usage' };
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

