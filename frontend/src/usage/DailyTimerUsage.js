import React from "react";
import { Bar, defaults } from "react-chartjs-2"
import Usage from "./Usage.js"
import { Text } from '@fluentui/react/lib/Text';

defaults.global.tooltips.enabled = true;

export default class DailyTimerUsage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      screenTime: 0,
      timerCount: 0,
    }

    // Get fetched usage for todays date.
    this.usage = new Usage();
    this.fetched = this.usage.getUsage(this.usage.state.fetched.timerUsage, this.usage.todayFormatted);
    this.state.screenTime += this.fetched.screenTime;
    this.state.timerCount += this.fetched.timerCount;

    this.minutes = Math.floor(this.state.screenTime/60);
    this.seconds = this.state.screenTime%60;
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
          <span style={{color: 'green'}}> {this.state.timerCount} </span> 
          breaks today
        </Text>

      </div>
    );
  }
}
