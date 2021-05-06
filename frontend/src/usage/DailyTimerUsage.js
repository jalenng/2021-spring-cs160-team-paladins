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

export default class DailyTimerUsage extends React.Component {

  constructor(props) {
    super(props);
    this.date = new Date();
    this.weekday = weekday[this.date.getDay()];

    // Get data usage values.
    this.usage = store.dataUsage.getAll();
    this.screenTime = Math.trunc(this.usage.fetched.timerUsage.screenTime);
    this.timerCount = this.usage.fetched.timerUsage.timerCount;
  }

   // change to axios.put to update values.
  updateUsage(break_len) {
    this.breaks = this.breaks + break_len;
  }

  render() {
    console.log(' screen time : ' + this.screenTime);
    return (
      <div>
        <div>
          {/* Daily screen time */}
          <Bar
            data={{
              data: this.screenTime,
              labels: [
                this.weekday,
              ],
              datasets: [
                {
                  label: "Daily Screen Usage (Seconds)",
                  data: [this.screenTime],
                  backgroundColor: [
                    "rgba(72, 121, 240, 1)",
                  ],
                },
              ],
            }}
            height={400}
            width={30}
            options={{
              title: {
                display: true,
                text: "Screen Usage (seconds)",
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

        <div>
        <Bar
            data={{
              labels: [
                this.weekday,
              ],
              datasets: [
                {
                  label: "Breaks",
                  data: [this.timerCount],
                  backgroundColor: [
                    "rgba(72, 121, 240, 1)",
                  ],
                },
              ],
            }}
            height={400}
            width={30}
            options={{
              title: {
                display: true,
                text: "# of breaks",
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
</div>
    );
  }
}
