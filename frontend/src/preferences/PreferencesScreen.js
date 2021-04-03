import React from 'react';

import { Stack } from '@fluentui/react/lib/Stack';
import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';

import PreferencesSidebar from './PreferencesSidebar';
import YourAccounts from './YourAccounts'
import Notifications from './Notifications'
import Startup from './Startup'
import DataUsage from './DataUsage'
import About from './About'

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px',

  display: "grid"
};

const preferencePages = {
  your_accounts: <YourAccounts/>,
  notifications: <Notifications/>,
  startup: <Startup/>,
  data_usage: <DataUsage/>,
  about: <About/>
}

export default class PreferencesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedKey: 'your_accounts' };
  }

  render() {
    const selectedKey = this.state.selectedKey;
    let preferencesPage = preferencePages[selectedKey];
    
    return (
      <div style={divStyle}>

        <ScrollablePane style={{
          position: "absolute",
          top: "60px",
          left: "260px",
          paddingBottom: "260px",
          right: "40px"
        }}>

          {preferencesPage}

        </ScrollablePane>
                
        <PreferencesSidebar
          selectedKey={selectedKey} 
          onUpdateSelectedKey={(key) => {
            this.setState({ selectedKey: key });
          }}
        />

      </div>
    );
  }
}

