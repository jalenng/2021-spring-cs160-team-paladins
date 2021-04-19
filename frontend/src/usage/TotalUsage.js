import React from "react";
import { Bar} from "react-chartjs-2"

export default class TotalUsage extends React.Component {

  constructor(props) {
    super(props);
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
              "Total Usage"
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
