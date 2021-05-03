import React from 'react';

import { 
  ScrollablePane,
  Text
} from '@fluentui/react';

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
    this.state = { 
      isSignedIn: store.accounts.getAll().token !== null,
      selectedKey: 'app_usage' 
    };
  }

  componentDidMount() {
    store.accounts.eventSystem.on('changed', () => this.updateState())
  }

  updateState() {
    this.setState({
        ...this.state,
        isSignedIn: store.accounts.getAll().token !== null,
    });
  };

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
          {/* Show message if not signed in */}
          {!this.state.isSignedIn &&
            <Text>To view your usage statistics, please sign in. </Text>
          }

          {/* Show usage page if signed in */}
          {this.state.isSignedIn && 
            usagePage
          }

        </ScrollablePane>
                
        <UsageSidebar
          selectedKey={selectedKey} 
          onUpdateSelectedKey={(key) => {
            this.setState({...this.state, selectedKey: key });
          }}
        />

      </div>
    );
  }
}

