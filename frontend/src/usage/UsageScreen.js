import React from 'react';

import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';

import UsageSidebar from './UsageSidebar';
import DailyAppUsage from './DailyAppUsage';
import WeeklyAppUsage from './WeeklyAppUsage';
import DailyTimerUsage from './DailyTimerUsage'
import WeeklyTimerUsage from './WeeklyTimerUsage';


const divStyle = {
  paddingTop: '10px',
  paddingLeft: '30px',
  display: "grid"
};

const usagePages = {
  daily_app_usage: <DailyAppUsage/>,
  weekly_app_usage: <WeeklyAppUsage/>,
  daily_timer_usage: <DailyTimerUsage/>,
  weekly_timer_usage: <WeeklyTimerUsage/>,
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

