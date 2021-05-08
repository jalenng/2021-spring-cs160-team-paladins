import React from "react";
import { Bar, defaults } from "react-chartjs-2"

defaults.global.tooltips.enabled = true;

let weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

export default class DailyUsage extends React.Component {

  constructor(props) {
    super(props);
    this.date = new Date();
    this.weekday = weekday[this.date.getDay()];

    // change to axios.get to get current values. 
    this.hours = 5;
    this.breaks = 10;
  }

   // change to axios.put to update values.
  updateUsage(break_len) {
    this.breaks = this.breaks + break_len;
  }

  render() {

    return (
      <div>
        <Bar
          data={{
            labels: [
              this.weekday,
            ],
            datasets: [
              {
                label: "Total usage (hours)",
                data: [this.hours],
                backgroundColor: [
                  "rgba(72, 121, 240, 1)",
                ],
              },
              {
                label: "Total # of breaks",
                data: [this.breaks],
                backgroundColor: "lightblue",
              },
            ],
          }}
          height={400}
          width={30}
          options={{
            title: {
              display: true,
              text: "Daily Timer Usage",
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
