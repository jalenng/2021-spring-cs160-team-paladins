import React from "react";
import { Bar, defaults } from "react-chartjs-2"
import Usage from "./Usage.js"

defaults.global.tooltips.enabled = true;

export default class DailyTimerUsage extends React.Component {

  constructor(props) {
    super(props);
    let usage = new Usage();
    this.fetched = usage.getUsage(usage.todayFormatted, usage.state.fetched.timerUsage);
    console.log(this.fetched);

    this.screenTime = 0;
    this.timerCount = 0;
    if (this.fetched != null) {
      this.screenTime += this.fetched.screenTime;
      this.timerCount += this.fetched.timerCount;
    }
  }

  render() {
    return (
      <div>
        <h1>You've been using iCare for {this.screenTime} seconds today.</h1>
        <h1>You've taken {this.timerCount} breaks today.</h1>
      </div>
    );
  }
}
