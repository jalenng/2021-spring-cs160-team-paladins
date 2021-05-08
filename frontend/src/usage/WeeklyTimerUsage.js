import React from "react";
import { Bar, defaults } from "react-chartjs-2"
import Usage from "./Usage.js"

defaults.global.tooltips.enabled = true;

export default class BarChart extends React.Component {

  constructor(props) {
    super(props);
    let usage = new Usage();
    let weeklyUsage = usage.getPastWeek();
    this.labels = weeklyUsage.names;

    this.formatted = weeklyUsage.formatted;
    console.log(this.formatted);
    var i;
    this.timerUsage = {
      screenUsage:  [],
      timerCount: []
    }
    for (i=0; i < this.formatted.length; i++) {
      let usageObj = usage.getUsage(usage.state.fetched.timerUsage, this.formatted[i]);
      console.log(usageObj);
      this.timerUsage.screenUsage.push(usageObj.screenTime);
      this.timerUsage.timerCount.push(usageObj.timerCount);
    }
  }

  render() {

    return (
      <div>
        <Bar
          data={{
            labels: this.labels,
            datasets: [
              {
                label: "Total usage (hours)",
                data: this.timerUsage.screenUsage,
                backgroundColor: [
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                ],
              },
              {
                label: "Total # of breaks",
                data: this.timerUsage.timerCount,
                backgroundColor: "lightblue",
              },
            ],
          }}
          height={400}
          width={30}
          options={{
            title: {
              display: true,
              text: "Weekly Timer Usage",
              fontColor: "#FFFFFF",
              fontSize: 15,
              padding: 10,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: "#FFFFFF",
                  },
                },
              ],
              xAxes: [
                {
                  ticks: { fontColor: "#FFFFFF" },
                },
              ],
            },
            maintainAspectRatio: false,
            legend: {
              position: "right",
              labels: {
                fontSize: 15,
                fontColor: "#FFFFFF",
              },
            },
          }}
        />
      </div>
    );
  }
}
