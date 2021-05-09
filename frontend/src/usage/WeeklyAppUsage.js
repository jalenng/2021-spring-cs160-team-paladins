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
    this.backgroundColor = []

    this.screenTime = 0;
    this.timerCount = 0;
    if (this.fetched != null) {
      this.screenTime += this.fetched.screenTime;
      this.timerCount += this.fetched.timerCount;
    }

    // Get data usage values.
    this.dataUsage = store.dataUsage.getAll();
    this.appUsage = this.dataUsage.unsynced.appUsage;

    // Get apps names & usage from unsynced.
    this.labels = [];
    this.usage = [];
    for (var i=0; i < this.appUsage.length; i++) {
      this.labels.push(this.appUsage[i].appName);
      // appUsage converted from milliseconds -> minutes
      var seconds = this.appUsage[i].appTime / 1000;
      var minutes = Math.floor(seconds / 60);
      this.usage.push(minutes);
      this.backgroundColor.push("rgba(72, 121, 240, 1)");
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
                label: "Total Weekly Usage (Minutes)",
                data: this.usage,
                backgroundColor: this.backgroundColor,
              },
            ],
          }}
          height={400}
          width={30}
          options={{
            title: {
              display: true,
              text: "Weekly App Usage",
              fontColor: "#FFFFFF",
              fontSize: 20,
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
