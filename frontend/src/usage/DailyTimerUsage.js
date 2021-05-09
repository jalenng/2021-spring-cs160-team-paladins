import React from "react";
import { Bar, defaults } from "react-chartjs-2"
import Usage from "./Usage.js"
import { Text } from '@fluentui/react/lib/Text';

defaults.global.tooltips.enabled = true;

export default class DailyTimerUsage extends React.Component {

  constructor(props) {
    super(props);
    let usage = new Usage();
    this.fetched = usage.getUsage(usage.state.fetched.timerUsage, usage.todayFormatted);

    this.screenTime = 0;
    this.timerCount = 0;
    if (this.fetched != null) {
      this.screenTime += this.fetched.screenTime;
      this.timerCount += this.fetched.timerCount;
    }
  }

  render() {
    return (
      <div style={{alignItems: 'center', verticalAlign: 'center'}}>
        <Text variant={"xxLarge"} style={{ fontSize: "3rem"}} block>
          Smart Screen Usage : 
            <span style={{color: 'green'}}> {this.screenTime} seconds</span> 
        </Text>
        
        <Text variant={"xxLarge"} style={{ fontSize: "3rem" }} block>
          You've taken 
          <span style={{color: 'green'}}> {this.timerCount} </span> 
          breaks today
        </Text>
      </div>
    );
  }
}
