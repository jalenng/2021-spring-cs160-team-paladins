import React from "react";
import { Pie, defaults} from "react-chartjs-2";

defaults.global.tooltips.enabled = true;

export default class WeeklyAppUsage extends React.Component {
  render() {
    return (
      <div>
        <Pie
          data={{
            labels: [
              "Zoom",
              "Spotify",
              "Netflix",
              "VS Code",
              "Google Chrome",
              "Others",
            ],
            datasets: [
              {
                data: [200, 1000, 410, 300, 520, 700],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
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
              text: "Weekly App Usage",
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
