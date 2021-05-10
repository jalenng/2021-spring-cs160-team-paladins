import React from "react";
import { Bar, defaults } from "react-chartjs-2"
import Usage from "./Usage.js"
import { Text } from '@fluentui/react/lib/Text';

defaults.global.tooltips.enabled = true;

export default class DailyTimerUsage extends React.Component {

  constructor(props) {
    super(props);
    this.state = store.dataUsage.getAll();

    var todaysDate = (this.getTodaysDate() + 'T00:00:00.000Z');
    this.todaysUsage = 0;
    var i, usageObj;
    var timerUsageList = this.state.fetched.timerUsage;
    for (i=0; i<timerUsageList.length; i++) {
      usageObj = timerUsageList[i];
      if (usageObj.usageDate === todaysDate) {
        this.todaysUsage = usageObj;
      }
    }
    this.minutes = Math.floor(this.todaysUsage.screenTime/60);
    this.seconds = Math.floor(this.todaysUsage.screenTime%60);
  }

  /**
  Gets todays date in format : YEAR-MONTH-DAY */
  getTodaysDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = ("00" + (today.getMonth() + 1)).substr(-2, 2);
    var day = ("00" + today.getDate()).substr(-2, 2);
    return  `${year}-${month}-${day}`;
  }

  render() {
    return (
      <div style={{alignItems: 'center', verticalAlign: 'center'}}>
        {/* Screen Usage Duration */}
        <Text variant={"xxLarge"} style={{ fontSize: "2rem"}} block>
          Smart Screen Usage : 
            <span style={{color: 'green'}}> {this.minutes} minutes {this.seconds} seconds</span> 
        </Text>
        {/*  Number of Breaks */}
        <Text variant={"xxLarge"} style={{ fontSize: "2rem" }} block>
          You've taken 
          <span style={{color: 'green'}}> {this.todaysUsage.timerCount} </span> 
          breaks today
        </Text>

      </div>
    );
  }
}
