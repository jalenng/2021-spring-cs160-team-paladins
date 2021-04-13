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
              data: [300, 500, 600, 600, 1000, 300, 1000],
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
              data: [47, 52, 67, 58, 60, 50, 45],
              backgroundColor: "lightblue",
            },
          ],
        }}
        height={150}
        width={30}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
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
