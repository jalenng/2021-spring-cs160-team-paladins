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
        <Bar
          data={{
            labels: this.labels,
            datasets: [
              {
                label: "Total usage (hours)",
                data: [5, 6, 6.5, 6, 8, 3, 5],
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
                data: [15, 18, 20, 20, 24, 9, 15],
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
