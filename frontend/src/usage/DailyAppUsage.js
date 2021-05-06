import React from "react";
import { Pie, defaults} from "react-chartjs-2";

defaults.global.tooltips.enabled = true;

export default class DailyAppUsage extends React.Component {

  constructor(props) {
    super(props);
    // Get data usage values.
    this.dataUsage = store.dataUsage.getAll();
    this.appUsage = this.dataUsage.unsynced.appUsage;
    this.labels = [];
    this.usage = [];
    for (var i=0; i < this.appUsage.length; i++) {
      this.labels.push(this.appUsage[i].appName);
      this.usage.push(this.appUsage[i].appTime);
    }
  }

  render() {
    return (
      <div>
        <Pie
          data={{
            labels: this.labels,
            datasets: [
              {
                data: this.usage,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgb(219,112,147, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(30, 130, 76, 0.2)",
                  "rgba(149, 165, 166, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgb(219,112,147, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(30, 130, 76, 1)",
                  "rgba(149, 165, 166, 1)",
                  "rgba(46, 49, 49, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
          height={400}
          width={800}
          options={{
            title: {
              display: true,
              text: "Daily App Usage",
              fontColor: "#FFFFFF",
              fontSize: 15,
              padding: 10,
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
