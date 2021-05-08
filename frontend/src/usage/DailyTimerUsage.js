import React from "react";
import { Bar, defaults } from "react-chartjs-2"
import Usage from "./Usage.js"

defaults.global.tooltips.enabled = true;

export default class DailyTimerUsage extends React.Component {

  constructor(props) {
    super(props);
    let usage = new Usage();
    this.timerUsage = usage.getDailyUsage(usage.fetched.timerUsage);

    this.screenTime = this.timerUsage.screenTime;
    this.timerCount = this.timerUsage.timerCount;
  }

  render() {
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
