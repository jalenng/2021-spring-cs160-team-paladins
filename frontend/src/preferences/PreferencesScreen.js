import React from 'react';

import PreferencesContents from './PreferencesContents';
import PreferencesSidebar from './PreferencesSidebar';

const divStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",

  paddingTop: '10px',
  paddingLeft: '30px',

  display: "grid"
};


export default class PreferencesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedKey: 'your_accounts' };
  }

  render() {
    const selectedKey = this.state.selectedKey;

    return (
      <div style={divStyle}>

        <PreferencesContents/>
        
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

