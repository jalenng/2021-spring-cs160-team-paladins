import React from "react";
import { Pie, defaults } from "react-chartjs-2";

defaults.global.tooltips.enabled = true;
defaults.global.legend.position = "right";

const BarChart = () => {
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
              data: [0.2, 0.1, 0.1, 0.3, 0.2, 0.1],
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
        height={200}
        width={300}
        options={{
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
