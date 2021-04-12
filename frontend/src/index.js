import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

import App from './App';

import SignInScreen from './account/SignInScreen';
import SignUpScreen from './account/SignUpScreen';
import DeleteAccountScreen from './account/DeleteAccountScreen';
import EditAccountScreen from './account/EditAccountScreen';

import FullscreenNotification from './notifications/FullscreenNotification';
import PopupNotification from './notifications/PopupNotification';

import { HashRouter, Route, Switch } from "react-router-dom";
import { loadTheme } from '@fluentui/react'
import { createTheme } from '@fluentui/theme/lib/createTheme'
import { initializeIcons } from '@fluentui/react/lib/Icons';

const myTheme = createTheme({
  palette: {
    themePrimary: '#309fff',
    themeLighterAlt: '#02060a',
    themeLighter: '#081929',
    themeLight: '#0f304d',
    themeTertiary: '#1d5f99',
    themeSecondary: '#2b8ce0',
    themeDarkAlt: '#45a8ff',
    themeDark: '#62b6ff',
    themeDarker: '#8bc9ff',
    neutralLighterAlt: '#3c3c3c',
    neutralLighter: '#444444',
    neutralLight: '#515151',
    neutralQuaternaryAlt: '#595959',
    neutralQuaternary: '#5f5f5f',
    neutralTertiaryAlt: '#7a7a7a',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#1b1a19',
  }
});

document.body.style = 'background: #222222;';

loadTheme(myTheme);
initializeIcons();


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <div className="App">
          <Route path="/" exact component={App} />
          <Route path="/signin" exact component={SignInScreen} />
          <Route path="/signup" exact component={SignUpScreen} />
          <Route path="/deleteAccount" exact component={DeleteAccountScreen} />
          <Route path="/editAccount" exact component={EditAccountScreen} />

          <Route path="/fullscreenNotification" exact component={FullscreenNotification} />
          <Route path="/popupNotification" exact component={PopupNotification} />
        </div>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

