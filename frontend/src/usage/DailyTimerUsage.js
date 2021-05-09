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

    this.usage = new Usage();
    this.fetched = this.usage.getUsage(this.usage.state.fetched.timerUsage, this.usage.todayFormatted);
    if (this.fetched != null) {
      this.state.screenTime += this.fetched.screenTime;
      this.state.timerCount += this.fetched.timerCount;
    }
  }

  render() {
    return (
      <div style={{alignItems: 'center', verticalAlign: 'center'}}>
        <Text variant={"xxLarge"} style={{ fontSize: "3rem"}} block>
          Smart Screen Usage : 
            <span style={{color: 'green'}}> {this.state.screenTime} seconds</span> 
        </Text>
        
        <Text variant={"xxLarge"} style={{ fontSize: "3rem" }} block>
          You've taken 
          <span style={{color: 'green'}}> {this.state.timerCount} </span> 
          breaks today
        </Text>
      </div>
    );
  }
}
