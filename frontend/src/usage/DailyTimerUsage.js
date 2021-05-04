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

    // get data usage.
    this.usage = store.dataUsage.getAll();
    this.minutes = Math.trunc(this.usage.unsynced.timerUsage.screenTime / 60);
    this.breaks = this.usage.unsynced.timerUsage.timerCount;
  }

   // change to axios.put to update values.
  updateUsage(break_len) {
    this.breaks = this.breaks + break_len;
  }

  render() {
    return (
      <div>
        <div>
          {/* Daily screen time */}
          <Bar
            data={{
              labels: [
                this.weekday,
              ],
            }}
            height={400}
            width={30}
            options={{
              title: {
                display: true,
                text: "Total Screen Time (minutes)",
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
            }}
            height={400}
            width={30}
            options={{
              title: {
                display: true,
                text: "Total # of breaks",
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
