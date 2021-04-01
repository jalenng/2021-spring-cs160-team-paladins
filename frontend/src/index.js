import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

import LoginMenu from './LoginMenu';
import UserPreference from './UserPreference';
import About from './Preference/About';
import DataUsage from './Preference/DataUsage';
import Notification from './Preference/Notification';

import App from './App';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

import { BrowserRouter, Route } from "react-router-dom";
import { loadTheme } from '@fluentui/react'
import { createTheme } from '@fluentui/theme/lib/createTheme'
import { initializeIcons } from '@fluentui/react/lib/Icons';
import HomeScreen from './HomeScreen';

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
    white: '#333333',
  }
});

document.body.style = 'background: #333333;';

loadTheme(myTheme);
initializeIcons();


ReactDOM.render(
  <React.StrictMode>
     <BrowserRouter>
        <div className="App">
          <Route path="/" exact component={App} />
          <Route path="/LoginMenu" exact component={LoginMenu} />
          <Route path="/signin" exact component={SignInScreen} />
          <Route path="/signup" exact component={SignUpScreen} />
          <Route path="/UserPreference" exact component={UserPreference} />
          <Route path="/Preference/Notification" exact component={Notification} />
          <Route path="/Preference/DataUsage" exact component={DataUsage} />
          <Route path="/Preference/About" exact component={About} />
          <Route path="/HomeScreen" exact component={HomeScreen} />
        </div>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

