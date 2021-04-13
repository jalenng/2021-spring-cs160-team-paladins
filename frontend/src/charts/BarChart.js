import React from "react";
import { Bar, defaults } from "react-chartjs-2";

defaults.global.tooltips.enabled = true;
defaults.global.legend.position = "right";

const BarChart = () => {
  return (
    <div>
      <Bar
        data={{
          labels: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          datasets: [
            {
              label: "Total time usage",
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
              label: "Number of break",
              data: [15, 18, 20, 20, 24, 9, 15],
              backgroundColor: "lightblue",
            },
          ],
        }}
        height={150}
        width={30}
        options={{
          title: {
            display: true,
            text: "Weekly Icare Hour Usage and Number of Break Time",
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
            labels: {
              fontSize: 15,
              fontColor: "#FFFFFF",
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
