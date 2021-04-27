import React from 'react';

import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';

import PreferencesSidebar from './PreferencesSidebar';
import YourAccounts from './YourAccounts'
import Notifications from './Notifications'
import Startup from './Startup'
import DataUsage from './DataUsage'
import Sync from './Sync'
import About from './About'

const divStyle = {
    paddingTop: '10px',
    paddingLeft: '30px',
    display: 'grid'
};

const preferencePages = {
    your_accounts: <YourAccounts />,
    notifications: <Notifications />,
    startup: <Startup />,
    data_usage: <DataUsage />,
    sync: <Sync />,
    about: <About />
}


export default class extends React.Component {

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
                    position: 'absolute',
                    top: '60px',
                    left: '260px',
                    paddingRight: '40px'
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

